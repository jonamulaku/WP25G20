using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public UserService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        public async Task<PagedResultDTO<UserDTO>> GetAllAsync(FilterDTO filter)
        {
            var query = _userManager.Users.AsQueryable();

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(u => u.Email!.Contains(filter.SearchTerm) ||
                                        (u.FirstName != null && u.FirstName.Contains(filter.SearchTerm)) ||
                                        (u.LastName != null && u.LastName.Contains(filter.SearchTerm)) ||
                                        u.UserName!.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("IsActive"))
                {
                    var isActive = bool.Parse(filter.Filters["IsActive"]);
                    query = query.Where(u => u.IsActive == isActive);
                }
                if (filter.Filters.ContainsKey("Role"))
                {
                    var role = filter.Filters["Role"];
                    var usersInRole = await _userManager.GetUsersInRoleAsync(role);
                    var userIds = usersInRole.Select(u => u.Id);
                    query = query.Where(u => userIds.Contains(u.Id));
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "email" => filter.SortDescending
                        ? query.OrderByDescending(u => u.Email)
                        : query.OrderBy(u => u.Email),
                    "firstname" => filter.SortDescending
                        ? query.OrderByDescending(u => u.FirstName)
                        : query.OrderBy(u => u.FirstName),
                    "createdat" => filter.SortDescending
                        ? query.OrderByDescending(u => u.CreatedAt)
                        : query.OrderBy(u => u.CreatedAt),
                    _ => query.OrderByDescending(u => u.CreatedAt)
                };
            }
            else
            {
                query = query.OrderByDescending(u => u.CreatedAt);
            }

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = new List<UserDTO>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                items.Add(new UserDTO
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    Roles = roles.ToList(),
                    AssignedTaskCount = user.AssignedTasks.Count,
                    CreatedCampaignCount = user.CreatedCampaigns.Count
                });
            }

            return new PagedResultDTO<UserDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<UserDTO?> GetByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToList(),
                AssignedTaskCount = user.AssignedTasks.Count,
                CreatedCampaignCount = user.CreatedCampaigns.Count
            };
        }

        public async Task<UserDTO?> UpdateAsync(string id, UserUpdateDTO dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return null;

            // Check if email is being changed and if new email exists
            if (user.Email != dto.Email)
            {
                var existingUser = await _userManager.FindByEmailAsync(dto.Email);
                if (existingUser != null && existingUser.Id != id)
                {
                    throw new InvalidOperationException($"A user with email '{dto.Email}' already exists.");
                }
            }

            user.Email = dto.Email;
            user.UserName = dto.Email; // Keep username in sync with email
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.IsActive = dto.IsActive;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                throw new InvalidOperationException($"Failed to update user: {string.Join(", ", updateResult.Errors.Select(e => e.Description))}");
            }

            // Update roles
            if (dto.Roles != null)
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                
                foreach (var roleName in dto.Roles)
                {
                    if (await _roleManager.RoleExistsAsync(roleName))
                    {
                        await _userManager.AddToRoleAsync(user, roleName);
                    }
                }
            }

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDTO
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToList()
            };
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ChangePasswordAsync(string id, UserChangePasswordDTO dto, string currentUserId)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            // Only allow users to change their own password, or admins can change any password
            if (id != currentUserId)
            {
                // Check if current user is admin
                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null) return false;
                
                var isAdmin = await _userManager.IsInRoleAsync(currentUser, "Admin");
                if (!isAdmin)
                {
                    throw new UnauthorizedAccessException("Only admins can change other users' passwords.");
                }
                
                // Admin changing someone else's password - use reset password instead
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
                return result.Succeeded;
            }

            // User changing their own password
            if (dto.NewPassword != dto.ConfirmPassword)
            {
                throw new ArgumentException("New password and confirm password do not match.");
            }

            var changeResult = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            return changeResult.Succeeded;
        }

        public async Task<bool> ExistsAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            return user != null;
        }
    }
}
