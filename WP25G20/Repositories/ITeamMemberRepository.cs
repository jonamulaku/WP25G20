using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface ITeamMemberRepository
    {
        Task<IEnumerable<TeamMember>> GetAllAsync();
        Task<TeamMember?> GetByIdAsync(int id);
        Task<IEnumerable<TeamMember>> GetActiveTeamMembersAsync();
        Task<TeamMember> CreateAsync(TeamMember teamMember);
        Task<TeamMember> UpdateAsync(TeamMember teamMember);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<IEnumerable<TeamMember>> SearchAsync(string searchTerm);
    }
}
