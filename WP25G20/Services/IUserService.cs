using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface IUserService
    {
        Task<PagedResultDTO<UserDTO>> GetAllAsync(FilterDTO filter);
        Task<UserDTO?> GetByIdAsync(string id);
        Task<UserDTO?> UpdateAsync(string id, UserUpdateDTO dto);
        Task<bool> DeleteAsync(string id);
        Task<bool> ChangePasswordAsync(string id, UserChangePasswordDTO dto, string currentUserId);
        Task<bool> ExistsAsync(string id);
    }
}
