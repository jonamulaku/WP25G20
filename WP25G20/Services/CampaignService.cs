using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using TaskStatus = WP25G20.Models.TaskStatus;

namespace WP25G20.Services
{
    public class CampaignService : ICampaignService
    {
        private readonly ICampaignRepository _repository;
        private readonly IClientRepository _clientRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuthorizationHelper _authorizationHelper;

        public CampaignService(
            ICampaignRepository repository,
            IClientRepository clientRepository,
            IServiceRepository serviceRepository,
            IActivityLogRepository activityLogRepository,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            IAuthorizationHelper authorizationHelper)
        {
            _repository = repository;
            _clientRepository = clientRepository;
            _serviceRepository = serviceRepository;
            _activityLogRepository = activityLogRepository;
            _context = context;
            _userManager = userManager;
            _authorizationHelper = authorizationHelper;
        }

        public async Task<PagedResultDTO<CampaignDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null)
        {
            var query = _context.Campaigns
                .Include(c => c.Client)
                .Include(c => c.Service)
                .Include(c => c.CreatedBy)
                .Include(c => c.CampaignUsers)
                .Include(c => c.Tasks)
                    .ThenInclude(t => t.AssignedToTeamMember)
                .AsQueryable();

            // If userId provided and not admin, filter to only show campaigns user has access to
            if (!string.IsNullOrEmpty(userId) && (isAdmin == null || !isAdmin.Value))
            {
                // Get the user to find their email for TeamMember and Client lookup
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return new PagedResultDTO<CampaignDTO>
                    {
                        Items = new List<CampaignDTO>(),
                        TotalCount = 0,
                        PageNumber = filter.PageNumber,
                        PageSize = filter.PageSize
                    };
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                var isClient = userRoles.Contains("Client");
                
                var teamMember = await _context.TeamMembers.FirstOrDefaultAsync(tm => tm.Email.ToLower() == user.Email.ToLower());

                if (isClient)
                {
                    // For Client users, show only campaigns for their client (matching by email)
                    query = query.Where(c => c.Client.Email.ToLower() == user.Email.ToLower());
                }
                else
                {
                    // For Team members, show campaigns they have access to
                    query = query.Where(c => 
                        c.CreatedById == userId || 
                        c.CampaignUsers.Any(cu => cu.UserId == userId) ||
                        // Also show campaigns where user has tasks assigned
                        (teamMember != null && c.Tasks.Any(t => t.AssignedToTeamMemberId == teamMember.Id)) ||
                        (teamMember == null && c.Tasks.Any(t => t.AssignedToId == userId))
                    );
                }
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(c => c.Name.Contains(filter.SearchTerm) ||
                                        (c.Description != null && c.Description.Contains(filter.SearchTerm)) ||
                                        c.Client.CompanyName.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("Status"))
                {
                    if (Enum.TryParse<CampaignStatus>(filter.Filters["Status"], out var status))
                    {
                        query = query.Where(c => c.Status == status);
                    }
                }
                if (filter.Filters.ContainsKey("ClientId"))
                {
                    if (int.TryParse(filter.Filters["ClientId"], out var clientId))
                    {
                        query = query.Where(c => c.ClientId == clientId);
                    }
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "name" => filter.SortDescending
                        ? query.OrderByDescending(c => c.Name)
                        : query.OrderBy(c => c.Name),
                    "startdate" => filter.SortDescending
                        ? query.OrderByDescending(c => c.StartDate)
                        : query.OrderBy(c => c.StartDate),
                    "budget" => filter.SortDescending
                        ? query.OrderByDescending(c => c.Budget)
                        : query.OrderBy(c => c.Budget),
                    _ => query.OrderByDescending(c => c.CreatedAt)
                };
            }
            else
            {
                query = query.OrderByDescending(c => c.CreatedAt);
            }

            var totalCount = await query.CountAsync();

            var campaigns = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = new List<CampaignDTO>();
            foreach (var c in campaigns)
            {
                    var assignedUserIds = await _context.CampaignUsers
                    .Where(cu => cu.CampaignId == c.Id)
                    .Select(cu => cu.UserId)
                    .ToListAsync();

                items.Add(new CampaignDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    ClientId = c.ClientId,
                    ClientName = c.Client.CompanyName,
                    ServiceId = c.ServiceId,
                    ServiceName = c.Service.Name,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Budget = c.Budget,
                    Status = c.Status.ToString(),
                    Notes = c.Notes,
                    CreatedAt = c.CreatedAt,
                    TaskCount = c.Tasks.Count(t => t.Status != TaskStatus.Pending && t.Status != TaskStatus.Cancelled),
                    CompletedTaskCount = c.Tasks.Count(t => t.Status == TaskStatus.Completed),
                    AssignedUserIds = assignedUserIds
                });
            }

            return new PagedResultDTO<CampaignDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<CampaignDTO?> GetByIdAsync(int id, string? userId = null)
        {
            var campaign = await _repository.GetByIdWithDetailsAsync(id);
            if (campaign == null) return null;

            // Check permissions if userId provided
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                
                if (!isAdmin && !await _authorizationHelper.CanViewCampaignAsync(id, userId, isAdmin))
                {
                    throw new UnauthorizedAccessException("You do not have permission to view this campaign.");
                }

                // Log read activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Read",
                    EntityType = "Campaign",
                    EntityId = id,
                    Description = $"Viewed campaign: {campaign.Name}",
                    UserId = userId
                });
            }

            var assignedUserIds = await _context.CampaignUsers
                .Where(cu => cu.CampaignId == id)
                .Select(cu => cu.UserId)
                .ToListAsync();

            return new CampaignDTO
            {
                Id = campaign.Id,
                Name = campaign.Name,
                Description = campaign.Description,
                ClientId = campaign.ClientId,
                ClientName = campaign.Client.CompanyName,
                ServiceId = campaign.ServiceId,
                ServiceName = campaign.Service.Name,
                StartDate = campaign.StartDate,
                EndDate = campaign.EndDate,
                Budget = campaign.Budget,
                Status = campaign.Status.ToString(),
                Notes = campaign.Notes,
                CreatedAt = campaign.CreatedAt,
                TaskCount = campaign.Tasks.Count(t => t.Status != TaskStatus.Pending && t.Status != TaskStatus.Cancelled),
                CompletedTaskCount = campaign.Tasks.Count(t => t.Status == TaskStatus.Completed),
                AssignedUserIds = assignedUserIds
            };
        }

        public async Task<CampaignDTO> CreateAsync(CampaignCreateDTO dto, string userId)
        {
            // Validate client and service exist
            if (!await _clientRepository.ExistsAsync(dto.ClientId))
                throw new ArgumentException("Client not found");

            if (!await _serviceRepository.ExistsAsync(dto.ServiceId))
                throw new ArgumentException("Service not found");

            var campaign = new Campaign
            {
                Name = dto.Name,
                Description = dto.Description,
                ClientId = dto.ClientId,
                ServiceId = dto.ServiceId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Budget = dto.Budget,
                Notes = dto.Notes,
                Status = CampaignStatus.Pending,
                CreatedById = userId
            };

            var created = await _repository.CreateAsync(campaign);

            // Assign users if provided
            if (dto.AssignedUserIds != null && dto.AssignedUserIds.Any())
            {
                // Validate all user IDs exist
                var invalidUserIds = new List<string>();
                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    var user = await _userManager.FindByIdAsync(assignedUserId);
                    if (user == null)
                    {
                        invalidUserIds.Add(assignedUserId);
                    }
                }

                if (invalidUserIds.Any())
                {
                    throw new ArgumentException($"The following user IDs do not exist: {string.Join(", ", invalidUserIds)}");
                }

                // All user IDs are valid, proceed with assignment
                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    _context.CampaignUsers.Add(new CampaignUser
                    {
                        CampaignId = created.Id,
                        UserId = assignedUserId,
                        Role = CampaignUserRole.Viewer
                    });
                }
                await _context.SaveChangesAsync();
            }

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Create",
                EntityType = "Campaign",
                EntityId = created.Id,
                Description = $"Created campaign: {created.Name}",
                UserId = userId
            });

            var result = await GetByIdAsync(created.Id);
            return result!;
        }

        public async Task<CampaignDTO?> UpdateAsync(int id, CampaignUpdateDTO dto, string userId)
        {
            var campaign = await _repository.GetByIdAsync(id);
            if (campaign == null) return null;

            // Check permissions
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin && !await _authorizationHelper.CanUpdateCampaignAsync(id, userId, isAdmin))
            {
                throw new UnauthorizedAccessException("You do not have permission to update this campaign.");
            }

            // Validate client exists if ClientId is being changed
            if (dto.ClientId != campaign.ClientId)
            {
                if (!await _clientRepository.ExistsAsync(dto.ClientId))
                    throw new ArgumentException("Client not found");
            }

            // Validate service exists if ServiceId is being changed
            if (dto.ServiceId != campaign.ServiceId)
            {
                if (!await _serviceRepository.ExistsAsync(dto.ServiceId))
                    throw new ArgumentException("Service not found");
            }

            var oldValues = $"{{\"Name\":\"{campaign.Name}\",\"Status\":\"{campaign.Status}\",\"Budget\":{campaign.Budget}}}";

            campaign.Name = dto.Name;
            campaign.Description = dto.Description;
            campaign.ClientId = dto.ClientId;
            campaign.ServiceId = dto.ServiceId;
            campaign.StartDate = dto.StartDate;
            campaign.EndDate = dto.EndDate;
            campaign.Budget = dto.Budget;
            campaign.Notes = dto.Notes;
            
            if (Enum.TryParse<CampaignStatus>(dto.Status, out var status))
            {
                // Validate: Cannot set status to Completed if not all tasks are completed
                if (status == CampaignStatus.Completed)
                {
                    var campaignTasks = await _context.Tasks
                        .Where(t => t.CampaignId == id)
                        .ToListAsync();
                    
                    if (campaignTasks.Any() && campaignTasks.Any(t => t.Status != TaskStatus.Completed))
                    {
                        var incompleteTasks = campaignTasks.Where(t => t.Status != TaskStatus.Completed).Count();
                        throw new InvalidOperationException($"Cannot mark campaign as Completed. {incompleteTasks} task(s) are not yet completed. Please complete all tasks before marking the campaign as completed.");
                    }
                }
                
                campaign.Status = status;
            }

            var updated = await _repository.UpdateAsync(campaign);

            // Update assigned users if provided
            if (dto.AssignedUserIds != null)
            {
                // Remove existing assignments
                var existingAssignments = await _context.CampaignUsers
                    .Where(cu => cu.CampaignId == id)
                    .ToListAsync();
                _context.CampaignUsers.RemoveRange(existingAssignments);

                // Validate all user IDs exist
                var invalidUserIds = new List<string>();
                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    var assignedUser = await _userManager.FindByIdAsync(assignedUserId);
                    if (assignedUser == null)
                    {
                        invalidUserIds.Add(assignedUserId);
                    }
                }

                if (invalidUserIds.Any())
                {
                    throw new ArgumentException($"The following user IDs do not exist: {string.Join(", ", invalidUserIds)}");
                }

                // Add new assignments
                foreach (var assignedUserId in dto.AssignedUserIds)
                {
                    _context.CampaignUsers.Add(new CampaignUser
                    {
                        CampaignId = id,
                        UserId = assignedUserId,
                        Role = CampaignUserRole.Viewer
                    });
                }
                await _context.SaveChangesAsync();
            }

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Update",
                EntityType = "Campaign",
                EntityId = updated.Id,
                Description = $"Updated campaign: {updated.Name}",
                Changes = oldValues,
                UserId = userId
            });

            return await GetByIdAsync(updated.Id);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var campaign = await _repository.GetByIdAsync(id);
            if (campaign == null) return false;

            // Check permissions (only admins can delete)
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only administrators can delete campaigns.");
            }

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                // Log activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Delete",
                    EntityType = "Campaign",
                    EntityId = id,
                    Description = $"Deleted campaign: {campaign.Name}",
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
