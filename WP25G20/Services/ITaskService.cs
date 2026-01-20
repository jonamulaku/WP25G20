using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface ITaskService
    {
        Task<PagedResultDTO<TaskDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null);
        Task<PagedResultDTO<TaskDTO>> GetMyTasksAsync(string userId, FilterDTO filter);
        Task<TaskDTO?> GetByIdAsync(int id, string? userId = null);
        Task<TaskDTO> CreateAsync(TaskCreateDTO dto, string userId);
        Task<TaskDTO?> UpdateAsync(int id, TaskUpdateDTO dto, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<bool> ExistsAsync(int id);
    }
}
