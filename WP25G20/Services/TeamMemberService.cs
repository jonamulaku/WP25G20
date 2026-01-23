using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Services
{
    public class TeamMemberService : ITeamMemberService
    {
        private readonly ITeamMemberRepository _repository;
        private readonly ApplicationDbContext _context;

        public TeamMemberService(ITeamMemberRepository repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<PagedResultDTO<TeamMemberDTO>> GetAllAsync(FilterDTO filter)
        {
            var query = _context.TeamMembers
                .Include(tm => tm.AssignedTasks)
                .AsQueryable();

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(tm => tm.FirstName.Contains(filter.SearchTerm) ||
                                         tm.LastName.Contains(filter.SearchTerm) ||
                                         tm.Email.Contains(filter.SearchTerm) ||
                                         tm.Role.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null && filter.Filters.ContainsKey("IsActive"))
            {
                var isActive = bool.Parse(filter.Filters["IsActive"]);
                query = query.Where(tm => tm.IsActive == isActive);
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "firstname" => filter.SortDescending
                        ? query.OrderByDescending(tm => tm.FirstName)
                        : query.OrderBy(tm => tm.FirstName),
                    "lastname" => filter.SortDescending
                        ? query.OrderByDescending(tm => tm.LastName)
                        : query.OrderBy(tm => tm.LastName),
                    "role" => filter.SortDescending
                        ? query.OrderByDescending(tm => tm.Role)
                        : query.OrderBy(tm => tm.Role),
                    "email" => filter.SortDescending
                        ? query.OrderByDescending(tm => tm.Email)
                        : query.OrderBy(tm => tm.Email),
                    _ => query.OrderBy(tm => tm.FirstName).ThenBy(tm => tm.LastName)
                };
            }
            else
            {
                query = query.OrderBy(tm => tm.FirstName).ThenBy(tm => tm.LastName);
            }

            var totalCount = await query.CountAsync();

            var teamMembers = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = teamMembers.Select(tm => new TeamMemberDTO
            {
                Id = tm.Id,
                FirstName = tm.FirstName,
                LastName = tm.LastName,
                Email = tm.Email,
                Role = tm.Role,
                Description = tm.Description,
                Phone = tm.Phone,
                IsActive = tm.IsActive,
                CreatedAt = tm.CreatedAt,
                AssignedTaskCount = tm.AssignedTasks.Count(t => t.Status != Models.TaskStatus.Pending && t.Status != Models.TaskStatus.Cancelled)
            }).ToList();

            return new PagedResultDTO<TeamMemberDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<TeamMemberDTO?> GetByIdAsync(int id)
        {
            var teamMember = await _repository.GetByIdAsync(id);
            if (teamMember == null) return null;

            return new TeamMemberDTO
            {
                Id = teamMember.Id,
                FirstName = teamMember.FirstName,
                LastName = teamMember.LastName,
                Email = teamMember.Email,
                Role = teamMember.Role,
                Description = teamMember.Description,
                Phone = teamMember.Phone,
                IsActive = teamMember.IsActive,
                CreatedAt = teamMember.CreatedAt,
                AssignedTaskCount = teamMember.AssignedTasks.Count(t => t.Status != Models.TaskStatus.Pending && t.Status != Models.TaskStatus.Cancelled)
            };
        }

        public async Task<TeamMemberDTO> CreateAsync(TeamMemberCreateDTO dto)
        {
            // Check if email already exists
            if (await _repository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"A team member with email '{dto.Email}' already exists.");
            }

            var teamMember = new TeamMember
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Role = dto.Role,
                Description = dto.Description,
                Phone = dto.Phone,
                IsActive = true
            };

            var created = await _repository.CreateAsync(teamMember);

            return new TeamMemberDTO
            {
                Id = created.Id,
                FirstName = created.FirstName,
                LastName = created.LastName,
                Email = created.Email,
                Role = created.Role,
                Description = created.Description,
                Phone = created.Phone,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt,
                AssignedTaskCount = 0
            };
        }

        public async Task<TeamMemberDTO?> UpdateAsync(int id, TeamMemberUpdateDTO dto)
        {
            var teamMember = await _repository.GetByIdAsync(id);
            if (teamMember == null) return null;

            // Check if email already exists (excluding current team member)
            if (teamMember.Email != dto.Email && await _repository.EmailExistsAsync(dto.Email, id))
            {
                throw new InvalidOperationException($"A team member with email '{dto.Email}' already exists.");
            }

            teamMember.FirstName = dto.FirstName;
            teamMember.LastName = dto.LastName;
            teamMember.Email = dto.Email;
            teamMember.Role = dto.Role;
            teamMember.Description = dto.Description;
            teamMember.Phone = dto.Phone;
            teamMember.IsActive = dto.IsActive;

            var updated = await _repository.UpdateAsync(teamMember);

            return new TeamMemberDTO
            {
                Id = updated.Id,
                FirstName = updated.FirstName,
                LastName = updated.LastName,
                Email = updated.Email,
                Role = updated.Role,
                Description = updated.Description,
                Phone = updated.Phone,
                IsActive = updated.IsActive,
                CreatedAt = updated.CreatedAt,
                AssignedTaskCount = updated.AssignedTasks.Count
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }
    }
}
