using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);
        Task<Client?> GetByIdWithCampaignsAsync(int id);
        Task<IEnumerable<Client>> GetActiveClientsAsync();
        Task<Client> CreateAsync(Client client);
        Task<Client> UpdateAsync(Client client);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<IEnumerable<Client>> SearchAsync(string searchTerm);
    }
}
