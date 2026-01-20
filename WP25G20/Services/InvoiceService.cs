using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly ApplicationDbContext _context;

        public InvoiceService(IInvoiceRepository invoiceRepository, ApplicationDbContext context)
        {
            _invoiceRepository = invoiceRepository;
            _context = context;
        }

        public async Task<PagedResultDTO<InvoiceDTO>> GetAllAsync(FilterDTO filter, string? userId, bool isAdmin)
        {
            var query = _context.Invoices
                .Include(i => i.Client)
                .Include(i => i.Campaign)
                .Include(i => i.CreatedBy)
                .AsQueryable();

            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                query = query.Where(i => i.CreatedById == userId);
            }

            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(i =>
                    i.InvoiceNumber.Contains(filter.SearchTerm) ||
                    i.Client.CompanyName.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("ClientId") && int.TryParse(filter.Filters["ClientId"], out int clientId))
                {
                    query = query.Where(i => i.ClientId == clientId);
                }
            }

            var totalCount = await query.CountAsync();

            var invoices = await query
                .OrderByDescending(i => i.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = invoices.Select(MapToDTO).ToList();

            return new PagedResultDTO<InvoiceDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<InvoiceDTO?> GetByIdAsync(int id, string? userId, bool isAdmin)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null) return null;

            if (!isAdmin && !string.IsNullOrEmpty(userId) && invoice.CreatedById != userId)
            {
                throw new UnauthorizedAccessException("You don't have permission to access this invoice.");
            }

            return MapToDTO(invoice);
        }

        public async Task<IEnumerable<InvoiceDTO>> GetByClientIdAsync(int clientId, string? userId, bool isAdmin)
        {
            var invoices = await _invoiceRepository.GetByClientIdAsync(clientId);
            
            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                invoices = invoices.Where(i => i.CreatedById == userId);
            }

            return invoices.Select(MapToDTO);
        }

        public async Task<IEnumerable<InvoiceDTO>> GetByCampaignIdAsync(int campaignId, string? userId, bool isAdmin)
        {
            var invoices = await _invoiceRepository.GetByCampaignIdAsync(campaignId);
            
            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                invoices = invoices.Where(i => i.CreatedById == userId);
            }

            return invoices.Select(MapToDTO);
        }

        public async Task<InvoiceDTO> CreateAsync(InvoiceCreateDTO dto, string userId)
        {
            var client = await _context.Clients.FindAsync(dto.ClientId);
            if (client == null)
                throw new InvalidOperationException("Client not found.");

            if (dto.CampaignId.HasValue)
            {
                var campaign = await _context.Campaigns.FindAsync(dto.CampaignId.Value);
                if (campaign == null)
                    throw new InvalidOperationException("Campaign not found.");
            }

            var invoiceNumber = await _invoiceRepository.GenerateInvoiceNumberAsync();
            
            var taxAmount = dto.TaxAmount ?? 0;
            var totalAmount = dto.Amount + taxAmount;

            var invoice = new Invoice
            {
                InvoiceNumber = invoiceNumber,
                ClientId = dto.ClientId,
                CampaignId = dto.CampaignId,
                Amount = dto.Amount,
                TaxAmount = taxAmount,
                TotalAmount = totalAmount,
                Status = InvoiceStatus.Draft,
                IssueDate = DateTime.UtcNow,
                DueDate = dto.DueDate,
                Notes = dto.Notes,
                CreatedById = userId
            };

            var createdInvoice = await _invoiceRepository.CreateAsync(invoice);
            return MapToDTO(createdInvoice);
        }

        public async Task<InvoiceDTO?> UpdateAsync(int id, InvoiceUpdateDTO dto, string userId, bool isAdmin)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null) return null;

            if (!isAdmin && invoice.CreatedById != userId)
            {
                throw new UnauthorizedAccessException("You don't have permission to update this invoice.");
            }

            invoice.Amount = dto.Amount;
            invoice.TaxAmount = dto.TaxAmount;
            invoice.TotalAmount = dto.Amount + (dto.TaxAmount ?? 0);
            
            if (!string.IsNullOrEmpty(dto.Status) && Enum.TryParse<InvoiceStatus>(dto.Status, out var status))
            {
                invoice.Status = status;
            }
            
            invoice.DueDate = dto.DueDate;
            invoice.PaidDate = dto.PaidDate;
            invoice.Notes = dto.Notes;
            invoice.UpdatedAt = DateTime.UtcNow;

            var updatedInvoice = await _invoiceRepository.UpdateAsync(invoice);
            return MapToDTO(updatedInvoice);
        }

        public async Task<bool> DeleteAsync(int id, string userId, bool isAdmin)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null) return false;

            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only admins can delete invoices.");
            }

            return await _invoiceRepository.DeleteAsync(id);
        }

        public async Task<bool> MarkAsPaidAsync(int id, DateTime paidDate, string userId)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null) return false;

            invoice.Status = InvoiceStatus.Paid;
            invoice.PaidDate = paidDate;
            invoice.UpdatedAt = DateTime.UtcNow;

            await _invoiceRepository.UpdateAsync(invoice);
            return true;
        }

        public async Task<bool> MarkAsSentAsync(int id, string userId)
        {
            var invoice = await _invoiceRepository.GetByIdAsync(id);
            if (invoice == null) return false;

            if (invoice.Status == InvoiceStatus.Draft)
            {
                invoice.Status = InvoiceStatus.Sent;
                invoice.UpdatedAt = DateTime.UtcNow;
                await _invoiceRepository.UpdateAsync(invoice);
            }

            return true;
        }

        private InvoiceDTO MapToDTO(Invoice invoice)
        {
            return new InvoiceDTO
            {
                Id = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                ClientId = invoice.ClientId,
                ClientName = invoice.Client?.CompanyName ?? string.Empty,
                CampaignId = invoice.CampaignId,
                CampaignName = invoice.Campaign?.Name,
                Amount = invoice.Amount,
                TaxAmount = invoice.TaxAmount,
                TotalAmount = invoice.TotalAmount,
                Status = invoice.Status.ToString(),
                IssueDate = invoice.IssueDate,
                DueDate = invoice.DueDate,
                PaidDate = invoice.PaidDate,
                Notes = invoice.Notes,
                CreatedAt = invoice.CreatedAt
            };
        }
    }
}
