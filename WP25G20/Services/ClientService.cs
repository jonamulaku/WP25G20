using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using System.Security.Claims;

namespace WP25G20.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _repository;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ApplicationDbContext _context;
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;

        public ClientService(
            IClientRepository repository,
            IActivityLogRepository activityLogRepository,
            ApplicationDbContext context,
            IAuthorizationHelper authorizationHelper,
            IHttpContextAccessor httpContextAccessor,
            UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _activityLogRepository = activityLogRepository;
            _context = context;
            _authorizationHelper = authorizationHelper;
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<PagedResultDTO<ClientDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null)
        {
            var query = _context.Clients
                .Include(c => c.CreatedBy)
                .AsQueryable();

            // If userId provided and not admin, filter to only show user's own clients
            if (!string.IsNullOrEmpty(userId) && (isAdmin == null || !isAdmin.Value))
            {
                query = query.Where(c => c.CreatedById == userId);
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(c => c.CompanyName.Contains(filter.SearchTerm) ||
                                        c.Email.Contains(filter.SearchTerm) ||
                                        (c.ContactPerson != null && c.ContactPerson.Contains(filter.SearchTerm)));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("IsActive"))
                {
                    var isActive = bool.Parse(filter.Filters["IsActive"]);
                    query = query.Where(c => c.IsActive == isActive);
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "companyname" => filter.SortDescending 
                        ? query.OrderByDescending(c => c.CompanyName)
                        : query.OrderBy(c => c.CompanyName),
                    "email" => filter.SortDescending
                        ? query.OrderByDescending(c => c.Email)
                        : query.OrderBy(c => c.Email),
                    "createdat" => filter.SortDescending
                        ? query.OrderByDescending(c => c.CreatedAt)
                        : query.OrderBy(c => c.CreatedAt),
                    _ => query.OrderByDescending(c => c.CreatedAt)
                };
            }
            else
            {
                query = query.OrderByDescending(c => c.CreatedAt);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(c => new ClientDTO
                {
                    Id = c.Id,
                    CompanyName = c.CompanyName,
                    ContactPerson = c.ContactPerson,
                    Email = c.Email,
                    Phone = c.Phone,
                    Address = c.Address,
                    Notes = c.Notes,
                    IsActive = c.IsActive,
                    CreatedAt = c.CreatedAt,
                    CampaignCount = c.Campaigns.Count
                })
                .ToListAsync();

            return new PagedResultDTO<ClientDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ClientDTO?> GetByIdAsync(int id, string? userId = null)
        {
            var client = await _repository.GetByIdWithCampaignsAsync(id);
            if (client == null) return null;

            // Check permissions if userId provided
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                
                if (!isAdmin && !await _authorizationHelper.CanViewClientAsync(id, userId, isAdmin))
                {
                    throw new UnauthorizedAccessException("You do not have permission to view this client.");
                }

                // Log read activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Read",
                    EntityType = "Client",
                    EntityId = id,
                    Description = $"Viewed client: {client.CompanyName}",
                    UserId = userId
                });
            }

            return new ClientDTO
            {
                Id = client.Id,
                CompanyName = client.CompanyName,
                ContactPerson = client.ContactPerson,
                Email = client.Email,
                Phone = client.Phone,
                Address = client.Address,
                Notes = client.Notes,
                IsActive = client.IsActive,
                CreatedAt = client.CreatedAt,
                CampaignCount = client.Campaigns.Count
            };
        }

        public async Task<ClientDTO> CreateAsync(ClientCreateDTO dto, string userId)
        {
            // Check if email already exists
            if (await _repository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"A client with email '{dto.Email}' already exists.");
            }

            var client = new Client
            {
                CompanyName = dto.CompanyName,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Notes = dto.Notes,
                IsActive = true,
                CreatedById = userId
            };

            var created = await _repository.CreateAsync(client);

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Create",
                EntityType = "Client",
                EntityId = created.Id,
                Description = $"Created client: {created.CompanyName}",
                UserId = userId
            });

            return new ClientDTO
            {
                Id = created.Id,
                CompanyName = created.CompanyName,
                ContactPerson = created.ContactPerson,
                Email = created.Email,
                Phone = created.Phone,
                Address = created.Address,
                Notes = created.Notes,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt,
                CampaignCount = 0
            };
        }

        public async Task<ClientDTO?> UpdateAsync(int id, ClientUpdateDTO dto, string userId)
        {
            var client = await _repository.GetByIdAsync(id);
            if (client == null) return null;

            // Check permissions
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin && !await _authorizationHelper.CanUpdateClientAsync(id, userId, isAdmin))
            {
                throw new UnauthorizedAccessException("You do not have permission to update this client.");
            }

            // Check if email already exists (excluding current client)
            if (client.Email != dto.Email && await _repository.EmailExistsAsync(dto.Email, id))
            {
                throw new InvalidOperationException($"A client with email '{dto.Email}' already exists.");
            }

            var oldValues = $"{{\"CompanyName\":\"{client.CompanyName}\",\"Email\":\"{client.Email}\",\"IsActive\":{client.IsActive}}}";

            client.CompanyName = dto.CompanyName;
            client.ContactPerson = dto.ContactPerson;
            client.Email = dto.Email;
            client.Phone = dto.Phone;
            client.Address = dto.Address;
            client.Notes = dto.Notes;
            client.IsActive = dto.IsActive;

            var updated = await _repository.UpdateAsync(client);

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Update",
                EntityType = "Client",
                EntityId = updated.Id,
                Description = $"Updated client: {updated.CompanyName}",
                Changes = oldValues,
                UserId = userId
            });

            return new ClientDTO
            {
                Id = updated.Id,
                CompanyName = updated.CompanyName,
                ContactPerson = updated.ContactPerson,
                Email = updated.Email,
                Phone = updated.Phone,
                Address = updated.Address,
                Notes = updated.Notes,
                IsActive = updated.IsActive,
                CreatedAt = updated.CreatedAt,
                CampaignCount = updated.Campaigns.Count
            };
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var client = await _repository.GetByIdAsync(id);
            if (client == null) return false;

            // Check permissions (only admins can delete)
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only administrators can delete clients.");
            }

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                // Log activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Delete",
                    EntityType = "Client",
                    EntityId = id,
                    Description = $"Deleted client: {client.CompanyName}",
                    UserId = userId
                });
            }

            return deleted;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }
    }
}
