using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Services
{
    public class ApprovalRequestService : IApprovalRequestService
    {
        private readonly IApprovalRequestRepository _repository;
        private readonly ICampaignRepository _campaignRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMessageService _messageService;

        public ApprovalRequestService(
            IApprovalRequestRepository repository,
            ICampaignRepository campaignRepository,
            ITaskRepository taskRepository,
            IActivityLogRepository activityLogRepository,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            IMessageService messageService)
        {
            _repository = repository;
            _campaignRepository = campaignRepository;
            _taskRepository = taskRepository;
            _activityLogRepository = activityLogRepository;
            _context = context;
            _userManager = userManager;
            _messageService = messageService;
        }

        public async Task<PagedResultDTO<ApprovalRequestDTO>> GetAllAsync(FilterDTO filter, string? userId = null, bool? isAdmin = null)
        {
            var query = _context.ApprovalRequests
                .Include(ar => ar.Campaign)
                    .ThenInclude(c => c.Client)
                .Include(ar => ar.Task)
                .Include(ar => ar.CreatedBy)
                .Include(ar => ar.ApprovedBy)
                .Include(ar => ar.Comments)
                    .ThenInclude(c => c.CreatedBy)
                .AsQueryable();

            // If userId provided and not admin, filter by client email
            if (!string.IsNullOrEmpty(userId) && (isAdmin == null || !isAdmin.Value))
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return new PagedResultDTO<ApprovalRequestDTO>
                    {
                        Items = new List<ApprovalRequestDTO>(),
                        TotalCount = 0,
                        PageNumber = filter.PageNumber,
                        PageSize = filter.PageSize
                    };
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                var isClient = userRoles.Contains("Client");

                if (isClient && !string.IsNullOrEmpty(user.Email))
                {
                    // For Client users, show only approvals for their campaigns
                    query = query.Where(ar => ar.Campaign.Client.Email.ToLower() == user.Email.ToLower());
                }
            }

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(ar => ar.ItemName.Contains(filter.SearchTerm) ||
                                        (ar.Description != null && ar.Description.Contains(filter.SearchTerm)) ||
                                        ar.Campaign.Name.Contains(filter.SearchTerm));
            }

            // Apply filters
            if (filter.Filters != null)
            {
                if (filter.Filters.ContainsKey("Status"))
                {
                    if (Enum.TryParse<ApprovalStatus>(filter.Filters["Status"], out var status))
                    {
                        query = query.Where(ar => ar.Status == status);
                    }
                }
                if (filter.Filters.ContainsKey("CampaignId"))
                {
                    if (int.TryParse(filter.Filters["CampaignId"], out var campaignId))
                    {
                        query = query.Where(ar => ar.CampaignId == campaignId);
                    }
                }
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "itemname" => filter.SortDescending
                        ? query.OrderByDescending(ar => ar.ItemName)
                        : query.OrderBy(ar => ar.ItemName),
                    "createdat" => filter.SortDescending
                        ? query.OrderByDescending(ar => ar.CreatedAt)
                        : query.OrderBy(ar => ar.CreatedAt),
                    "duedate" => filter.SortDescending
                        ? query.OrderByDescending(ar => ar.DueDate)
                        : query.OrderBy(ar => ar.DueDate),
                    _ => query.OrderByDescending(ar => ar.CreatedAt)
                };
            }
            else
            {
                query = query.OrderByDescending(ar => ar.CreatedAt);
            }

            var totalCount = await query.CountAsync();

            var approvalRequests = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = approvalRequests.Select(ar => MapToDTO(ar)).ToList();

            return new PagedResultDTO<ApprovalRequestDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ApprovalRequestDTO?> GetByIdAsync(int id, string? userId = null)
        {
            var approvalRequest = await _repository.GetByIdWithDetailsAsync(id);
            if (approvalRequest == null) return null;

            // Check permissions if userId provided
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                var isClient = user != null && await _userManager.IsInRoleAsync(user, "Client");

                if (!isAdmin && isClient && !string.IsNullOrEmpty(user.Email))
                {
                    // Client users can only view approvals for their campaigns
                    if (approvalRequest.Campaign.Client.Email.ToLower() != user.Email.ToLower())
                    {
                        throw new UnauthorizedAccessException("You do not have permission to view this approval request.");
                    }
                }
            }

            return MapToDTO(approvalRequest);
        }

        public async Task<ApprovalRequestDTO> CreateAsync(ApprovalRequestCreateDTO dto, string userId)
        {
            // Validate campaign exists
            var campaign = await _campaignRepository.GetByIdAsync(dto.CampaignId);
            if (campaign == null)
                throw new ArgumentException("Campaign not found");

            // Validate task exists if provided
            if (dto.TaskId.HasValue && !await _taskRepository.ExistsAsync(dto.TaskId.Value))
                throw new ArgumentException("Task not found");

            // If user is a client, verify they own the campaign
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
                var isClient = await _userManager.IsInRoleAsync(user, "Client");
                
                if (!isAdmin && isClient && !string.IsNullOrEmpty(user.Email))
                {
                    // Verify the campaign belongs to the client
                    if (campaign.Client.Email.ToLower() != user.Email.ToLower())
                    {
                        throw new UnauthorizedAccessException("You can only create approval requests for your own campaigns.");
                    }
                }
            }

            var approvalRequest = new ApprovalRequest
            {
                CampaignId = dto.CampaignId,
                TaskId = dto.TaskId,
                ItemName = dto.ItemName,
                Description = dto.Description,
                ItemType = dto.ItemType,
                Status = ApprovalStatus.Pending,
                Explanation = dto.Explanation,
                CtaDescription = dto.CtaDescription,
                PlatformSpecs = dto.PlatformSpecs,
                PreviewUrl = dto.PreviewUrl,
                PreviewType = dto.PreviewType,
                DueDate = dto.DueDate,
                CreatedById = userId
            };

            var created = await _repository.CreateAsync(approvalRequest);

            // Add initial comment
            var comment = new ApprovalComment
            {
                ApprovalRequestId = created.Id,
                Comment = "Approval request created",
                Action = "Created",
                CreatedById = userId
            };
            _context.ApprovalComments.Add(comment);
            await _context.SaveChangesAsync();

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Create",
                EntityType = "ApprovalRequest",
                EntityId = created.Id,
                Description = $"Created approval request: {created.ItemName}",
                UserId = userId
            });

            return MapToDTO(await _repository.GetByIdWithDetailsAsync(created.Id))!;
        }

        public async Task<ApprovalRequestDTO?> UpdateAsync(int id, ApprovalRequestUpdateDTO dto, string userId)
        {
            var approvalRequest = await _repository.GetByIdAsync(id);
            if (approvalRequest == null) return null;

            // Only admins can update approval requests
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only administrators can update approval requests.");
            }

            approvalRequest.ItemName = dto.ItemName;
            approvalRequest.Description = dto.Description;
            approvalRequest.Explanation = dto.Explanation;
            approvalRequest.CtaDescription = dto.CtaDescription;
            approvalRequest.PlatformSpecs = dto.PlatformSpecs;
            approvalRequest.PreviewUrl = dto.PreviewUrl;
            approvalRequest.PreviewType = dto.PreviewType;
            approvalRequest.DueDate = dto.DueDate;

            var updated = await _repository.UpdateAsync(approvalRequest);

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = "Update",
                EntityType = "ApprovalRequest",
                EntityId = updated.Id,
                Description = $"Updated approval request: {updated.ItemName}",
                UserId = userId
            });

            return MapToDTO(await _repository.GetByIdWithDetailsAsync(updated.Id))!;
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var approvalRequest = await _repository.GetByIdAsync(id);
            if (approvalRequest == null) return false;

            // Only admins can delete
            var user = await _userManager.FindByIdAsync(userId);
            var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin)
            {
                throw new UnauthorizedAccessException("Only administrators can delete approval requests.");
            }

            var deleted = await _repository.DeleteAsync(id);

            if (deleted)
            {
                await _activityLogRepository.CreateAsync(new ActivityLog
                {
                    Action = "Delete",
                    EntityType = "ApprovalRequest",
                    EntityId = id,
                    Description = $"Deleted approval request: {approvalRequest.ItemName}",
                    UserId = userId
                });
            }

            return deleted;
        }

        public async Task<ApprovalRequestDTO?> ProcessApprovalAsync(int id, ApprovalActionDTO actionDto, string userId)
        {
            // Use GetByIdWithDetailsAsync to ensure Campaign.Client is loaded
            var approvalRequest = await _repository.GetByIdWithDetailsAsync(id);
            if (approvalRequest == null) return null;

            // Check permissions - only clients can approve/reject their own approvals
            var user = await _userManager.FindByIdAsync(userId);
            var isClient = user != null && await _userManager.IsInRoleAsync(user, "Client");

            if (!isClient || string.IsNullOrEmpty(user.Email))
            {
                throw new UnauthorizedAccessException("Only clients can process approval requests.");
            }

            // Verify this approval belongs to the client's campaign
            if (approvalRequest.Campaign?.Client == null || 
                approvalRequest.Campaign.Client.Email?.ToLower() != user.Email.ToLower())
            {
                throw new UnauthorizedAccessException("You do not have permission to process this approval request.");
            }

            // Update status
            if (Enum.TryParse<ApprovalStatus>(actionDto.Action, out var status))
            {
                approvalRequest.Status = status;
                approvalRequest.ApprovedById = userId;

                if (status == ApprovalStatus.Approved)
                {
                    approvalRequest.ApprovedAt = DateTime.UtcNow;
                    approvalRequest.RejectedAt = null;
                }
                else if (status == ApprovalStatus.Rejected)
                {
                    approvalRequest.RejectedAt = DateTime.UtcNow;
                    approvalRequest.ApprovedAt = null;
                }
                else
                {
                    approvalRequest.ApprovedAt = null;
                    approvalRequest.RejectedAt = null;
                }
            }
            else
            {
                throw new ArgumentException($"Invalid approval action: {actionDto.Action}");
            }

            var updated = await _repository.UpdateAsync(approvalRequest);

            // Add comment
            var comment = new ApprovalComment
            {
                ApprovalRequestId = updated.Id,
                Comment = actionDto.Comment ?? $"{actionDto.Action} by client",
                Action = actionDto.Action,
                CreatedById = userId
            };
            _context.ApprovalComments.Add(comment);
            await _context.SaveChangesAsync();

            // Log activity
            await _activityLogRepository.CreateAsync(new ActivityLog
            {
                Action = actionDto.Action,
                EntityType = "ApprovalRequest",
                EntityId = updated.Id,
                Description = $"Client {actionDto.Action.ToLower()} approval request: {updated.ItemName}",
                UserId = userId
            });

            // Create message to admin about the approval/rejection
            try
            {
                var approvalRequestWithDetails = await _repository.GetByIdWithDetailsAsync(updated.Id);
                if (approvalRequestWithDetails != null)
                {
                    var actionText = status == ApprovalStatus.Approved ? "approved" : 
                                    status == ApprovalStatus.Rejected ? "rejected" : 
                                    "requested changes for";
                    
                    var taskInfo = approvalRequestWithDetails.Task != null 
                        ? $" and task '{approvalRequestWithDetails.Task.Title}'" 
                        : "";
                    
                    var messageContent = $"{user.FirstName} {user.LastName} ({approvalRequestWithDetails.Campaign.Client.CompanyName}) has {actionText} the campaign '{approvalRequestWithDetails.Campaign.Name}'{taskInfo}.\n\n";
                    messageContent += $"Item: {approvalRequestWithDetails.ItemName}\n";
                    if (!string.IsNullOrEmpty(actionDto.Comment))
                    {
                        messageContent += $"\nClient Comment: {actionDto.Comment}";
                    }

                    await _messageService.CreateAsync(new DTOs.MessageCreateDTO
                    {
                        Subject = $"Client {actionText} campaign '{approvalRequestWithDetails.Campaign.Name}'",
                        Content = messageContent,
                        Type = "ClientToAdmin",
                        SenderName = $"{user.FirstName} {user.LastName}".Trim(),
                        SenderEmail = user.Email,
                        ClientId = approvalRequestWithDetails.Campaign.ClientId,
                        RelatedEntityId = approvalRequestWithDetails.CampaignId,
                        RelatedEntityType = "Campaign"
                    }, userId);
                }
            }
            catch (Exception ex)
            {
                // Log error but don't fail the approval process
                // The message creation is a notification feature, not critical
                System.Diagnostics.Debug.WriteLine($"Failed to create message for approval: {ex.Message}");
            }

            return MapToDTO(await _repository.GetByIdWithDetailsAsync(updated.Id))!;
        }

        private ApprovalRequestDTO MapToDTO(ApprovalRequest ar)
        {
            return new ApprovalRequestDTO
            {
                Id = ar.Id,
                CampaignId = ar.CampaignId,
                CampaignName = ar.Campaign.Name,
                TaskId = ar.TaskId,
                TaskTitle = ar.Task?.Title,
                ItemName = ar.ItemName,
                Description = ar.Description,
                ItemType = ar.ItemType,
                Status = ar.Status.ToString(),
                Explanation = ar.Explanation,
                CtaDescription = ar.CtaDescription,
                PlatformSpecs = ar.PlatformSpecs,
                PreviewUrl = ar.PreviewUrl,
                PreviewType = ar.PreviewType,
                DueDate = ar.DueDate,
                CreatedAt = ar.CreatedAt,
                UpdatedAt = ar.UpdatedAt,
                ApprovedAt = ar.ApprovedAt,
                RejectedAt = ar.RejectedAt,
                CreatedByName = ar.CreatedBy != null 
                    ? $"{ar.CreatedBy.FirstName} {ar.CreatedBy.LastName}".Trim() 
                    : null,
                ApprovedByName = ar.ApprovedBy != null 
                    ? $"{ar.ApprovedBy.FirstName} {ar.ApprovedBy.LastName}".Trim() 
                    : null,
                Comments = ar.Comments.Select(c => new ApprovalCommentDTO
                {
                    Id = c.Id,
                    ApprovalRequestId = c.ApprovalRequestId,
                    Comment = c.Comment,
                    Action = c.Action,
                    CreatedAt = c.CreatedAt,
                    CreatedByName = c.CreatedBy != null 
                        ? $"{c.CreatedBy.FirstName} {c.CreatedBy.LastName}".Trim() 
                        : null
                }).ToList()
            };
        }
    }
}
