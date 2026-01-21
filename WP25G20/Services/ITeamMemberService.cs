using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface ITeamMemberService
    {
        Task<PagedResultDTO<TeamMemberDTO>> GetAllAsync(FilterDTO filter);
        Task<TeamMemberDTO?> GetByIdAsync(int id);
        Task<TeamMemberDTO> CreateAsync(TeamMemberCreateDTO dto);
        Task<TeamMemberDTO?> UpdateAsync(int id, TeamMemberUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
