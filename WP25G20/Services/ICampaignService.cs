using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface ICampaignService
    {
        Task<PagedResultDTO<CampaignDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null);
        Task<CampaignDTO?> GetByIdAsync(int id, string? userId = null);
        Task<CampaignDTO> CreateAsync(CampaignCreateDTO dto, string userId);
        Task<CampaignDTO?> UpdateAsync(int id, CampaignUpdateDTO dto, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<bool> ExistsAsync(int id);
    }
}
