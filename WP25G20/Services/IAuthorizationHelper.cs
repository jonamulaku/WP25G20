namespace WP25G20.Services
{
    public interface IAuthorizationHelper
    {
        Task<bool> CanViewCampaignAsync(int campaignId, string userId, bool isAdmin);
        Task<bool> CanUpdateCampaignAsync(int campaignId, string userId, bool isAdmin);
        Task<bool> CanViewClientAsync(int clientId, string userId, bool isAdmin);
        Task<bool> CanUpdateClientAsync(int clientId, string userId, bool isAdmin);
        Task<bool> CanViewTaskAsync(int taskId, string userId, bool isAdmin);
        Task<bool> CanUpdateTaskAsync(int taskId, string userId, bool isAdmin);
    }
}
