using WP25G20.DTOs;
using WP25G20.Models;

namespace WP25G20.Services
{
    public interface IClientService
    {
        Task<PagedResultDTO<ClientDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null);
        Task<ClientDTO?> GetByIdAsync(int id, string? userId = null);
        Task<ClientDTO> CreateAsync(ClientCreateDTO dto, string userId);
        Task<ClientDTO?> UpdateAsync(int id, ClientUpdateDTO dto, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<bool> ExistsAsync(int id);
    }
}
