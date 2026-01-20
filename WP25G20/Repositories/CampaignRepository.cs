using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class CampaignRepository : ICampaignRepository
    {
        private readonly ApplicationDbContext _context;

        public CampaignRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Campaign>> GetAllAsync()
        {
            return await _context.Campaigns
                .Include(c => c.Client)
                .Include(c => c.Service)
                .Include(c => c.CreatedBy)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Campaign?> GetByIdAsync(int id)
        {
            return await _context.Campaigns
                .Include(c => c.Client)
                .Include(c => c.Service)
                .Include(c => c.CreatedBy)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Campaign?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Campaigns
                .Include(c => c.Client)
                .Include(c => c.Service)
                .Include(c => c.CreatedBy)
                .Include(c => c.Tasks)
                .Include(c => c.CampaignUsers)
                    .ThenInclude(cu => cu.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Campaign>> GetByClientIdAsync(int clientId)
        {
            return await _context.Campaigns
                .Where(c => c.ClientId == clientId)
                .Include(c => c.Service)
                .Include(c => c.CreatedBy)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetByUserIdAsync(string userId)
        {
            return await _context.Campaigns
                .Where(c => c.CreatedById == userId || 
                           c.CampaignUsers.Any(cu => cu.UserId == userId))
                .Include(c => c.Client)
                .Include(c => c.Service)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Campaign>> GetActiveCampaignsAsync()
        {
            return await _context.Campaigns
                .Where(c => c.Status == CampaignStatus.Active)
                .Include(c => c.Client)
                .Include(c => c.Service)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Campaign> CreateAsync(Campaign campaign)
        {
            campaign.CreatedAt = DateTime.UtcNow;
            _context.Campaigns.Add(campaign);
            await _context.SaveChangesAsync();
            return campaign;
        }

        public async Task<Campaign> UpdateAsync(Campaign campaign)
        {
            campaign.UpdatedAt = DateTime.UtcNow;
            _context.Campaigns.Update(campaign);
            await _context.SaveChangesAsync();
            return campaign;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var campaign = await _context.Campaigns.FindAsync(id);
            if (campaign == null) return false;

            _context.Campaigns.Remove(campaign);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Campaigns.AnyAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Campaign>> SearchAsync(string searchTerm)
        {
            return await _context.Campaigns
                .Where(c => c.Name.Contains(searchTerm) ||
                           (c.Description != null && c.Description.Contains(searchTerm)) ||
                           c.Client.CompanyName.Contains(searchTerm))
                .Include(c => c.Client)
                .Include(c => c.Service)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }
    }
}
