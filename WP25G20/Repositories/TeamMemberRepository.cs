using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class TeamMemberRepository : ITeamMemberRepository
    {
        private readonly ApplicationDbContext _context;

        public TeamMemberRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TeamMember>> GetAllAsync()
        {
            return await _context.TeamMembers
                .OrderBy(tm => tm.FirstName)
                .ThenBy(tm => tm.LastName)
                .ToListAsync();
        }

        public async Task<TeamMember?> GetByIdAsync(int id)
        {
            return await _context.TeamMembers
                .Include(tm => tm.AssignedTasks)
                .FirstOrDefaultAsync(tm => tm.Id == id);
        }

        public async Task<IEnumerable<TeamMember>> GetActiveTeamMembersAsync()
        {
            return await _context.TeamMembers
                .Where(tm => tm.IsActive)
                .OrderBy(tm => tm.FirstName)
                .ThenBy(tm => tm.LastName)
                .ToListAsync();
        }

        public async Task<TeamMember> CreateAsync(TeamMember teamMember)
        {
            teamMember.CreatedAt = DateTime.UtcNow;
            _context.TeamMembers.Add(teamMember);
            await _context.SaveChangesAsync();
            return teamMember;
        }

        public async Task<TeamMember> UpdateAsync(TeamMember teamMember)
        {
            teamMember.UpdatedAt = DateTime.UtcNow;
            _context.TeamMembers.Update(teamMember);
            await _context.SaveChangesAsync();
            return teamMember;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var teamMember = await _context.TeamMembers.FindAsync(id);
            if (teamMember == null) return false;

            _context.TeamMembers.Remove(teamMember);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.TeamMembers.AnyAsync(tm => tm.Id == id);
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            var query = _context.TeamMembers.Where(tm => tm.Email == email);
            if (excludeId.HasValue)
            {
                query = query.Where(tm => tm.Id != excludeId.Value);
            }
            return await query.AnyAsync();
        }

        public async Task<IEnumerable<TeamMember>> SearchAsync(string searchTerm)
        {
            return await _context.TeamMembers
                .Where(tm => tm.FirstName.Contains(searchTerm) ||
                           tm.LastName.Contains(searchTerm) ||
                           tm.Email.Contains(searchTerm) ||
                           tm.Role.Contains(searchTerm))
                .OrderBy(tm => tm.FirstName)
                .ThenBy(tm => tm.LastName)
                .ToListAsync();
        }
    }
}
