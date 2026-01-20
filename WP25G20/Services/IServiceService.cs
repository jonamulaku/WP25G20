using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface IServiceService
    {
        Task<PagedResultDTO<ServiceDTO>> GetAllAsync(FilterDTO filter);
        Task<ServiceDTO?> GetByIdAsync(int id);
        Task<ServiceDTO> CreateAsync(ServiceCreateDTO dto);
        Task<ServiceDTO?> UpdateAsync(int id, ServiceUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
