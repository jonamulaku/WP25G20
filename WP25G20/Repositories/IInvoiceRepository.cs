using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface IInvoiceRepository
    {
        Task<IEnumerable<Invoice>> GetAllAsync();
        Task<Invoice?> GetByIdAsync(int id);
        Task<Invoice?> GetByInvoiceNumberAsync(string invoiceNumber);
        Task<IEnumerable<Invoice>> GetByClientIdAsync(int clientId);
        Task<IEnumerable<Invoice>> GetByCampaignIdAsync(int campaignId);
        Task<Invoice> CreateAsync(Invoice invoice);
        Task<Invoice> UpdateAsync(Invoice invoice);
        Task<bool> DeleteAsync(int id);
        Task<bool> InvoiceNumberExistsAsync(string invoiceNumber);
        Task<string> GenerateInvoiceNumberAsync();
    }
}
