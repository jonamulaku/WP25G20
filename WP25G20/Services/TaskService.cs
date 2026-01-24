using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;
using TaskModel = WP25G20.Models.Task;
using TaskStatus = WP25G20.Models.TaskStatus;

namespace WP25G20.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;
        private readonly ICampaignRepository _campaignRepository;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ApplicationDbContext _context;
        private readonly IAuthorizationHelper _authorizationHelper;
        private readonly UserManager<ApplicationUser> _userManager;

        public TaskService(
            ITaskRepository repository,
            ICampaignRepository campaignRepository,
            IActivityLogRepository activityLogRepository,
            ApplicationDbContext context,
            IAuthorizationHelper authorizationHelper,
            UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _campaignRepository = campaignRepository;
            _activityLogRepository = activityLogRepository;
            _context = context;
            _authorizationHelper = authorizationHelper;
            _userManager = userManager;
        }

        public async Task<PagedResultDTO<TaskDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null)
        {
            var query = _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.CampaignUsers)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .Include(t => t.TaskComments)
                .Include(t => t.TaskFiles)
                .AsQueryable();

            // If userId provided and not admin, filter to only show tasks user has access to
            // Note: For team members, they will access via their own dashboard later
            if (!string.IsNullOrEmpty(userId) && (isAdmin == null || !isAdmin.Value))
            {
                // Get the user to find their email and corresponding TeamMember
                var user = await _userManager.FindByIdAsync(userId);
                var teamMemberId = (int?)null;
                var isClient = false;
                if (user != null)
                {
                    var userRoles = await _userManager.GetRolesAsync(user);
                    isClient = userRoles.Contains("Client");
                    
                    var teamMember = await _context.TeamMembers
                        .FirstOrDefaultAsync(tm => tm.Email.ToLower() == user.Email.ToLower());
                    if (teamMember != null)
                    {
                        teamMemberId = teamMember.Id;
                    }
                }

                // Use captured variable in query
                var capturedTeamMemberId = teamMemberId;
                var capturedIsClient = isClient;
                var capturedUserEmail = user?.Email?.ToLower();
                
                if (capturedIsClient && !string.IsNullOrEmpty(capturedUserEmail))
                {
                    // For clients, show all tasks for their campaigns (by client email)
                    query = query.Where(t => t.Campaign.Client.Email.ToLower() == capturedUserEmail);
                }
                else
                {
                    // For team members, show tasks assigned to them
                    query = query.Where(t => t.CreatedById == userId || 
                                             t.AssignedToId == userId ||
                                             (capturedTeamMemberId.HasValue && t.AssignedToTeamMemberId == capturedTeamMemberId.Value) ||
                                             t.Campaign.CreatedById == userId ||
                                             t.Campaign.CampaignUsers.Any(cu => cu.UserId == userId));
                }
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(t => t.Title.Contains(filter.SearchTerm) ||
                                        (t.Description != null && t.Description.Contains(filter.SearchTerm)) ||
                                        t.Campaign.Name.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("Status"))
                {
                    if (Enum.TryParse<TaskStatus>(filter.Filters["Status"], out var status))
                    {
                        query = query.Where(t => t.Status == status);
                    }
                }
                if (filter.Filters.ContainsKey("CampaignId"))
                {
                    if (int.TryParse(filter.Filters["CampaignId"], out var campaignId))
                    {
                        query = query.Where(t => t.CampaignId == campaignId);
                    }
                }
                if (filter.Filters.ContainsKey("AssignedToTeamMemberId"))
                {
                    if (int.TryParse(filter.Filters["AssignedToTeamMemberId"], out var teamMemberId))
                    {
                        query = query.Where(t => t.AssignedToTeamMemberId == teamMemberId);
                    }
                }
                if (filter.Filters.ContainsKey("AssignedToId"))
                {
                    query = query.Where(t => t.AssignedToId == filter.Filters["AssignedToId"]);
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "title" => filter.SortDescending
                        ? query.OrderByDescending(t => t.Title)
                        : query.OrderBy(t => t.Title),
                    "duedate" => filter.SortDescending
                        ? query.OrderByDescending(t => t.DueDate)
                        : query.OrderBy(t => t.DueDate),
                    "priority" => filter.SortDescending
                        ? query.OrderByDescending(t => t.Priority)
                        : query.OrderBy(t => t.Priority),
                    _ => query.OrderByDescending(t => t.CreatedAt)
                };
            }
            else
            {
                query = query.OrderByDescending(t => t.CreatedAt);
            }

            var totalCount = await query.CountAsync();

            // Check if user is a client to exclude sensitive info
            var isClientUser = false;
            if (!string.IsNullOrEmpty(userId) && (isAdmin == null || !isAdmin.Value))
            {
                var userForCheck = await _userManager.FindByIdAsync(userId);
                if (userForCheck != null)
                {
                    var userRoles = await _userManager.GetRolesAsync(userForCheck);
                    isClientUser = userRoles.Contains("Client");
                }
            }

            var tasks = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = tasks.Select(t => new TaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                CampaignId = t.CampaignId,
                CampaignName = t.Campaign.Name,
                AssignedToTeamMemberId = t.AssignedToTeamMemberId,
                // Don't include team member names/roles for clients (sensitive info)
                AssignedToTeamMemberName = isClientUser ? null : (t.AssignedToTeamMember != null ? $"{t.AssignedToTeamMember.FirstName} {t.AssignedToTeamMember.LastName}" : null),
                AssignedToTeamMemberRole = isClientUser ? null : (t.AssignedToTeamMember != null ? t.AssignedToTeamMember.Role : null),
                AssignedToId = t.AssignedToId,
                AssignedToName = isClientUser ? null : (t.AssignedTo != null ? $"{t.AssignedTo.FirstName} {t.AssignedTo.LastName}" : null),
                DueDate = t.DueDate,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                Notes = t.Notes,
                CreatedAt = t.CreatedAt,
                CompletedAt = t.CompletedAt,
                CommentCount = t.TaskComments.Count,
                FileCount = t.TaskFiles.Count
            }).ToList();

            return new PagedResultDTO<TaskDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<PagedResultDTO<TaskDTO>> GetMyTasksAsync(string userId, FilterDTO filter)
        {
            // Get the user to find their email
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new PagedResultDTO<TaskDTO>
                {
                    Items = new List<TaskDTO>(),
                    TotalCount = 0,
                    PageNumber = filter.PageNumber > 0 ? filter.PageNumber : 1,
                    PageSize = filter.PageSize > 0 ? filter.PageSize : 10
                };
            }

            // Find the TeamMember by email (case-insensitive)
            var teamMember = await _context.TeamMembers
                .FirstOrDefaultAsync(tm => tm.Email.ToLower() == user.Email.ToLower());

            // Build query directly to ensure proper filtering
            var query = _context.Tasks
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(t => t.Campaign)
                    .ThenInclude(c => c.CampaignUsers)
                .Include(t => t.AssignedToTeamMember)
                .Include(t => t.AssignedTo)
                .Include(t => t.CreatedBy)
                .AsQueryable();

            // Filter by AssignedToTeamMemberId if team member exists
            if (teamMember != null)
            {
                query = query.Where(t => t.AssignedToTeamMemberId == teamMember.Id);
            }
            else
            {
                // Fallback: check AssignedToId for backward compatibility
                query = query.Where(t => t.AssignedToId == userId);
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(t => t.Title.Contains(filter.SearchTerm) ||
                                        (t.Description != null && t.Description.Contains(filter.SearchTerm)) ||
                                        t.Campaign.Name.Contains(filter.SearchTerm));
            }

            // Apply status filter if provided
            if (filter.Filters != null && filter.Filters.ContainsKey("Status"))
            {
                if (Enum.TryParse<TaskStatus>(filter.Filters["Status"], out var status))
                {
                    query = query.Where(t => t.Status == status);
                }
            }

            // Apply priority filter if provided
            if (filter.Filters != null && filter.Filters.ContainsKey("Priority"))
            {
                if (Enum.TryParse<TaskPriority>(filter.Filters["Priority"], out var priority))
                {
                    query = query.Where(t => t.Priority == priority);
                }
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                switch (filter.SortBy.ToLower())
                {
                    case "title":
                        query = filter.SortDescending == true 
                            ? query.OrderByDescending(t => t.Title)
                            : query.OrderBy(t => t.Title);
                        break;
                    case "duedate":
                        query = filter.SortDescending == true 
                            ? query.OrderByDescending(t => t.DueDate ?? DateTime.MaxValue)
                            : query.OrderBy(t => t.DueDate ?? DateTime.MaxValue);
                        break;
                    case "status":
                        query = filter.SortDescending == true 
                            ? query.OrderByDescending(t => t.Status)
                            : query.OrderBy(t => t.Status);
                        break;
                    case "priority":
                        query = filter.SortDescending == true 
                            ? query.OrderByDescending(t => t.Priority)
                            : query.OrderBy(t => t.Priority);
                        break;
                    default:
                        query = query.OrderByDescending(t => t.CreatedAt);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(t => t.CreatedAt);
            }

            // Apply pagination
            var pageNumber = filter.PageNumber > 0 ? filter.PageNumber : 1;
            var pageSize = filter.PageSize > 0 ? filter.PageSize : 10;
            var skip = (pageNumber - 1) * pageSize;
            query = query.Skip(skip).Take(pageSize);

            // Map to DTOs
            var items = await query.Select(t => new TaskDTO
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                CampaignId = t.CampaignId,
                CampaignName = t.Campaign.Name,
                AssignedToTeamMemberId = t.AssignedToTeamMemberId,
                AssignedToTeamMemberName = t.AssignedToTeamMember != null 
                    ? $"{t.AssignedToTeamMember.FirstName} {t.AssignedToTeamMember.LastName}" 
                    : null,
                AssignedToTeamMemberRole = t.AssignedToTeamMember != null 
                    ? t.AssignedToTeamMember.Role 
                    : null,
                AssignedToId = t.AssignedToId,
                AssignedToName = t.AssignedTo != null 
                    ? $"{t.AssignedTo.FirstName} {t.AssignedTo.LastName}" 
                    : null,
                DueDate = t.DueDate,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                Notes = t.Notes,
                CreatedAt = t.CreatedAt,
                CompletedAt = t.CompletedAt,
                CommentCount = t.TaskComments.Count,
                FileCount = t.TaskFiles.Count
            })
            .ToListAsync();

            return new PagedResultDTO<TaskDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<TaskDTO?> GetByIdAsync(int id, string? userId = null)
        {
            var task = await _repository.GetByIdWithDetailsAsync(id);
            if (task == null) return null;

            // Check permissions if userId provided
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                
                if (!isAdmin && !await _authorizationHelper.CanViewTaskAsync(id, userId, isAdmin))
                {
                    throw new UnauthorizedAccessException("You do not have permission to view this task.");
                }

                // Log read activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Read",
                    EntityType = "Task",
                    EntityId = id,
                    Description = $"Viewed task: {task.Title}",
                    UserId = userId
                });
            }

            return new TaskDTO
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                CampaignId = task.CampaignId,
                CampaignName = task.Campaign.Name,
                AssignedToTeamMemberId = task.AssignedToTeamMemberId,
                AssignedToTeamMemberName = task.AssignedToTeamMember != null ? $"{task.AssignedToTeamMember.FirstName} {task.AssignedToTeamMember.LastName}" : null,
                AssignedToTeamMemberRole = task.AssignedToTeamMember != null ? task.AssignedToTeamMember.Role : null,
                AssignedToId = task.AssignedToId,
                AssignedToName = task.AssignedTo != null ? $"{task.AssignedTo.FirstName} {task.AssignedTo.LastName}" : null,
                DueDate = task.DueDate,
                Priority = task.Priority.ToString(),
                Status = task.Status.ToString(),
                Notes = task.Notes,
                CreatedAt = task.CreatedAt,
                CompletedAt = task.CompletedAt,
                CommentCount = task.TaskComments.Count,
                FileCount = task.TaskFiles.Count
            };
        }

        public async Task<TaskDTO> CreateAsync(TaskCreateDTO dto, string userId)
        {
            // Validate campaign exists
            if (!await _campaignRepository.ExistsAsync(dto.CampaignId))
                throw new ArgumentException("Campaign not found");

            var task = new TaskModel
            {
                Title = dto.Title,
                Description = dto.Description,
                CampaignId = dto.CampaignId,
                AssignedToTeamMemberId = dto.AssignedToTeamMemberId,
                DueDate = dto.DueDate,
                Priority = Enum.TryParse<TaskPriority>(dto.Priority, out var priority) ? priority : TaskPriority.Medium,
                Status = TaskStatus.Pending,
                Notes = dto.Notes,
                CreatedById = userId
            };

            var created = await _repository.CreateAsync(task);

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Create",
                EntityType = "Task",
                EntityId = created.Id,
                Description = $"Created task: {created.Title}",
                UserId = userId
            });

            return await GetByIdAsync(created.Id) ?? throw new Exception("Failed to retrieve created task");
        }

        public async Task<TaskDTO?> UpdateAsync(int id, TaskUpdateDTO dto, string userId)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null) return null;

            // Check permissions
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin && !await _authorizationHelper.CanUpdateTaskAsync(id, userId, isAdmin))
            {
                throw new UnauthorizedAccessException("You do not have permission to update this task.");
            }

            var oldValues = $"{{\"Title\":\"{task.Title}\",\"Status\":\"{task.Status}\",\"Priority\":\"{task.Priority}\"}}";

            // Check if user is a team member (not admin) and is assigned to this task
            var isTeamMemberAssigned = false;
            if (!isAdmin && task.AssignedToTeamMemberId.HasValue && task.AssignedToTeamMember != null)
            {
                var teamMember = await _context.TeamMembers
                    .FirstOrDefaultAsync(tm => tm.Email.ToLower() == user.Email.ToLower());
                if (teamMember != null && teamMember.Id == task.AssignedToTeamMemberId.Value)
                {
                    isTeamMemberAssigned = true;
                }
            }

            // Team members can only update status and notes, not other fields
            if (isTeamMemberAssigned)
            {
                // Only allow status and notes updates for team members
                if (Enum.TryParse<TaskStatus>(dto.Status, out var status))
                {
                    task.Status = status;
                    if (status == TaskStatus.Completed && task.CompletedAt == null)
                    {
                        task.CompletedAt = DateTime.UtcNow;
                    }
                }
                task.Notes = dto.Notes; // Allow notes update
                // Don't update Title, Description, Priority, DueDate, or AssignedToTeamMemberId
            }
            else
            {
                // Admins and other authorized users can update all fields
                task.Title = dto.Title;
                task.Description = dto.Description;
                task.AssignedToTeamMemberId = dto.AssignedToTeamMemberId;
                task.DueDate = dto.DueDate;
                task.Notes = dto.Notes;

                if (Enum.TryParse<TaskPriority>(dto.Priority, out var priority))
                {
                    task.Priority = priority;
                }

                if (Enum.TryParse<TaskStatus>(dto.Status, out var status))
                {
                    task.Status = status;
                    if (status == TaskStatus.Completed && task.CompletedAt == null)
                    {
                        task.CompletedAt = DateTime.UtcNow;
                    }
                }
            }

            var updated = await _repository.UpdateAsync(task);

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Update",
                EntityType = "Task",
                EntityId = updated.Id,
                Description = $"Updated task: {updated.Title}",
                Changes = oldValues,
                UserId = userId
            });

            return await GetByIdAsync(updated.Id);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null) return false;

            // Check permissions (only admins can delete)
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only administrators can delete tasks.");
            }

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                // Log activity
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Delete",
                    EntityType = "Task",
                    EntityId = id,
                    Description = $"Deleted task: {task.Title}",
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
