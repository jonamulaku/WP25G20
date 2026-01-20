using WP25G20.Models;
using TaskModel = WP25G20.Models.Task;

namespace WP25G20.Repositories
{
    public interface ITaskRepository
    {
        System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetAllAsync();
        System.Threading.Tasks.Task<TaskModel?> GetByIdAsync(int id);
        System.Threading.Tasks.Task<TaskModel?> GetByIdWithDetailsAsync(int id);
        System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetByCampaignIdAsync(int campaignId);
        System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetByUserIdAsync(string userId);
        System.Threading.Tasks.Task<IEnumerable<TaskModel>> GetPendingTasksAsync();
        System.Threading.Tasks.Task<TaskModel> CreateAsync(TaskModel task);
        System.Threading.Tasks.Task<TaskModel> UpdateAsync(TaskModel task);
        System.Threading.Tasks.Task<bool> DeleteAsync(int id);
        System.Threading.Tasks.Task<bool> ExistsAsync(int id);
        System.Threading.Tasks.Task<IEnumerable<TaskModel>> SearchAsync(string searchTerm);
    }
}
