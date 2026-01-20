using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepository;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly ApplicationDbContext _context;

        public PaymentService(
            IPaymentRepository paymentRepository,
            IInvoiceRepository invoiceRepository,
            ApplicationDbContext context)
        {
            _paymentRepository = paymentRepository;
            _invoiceRepository = invoiceRepository;
            _context = context;
        }

        public async Task<PagedResultDTO<PaymentDTO>> GetAllAsync(FilterDTO filter, string? userId, bool isAdmin)
        {
            var query = _context.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Client)
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Campaign)
                .Include(p => p.ProcessedBy)
                .AsQueryable();

            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                query = query.Where(p => p.Invoice.CreatedById == userId);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(p =>
                    p.PaymentNumber.Contains(filter.SearchTerm) ||
                    (p.TransactionId != null && p.TransactionId.Contains(filter.SearchTerm)) ||
                    p.Invoice.InvoiceNumber.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("ClientId") && int.TryParse(filter.Filters["ClientId"], out int clientId))
                {
                    query = query.Where(p => p.Invoice.ClientId == clientId);
                }
            }

            var totalCount = await query.CountAsync();

            var payments = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = payments.Select(MapToDTO).ToList();

            return new PagedResultDTO<PaymentDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<PaymentDTO?> GetByIdAsync(int id, string? userId, bool isAdmin)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return null;

            if (!isAdmin && !string.IsNullOrEmpty(userId) && payment.Invoice.CreatedById != userId)
            {
                throw new UnauthorizedAccessException("You don't have permission to access this payment.");
            }

            return MapToDTO(payment);
        }

        public async Task<IEnumerable<PaymentDTO>> GetByInvoiceIdAsync(int invoiceId, string? userId, bool isAdmin)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);
            if (invoice == null)
                throw new InvalidOperationException("Invoice not found.");

            if (!isAdmin && !string.IsNullOrEmpty(userId) && invoice.CreatedById != userId)
            {
                throw new UnauthorizedAccessException("You don't have permission to access payments for this invoice.");
            }

            var payments = await _paymentRepository.GetByInvoiceIdAsync(invoiceId);
            return payments.Select(MapToDTO);
        }

        public async Task<IEnumerable<PaymentDTO>> GetByClientIdAsync(int clientId, string? userId, bool isAdmin)
        {
            var payments = await _paymentRepository.GetByClientIdAsync(clientId);
            
            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                payments = payments.Where(p => p.Invoice.CreatedById == userId);
            }

            return payments.Select(MapToDTO);
        }

        public async Task<PaymentDTO> CreateAsync(PaymentCreateDTO dto, string userId)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(dto.InvoiceId);
            if (invoice == null)
                throw new InvalidOperationException("Invoice not found.");

            if (invoice.Status == InvoiceStatus.Paid)
                throw new InvalidOperationException("Invoice is already paid.");

            if (invoice.Status == InvoiceStatus.Cancelled)
                throw new InvalidOperationException("Cannot create payment for a cancelled invoice.");

            // Calculate total paid amount
            var existingPayments = await _paymentRepository.GetByInvoiceIdAsync(dto.InvoiceId);
            var totalPaid = existingPayments
                .Where(p => p.Status == PaymentStatus.Completed)
                .Sum(p => p.Amount);

            if (totalPaid + dto.Amount > invoice.TotalAmount)
                throw new InvalidOperationException("Payment amount exceeds the remaining invoice balance.");

            var paymentNumber = await _paymentRepository.GeneratePaymentNumberAsync();

            if (!Enum.TryParse<PaymentMethod>(dto.Method, out var method))
                throw new InvalidOperationException("Invalid payment method.");

            var payment = new Payment
            {
                InvoiceId = dto.InvoiceId,
                PaymentNumber = paymentNumber,
                Amount = dto.Amount,
                Method = method,
                Status = PaymentStatus.Pending,
                TransactionId = dto.TransactionId,
                PaymentReference = dto.PaymentReference,
                PaymentDate = DateTime.UtcNow,
                Notes = dto.Notes
            };

            var createdPayment = await _paymentRepository.CreateAsync(payment);

            // If payment completes the invoice, mark invoice as paid
            var newTotalPaid = totalPaid + dto.Amount;
            if (newTotalPaid >= invoice.TotalAmount && invoice.Status != InvoiceStatus.Paid)
            {
                invoice.Status = InvoiceStatus.Paid;
                invoice.PaidDate = DateTime.UtcNow;
                await _invoiceRepository.UpdateAsync(invoice);
            }

            return MapToDTO(createdPayment);
        }

        public async Task<PaymentDTO?> UpdateAsync(int id, PaymentUpdateDTO dto, string userId, bool isAdmin)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return null;

            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only admins can update payments.");
            }

            if (dto.Amount.HasValue)
                payment.Amount = dto.Amount.Value;

            if (!string.IsNullOrEmpty(dto.Status) && Enum.TryParse<PaymentStatus>(dto.Status, out var status))
            {
                payment.Status = status;
            }

            if (!string.IsNullOrEmpty(dto.TransactionId))
                payment.TransactionId = dto.TransactionId;

            if (!string.IsNullOrEmpty(dto.PaymentReference))
                payment.PaymentReference = dto.PaymentReference;

            if (dto.ProcessedDate.HasValue)
                payment.ProcessedDate = dto.ProcessedDate;

            if (!string.IsNullOrEmpty(dto.Notes))
                payment.Notes = dto.Notes;

            payment.UpdatedAt = DateTime.UtcNow;

            var updatedPayment = await _paymentRepository.UpdateAsync(payment);

            // Update invoice status if payment is completed
            if (updatedPayment.Status == PaymentStatus.Completed)
            {
                await UpdateInvoiceStatusBasedOnPayments(updatedPayment.InvoiceId);
            }

            return MapToDTO(updatedPayment);
        }

        public async Task<PaymentDTO?> ProcessPaymentAsync(PaymentProcessDTO dto, string userId, bool isAdmin)
        {
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only admins can process payments.");
            }

            var payment = await _paymentRepository.GetByIdAsync(dto.PaymentId);
            if (payment == null)
                throw new InvalidOperationException("Payment not found.");

            if (dto.IsSuccess)
            {
                payment.Status = PaymentStatus.Completed;
                payment.ProcessedDate = DateTime.UtcNow;
                payment.ProcessedById = userId;

                if (!string.IsNullOrEmpty(dto.TransactionId))
                    payment.TransactionId = dto.TransactionId;

                if (!string.IsNullOrEmpty(dto.Notes))
                    payment.Notes = dto.Notes;

                await _paymentRepository.UpdateAsync(payment);

                // Update invoice status
                await UpdateInvoiceStatusBasedOnPayments(payment.InvoiceId);
            }
            else
            {
                payment.Status = PaymentStatus.Failed;
                payment.ProcessedDate = DateTime.UtcNow;
                payment.ProcessedById = userId;

                if (!string.IsNullOrEmpty(dto.Notes))
                    payment.Notes = dto.Notes;

                await _paymentRepository.UpdateAsync(payment);
            }

            return MapToDTO(payment);
        }

        public async Task<bool> DeleteAsync(int id, string userId, bool isAdmin)
        {
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only admins can delete payments.");
            }

            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null) return false;

            var invoiceId = payment.InvoiceId;

            var deleted = await _paymentRepository.DeleteAsync(id);

            if (deleted)
            {
                // Recalculate invoice status after payment deletion
                await UpdateInvoiceStatusBasedOnPayments(invoiceId);
            }

            return deleted;
        }

        private async System.Threading.Tasks.Task UpdateInvoiceStatusBasedOnPayments(int invoiceId)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(invoiceId);
            if (invoice == null) return;

            var payments = await _paymentRepository.GetByInvoiceIdAsync(invoiceId);
            var totalPaid = payments
                .Where(p => p.Status == PaymentStatus.Completed)
                .Sum(p => p.Amount);

            if (totalPaid >= invoice.TotalAmount)
            {
                if (invoice.Status != InvoiceStatus.Paid)
                {
                    invoice.Status = InvoiceStatus.Paid;
                    invoice.PaidDate = DateTime.UtcNow;
                    await _invoiceRepository.UpdateAsync(invoice);
                }
            }
            else if (totalPaid > 0)
            {
                if (invoice.Status == InvoiceStatus.Paid)
                {
                    invoice.Status = InvoiceStatus.Sent;
                    invoice.PaidDate = null;
                    await _invoiceRepository.UpdateAsync(invoice);
                }
            }
        }

        private PaymentDTO MapToDTO(Payment payment)
        {
            return new PaymentDTO
            {
                Id = payment.Id,
                InvoiceId = payment.InvoiceId,
                InvoiceNumber = payment.Invoice?.InvoiceNumber ?? string.Empty,
                PaymentNumber = payment.PaymentNumber,
                Amount = payment.Amount,
                Method = payment.Method.ToString(),
                Status = payment.Status.ToString(),
                TransactionId = payment.TransactionId,
                PaymentReference = payment.PaymentReference,
                PaymentDate = payment.PaymentDate,
                ProcessedDate = payment.ProcessedDate,
                Notes = payment.Notes,
                ProcessedByName = payment.ProcessedBy != null 
                    ? $"{payment.ProcessedBy.FirstName} {payment.ProcessedBy.LastName}" 
                    : null,
                CreatedAt = payment.CreatedAt
            };
        }
    }
}
