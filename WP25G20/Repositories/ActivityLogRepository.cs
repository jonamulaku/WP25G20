using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class ActivityLogRepository : IActivityLogRepository
    {
        private readonly ApplicationDbContext _context;

        public ActivityLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ActivityLog> CreateAsync(ActivityLog log)
        {
            log.CreatedAt = DateTime.UtcNow;
            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId)
        {
            return await _context.ActivityLogs
                .Where(l => l.UserId == userId)
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ActivityLog>> GetByEntityTypeAsync(string entityType)
        {
            return await _context.ActivityLogs
                .Where(l => l.EntityType == entityType)
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ActivityLog>> GetRecentAsync(int count = 100)
        {
            return await _context.ActivityLogs
                .Include(l => l.User)
                .OrderByDescending(l => l.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}
