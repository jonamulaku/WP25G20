using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface IInvoiceService
    {
        Task<PagedResultDTO<InvoiceDTO>> GetAllAsync(FilterDTO filter, string? userId, bool isAdmin);
        Task<InvoiceDTO?> GetByIdAsync(int id, string? userId, bool isAdmin);
        Task<IEnumerable<InvoiceDTO>> GetByClientIdAsync(int clientId, string? userId, bool isAdmin);
        Task<IEnumerable<InvoiceDTO>> GetByCampaignIdAsync(int campaignId, string? userId, bool isAdmin);
        Task<InvoiceDTO> CreateAsync(InvoiceCreateDTO dto, string userId);
        Task<InvoiceDTO?> UpdateAsync(int id, InvoiceUpdateDTO dto, string userId, bool isAdmin);
        Task<bool> DeleteAsync(int id, string userId, bool isAdmin);
        Task<bool> MarkAsPaidAsync(int id, DateTime paidDate, string userId);
        Task<bool> MarkAsSentAsync(int id, string userId);
    }
}
