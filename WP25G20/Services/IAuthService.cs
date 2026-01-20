using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> LoginAsync(LoginDTO loginDto);
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO registerDto);
        Task<AuthResponseDTO> RefreshTokenAsync(string refreshToken);
    }
}
