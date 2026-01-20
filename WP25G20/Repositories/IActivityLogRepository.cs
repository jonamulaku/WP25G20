using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface IActivityLogRepository
    {
        Task<ActivityLog> CreateAsync(ActivityLog log);
        Task<IEnumerable<ActivityLog>> GetByUserIdAsync(string userId);
        Task<IEnumerable<ActivityLog>> GetByEntityTypeAsync(string entityType);
        Task<IEnumerable<ActivityLog>> GetRecentAsync(int count = 100);
    }
}
