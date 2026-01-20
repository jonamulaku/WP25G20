using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface IServiceRepository
    {
        Task<IEnumerable<Service>> GetAllAsync();
        Task<Service?> GetByIdAsync(int id);
        Task<IEnumerable<Service>> GetActiveServicesAsync();
        Task<Service> CreateAsync(Service service);
        Task<Service> UpdateAsync(Service service);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Service>> SearchAsync(string searchTerm);
    }
}
