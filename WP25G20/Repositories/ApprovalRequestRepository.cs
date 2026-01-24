using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class ApprovalRequestRepository : IApprovalRequestRepository
    {
        private readonly ApplicationDbContext _context;

        public ApprovalRequestRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ApprovalRequest>> GetAllAsync()
        {
            return await _context.ApprovalRequests
                .Include(ar => ar.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.ApprovedBy)
                .Include(ar => ar.Comments)
                    .ThenInclude(c => c.CreatedBy)
                .OrderByDescending(ar => ar.CreatedAt)
                .ToListAsync();
        }

        public async Task<ApprovalRequest?> GetByIdAsync(int id)
        {
            return await _context.ApprovalRequests
                .Include(ar => ar.Campaign)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.ApprovedBy)
                .FirstOrDefaultAsync(ar => ar.Id == id);
        }

        public async Task<ApprovalRequest?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.ApprovalRequests
                .Include(ar => ar.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.ApprovedBy)
                .Include(ar => ar.Comments)
                    .ThenInclude(c => c.CreatedBy)
                .FirstOrDefaultAsync(ar => ar.Id == id);
        }

        public async Task<IEnumerable<ApprovalRequest>> GetByCampaignIdAsync(int campaignId)
        {
            return await _context.ApprovalRequests
                .Where(ar => ar.CampaignId == campaignId)
                .Include(ar => ar.Campaign)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.ApprovedBy)
                .Include(ar => ar.Comments)
                    .ThenInclude(c => c.CreatedBy)
                .OrderByDescending(ar => ar.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ApprovalRequest>> GetByClientEmailAsync(string clientEmail)
        {
            return await _context.ApprovalRequests
                .Where(ar => ar.Campaign.Client.Email.ToLower() == clientEmail.ToLower())
                .Include(ar => ar.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.ApprovedBy)
                .Include(ar => ar.Comments)
                    .ThenInclude(c => c.CreatedBy)
                .OrderByDescending(ar => ar.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ApprovalRequest>> GetPendingByClientEmailAsync(string clientEmail)
        {
            return await _context.ApprovalRequests
                .Where(ar => ar.Campaign.Client.Email.ToLower() == clientEmail.ToLower() && 
                            ar.Status == ApprovalStatus.Pending)
                .Include(ar => ar.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.Comments)
                    .ThenInclude(c => c.CreatedBy)
                .OrderByDescending(ar => ar.CreatedAt)
                .ToListAsync();
        }

        public async Task<ApprovalRequest> CreateAsync(ApprovalRequest approvalRequest)
        {
            approvalRequest.CreatedAt = DateTime.UtcNow;
            _context.ApprovalRequests.Add(approvalRequest);
            await _context.SaveChangesAsync();
            return approvalRequest;
        }

        public async Task<ApprovalRequest> UpdateAsync(ApprovalRequest approvalRequest)
        {
            approvalRequest.UpdatedAt = DateTime.UtcNow;
            _context.ApprovalRequests.Update(approvalRequest);
            await _context.SaveChangesAsync();
            return approvalRequest;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var approvalRequest = await _context.ApprovalRequests.FindAsync(id);
            if (approvalRequest == null) return false;

            _context.ApprovalRequests.Remove(approvalRequest);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.ApprovalRequests.AnyAsync(ar => ar.Id == id);
        }
    }
}
