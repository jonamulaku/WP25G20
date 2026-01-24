using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;

        public InvoiceService(IInvoiceRepository invoiceRepository, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _invoiceRepository = invoiceRepository;
            _context = context;
            _userManager = userManager;
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
                // For clients, show invoices where Client.Email matches their email
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    query = query.Where(i => i.Client.Email.ToLower() == user.Email.ToLower());
                }
                else
                {
                    // Fallback: show invoices created by this user
                    query = query.Where(i => i.CreatedById == userId);
                }
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

            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                // For clients, check if Client.Email matches their email
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    if (invoice.Client.Email.ToLower() != user.Email.ToLower())
                    {
                        throw new UnauthorizedAccessException("You don't have permission to access this invoice.");
                    }
                }
                else if (invoice.CreatedById != userId)
                {
                    throw new UnauthorizedAccessException("You don't have permission to access this invoice.");
                }
            }

            return MapToDTO(invoice);
        }

        public async Task<IEnumerable<InvoiceDTO>> GetByClientIdAsync(int clientId, string? userId, bool isAdmin)
        {
            var invoices = await _invoiceRepository.GetByClientIdAsync(clientId);
            
            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                // For clients, check if Client.Email matches their email
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    invoices = invoices.Where(i => i.Client.Email.ToLower() == user.Email.ToLower());
                }
                else
                {
                    invoices = invoices.Where(i => i.CreatedById == userId);
                }
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

        public async Task<IEnumerable<InvoiceDTO>> EnsureInvoicesForCampaignsAsync(string? userId, bool isAdmin)
        {
            // Get all campaigns
            var campaignsQuery = _context.Campaigns
                .Include(c => c.Client)
                .Include(c => c.Invoices)
                .AsQueryable();

            // Filter by client email if user is a client
            if (!isAdmin && !string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    campaignsQuery = campaignsQuery.Where(c => c.Client.Email.ToLower() == user.Email.ToLower());
                }
            }

            var campaigns = await campaignsQuery.ToListAsync();
            var createdInvoices = new List<Invoice>();

            foreach (var campaign in campaigns)
            {
                // Check if campaign already has an invoice
                if (campaign.Invoices != null && campaign.Invoices.Any())
                {
                    continue; // Campaign already has an invoice
                }

                // Create invoice for this campaign using the budget as the amount
                var invoiceNumber = await _invoiceRepository.GenerateInvoiceNumberAsync();
                
                // Calculate due date (30 days from now)
                var dueDate = DateTime.UtcNow.AddDays(30);

                var invoice = new Invoice
                {
                    InvoiceNumber = invoiceNumber,
                    ClientId = campaign.ClientId,
                    CampaignId = campaign.Id,
                    Amount = campaign.Budget,
                    TaxAmount = 0, // No tax by default, can be added later
                    TotalAmount = campaign.Budget,
                    Status = InvoiceStatus.Sent, // Mark as sent so client can see it
                    IssueDate = DateTime.UtcNow,
                    DueDate = dueDate,
                    Notes = $"Invoice for campaign: {campaign.Name}",
                    CreatedById = userId
                };

                var createdInvoice = await _invoiceRepository.CreateAsync(invoice);
                createdInvoices.Add(createdInvoice);
            }

            return createdInvoices.Select(MapToDTO);
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
