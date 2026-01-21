using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;
using TaskModel = WP25G20.Models.Task;
using TaskStatus = WP25G20.Models.TaskStatus;

namespace WP25G20.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetAllAsync()
        {
            return await _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<TaskModel?> GetByIdAsync(int id)
        {
            return await _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async System.Threading.Tasks.Task<TaskModel?> GetByIdWithDetailsAsync(int id)
        {
            return await _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Include(t => t.TaskFiles)
                .Include(t => t.TaskComments)
                    .ThenInclude(tc => tc.CreatedBy)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetByCampaignIdAsync(int campaignId)
        {
            return await _context.Tasks
                .Where(t => t.CampaignId == campaignId)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetByUserIdAsync(string userId)
        {
            return await _context.Tasks
                .Where(t => t.AssignedToId == userId)
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.CreatedBy)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetPendingTasksAsync()
        {
            return await _context.Tasks
                .Where(t => t.Status == TaskStatus.Pending || t.Status == TaskStatus.InProgress)
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .OrderBy(t => t.DueDate)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<TaskModel> CreateAsync(TaskModel task)
        {
            task.CreatedAt = DateTime.UtcNow;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async System.Threading.Tasks.Task<TaskModel> UpdateAsync(TaskModel task)
        {
            task.UpdatedAt = DateTime.UtcNow;
            if (task.Status == TaskStatus.Completed && task.CompletedAt == null)
            {
                task.CompletedAt = DateTime.UtcNow;
            }
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async System.Threading.Tasks.Task<bool> DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async System.Threading.Tasks.Task<bool> ExistsAsync(int id)
        {
            return await _context.Tasks.AnyAsync(t => t.Id == id);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskModel>> SearchAsync(string searchTerm)
        {
            return await _context.Tasks
                .Where(t => t.Title.Contains(searchTerm) ||
                           (t.Description != null && t.Description.Contains(searchTerm)) ||
                           t.Campaign.Name.Contains(searchTerm))
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }
    }
}
