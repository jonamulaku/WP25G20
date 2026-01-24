using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface IApprovalRequestRepository
    {
        Task<IEnumerable<ApprovalRequest>> GetAllAsync();
        Task<ApprovalRequest?> GetByIdAsync(int id);
        Task<ApprovalRequest?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<ApprovalRequest>> GetByCampaignIdAsync(int campaignId);
        Task<IEnumerable<ApprovalRequest>> GetByClientEmailAsync(string clientEmail);
        Task<IEnumerable<ApprovalRequest>> GetPendingByClientEmailAsync(string clientEmail);
        Task<ApprovalRequest> CreateAsync(ApprovalRequest approvalRequest);
        Task<ApprovalRequest> UpdateAsync(ApprovalRequest approvalRequest);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
