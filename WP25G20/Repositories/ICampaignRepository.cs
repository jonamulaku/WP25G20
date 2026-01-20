using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface ICampaignRepository
    {
        Task<IEnumerable<Campaign>> GetAllAsync();
        Task<Campaign?> GetByIdAsync(int id);
        Task<Campaign?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Campaign>> GetByClientIdAsync(int clientId);
        Task<IEnumerable<Campaign>> GetByUserIdAsync(string userId);
        Task<IEnumerable<Campaign>> GetActiveCampaignsAsync();
        Task<Campaign> CreateAsync(Campaign campaign);
        Task<Campaign> UpdateAsync(Campaign campaign);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Campaign>> SearchAsync(string searchTerm);
    }
}
