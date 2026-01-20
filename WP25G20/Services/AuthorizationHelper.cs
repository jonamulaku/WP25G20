using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Services
{
    public class AuthorizationHelper : IAuthorizationHelper
    {
        private readonly ApplicationDbContext _context;

        public AuthorizationHelper(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CanViewCampaignAsync(int campaignId, string userId, bool isAdmin)
        {
            if (isAdmin) return true;

            var campaign = await _context.Campaigns
                .Include(c => c.CampaignUsers)
                .FirstOrDefaultAsync(c => c.Id == campaignId);

            if (campaign == null) return false;

            // User can view if they created it or are assigned to it
            return campaign.CreatedById == userId ||
                   campaign.CampaignUsers.Any(cu => cu.UserId == userId);
        }

        public async Task<bool> CanUpdateCampaignAsync(int campaignId, string userId, bool isAdmin)
        {
            if (isAdmin) return true;

            var campaign = await _context.Campaigns
                .Include(c => c.CampaignUsers)
                .FirstOrDefaultAsync(c => c.Id == campaignId);

            if (campaign == null) return false;

            // User can update if they created it or have Editor role
            if (campaign.CreatedById == userId) return true;

            var campaignUser = campaign.CampaignUsers.FirstOrDefault(cu => cu.UserId == userId);
            return campaignUser != null && campaignUser.Role == CampaignUserRole.Editor;
        }

        public async Task<bool> CanViewClientAsync(int clientId, string userId, bool isAdmin)
        {
            if (isAdmin) return true;

            var client = await _context.Clients.FindAsync(clientId);
            if (client == null) return false;

            // User can view if they created it
            return client.CreatedById == userId;
        }

        public async Task<bool> CanUpdateClientAsync(int clientId, string userId, bool isAdmin)
        {
            if (isAdmin) return true;

            var client = await _context.Clients.FindAsync(clientId);
            if (client == null) return false;

            // User can update if they created it
            return client.CreatedById == userId;
        }

        public async Task<bool> CanViewTaskAsync(int taskId, string userId, bool isAdmin)
        {
            if (isAdmin) return true;

            var task = await _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.CampaignUsers)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) return false;

            // User can view if they created it, are assigned to it, or have access to the campaign
            if (task.CreatedById == userId || task.AssignedToId == userId) return true;

            var campaign = task.Campaign;
            return campaign.CreatedById == userId ||
                   campaign.CampaignUsers.Any(cu => cu.UserId == userId);
        }

        public async Task<bool> CanUpdateTaskAsync(int taskId, string userId, bool isAdmin)
        {
            if (isAdmin) return true;

            var task = await _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.CampaignUsers)
                .FirstOrDefaultAsync(t => t.Id == taskId);

            if (task == null) return false;

            // User can update if they created it, are assigned to it, or have Editor role on campaign
            if (task.CreatedById == userId || task.AssignedToId == userId) return true;

            var campaign = task.Campaign;
            if (campaign.CreatedById == userId) return true;

            var campaignUser = campaign.CampaignUsers.FirstOrDefault(cu => cu.UserId == userId);
            return campaignUser != null && campaignUser.Role == CampaignUserRole.Editor;
        }
    }
}
