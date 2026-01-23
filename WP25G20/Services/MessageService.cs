using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;

namespace WP25G20.Services
{
    public interface IMessageService
    {
        Task<PagedResultDTO<MessageDTO>> GetAllAsync(MessageFilterDTO filter, string? userId = null);
        Task<MessageDTO?> GetByIdAsync(int id, string? userId = null);
        Task<MessageDTO> CreateAsync(MessageCreateDTO dto, string? userId = null);
        Task<MessageDTO?> UpdateAsync(int id, MessageUpdateDTO dto, string userId);
        Task<bool> DeleteAsync(int id, string userId);
        Task<int> GetUnreadCountAsync(string? userId = null);
    }

    public class MessageService : IMessageService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public MessageService(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<PagedResultDTO<MessageDTO>> GetAllAsync(MessageFilterDTO filter, string? userId = null)
        {
            var query = _context.Messages
                .Include(m => m.SenderUser)
                .Include(m => m.RecipientUser)
                .Include(m => m.Client)
                .Include(m => m.TeamMember)
                .Include(m => m.Replies)
                .AsQueryable();

            // Filter by type
            MessageType? parsedMessageType = null;
            if (!string.IsNullOrEmpty(filter.Type) && Enum.TryParse<MessageType>(filter.Type, out var messageType))
            {
                parsedMessageType = messageType;
                query = query.Where(m => m.Type == messageType);
            }

            // Filter by status
            if (!string.IsNullOrEmpty(filter.Status) && Enum.TryParse<MessageStatus>(filter.Status, out var status))
            {
                query = query.Where(m => m.Status == status);
            }

            // Search term
            if (!string.IsNullOrEmpty(filter.SearchTerm))
            {
                var searchTerm = filter.SearchTerm.ToLower();
                query = query.Where(m =>
                    m.Subject.ToLower().Contains(searchTerm) ||
                    m.Content.ToLower().Contains(searchTerm) ||
                    (m.SenderName != null && m.SenderName.ToLower().Contains(searchTerm)) ||
                    (m.SenderEmail != null && m.SenderEmail.ToLower().Contains(searchTerm)));
            }

            // Filter by user (for team members and clients)
            bool isAdmin = false;
            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");

                if (!isAdmin)
                {
                    // Team members see messages where they are recipient or sender
                    query = query.Where(m =>
                        m.RecipientUserId == userId ||
                        m.SenderUserId == userId ||
                        (m.Type == MessageType.TeamToAdmin && m.SenderUserId == userId));
                }
            }

            // Only show parent messages (not replies) in main list
            // EXCEPTION: For team members fetching AdminToTeam messages, include replies where they are the recipient
            if (parsedMessageType == MessageType.AdminToTeam && !isAdmin && !string.IsNullOrEmpty(userId))
            {
                // For team members fetching AdminToTeam, include both parent messages and replies where they are recipient
                // This allows them to see replies to their messages
                query = query.Where(m => 
                    m.ParentMessageId == null || 
                    (m.ParentMessageId != null && m.RecipientUserId == userId));
            }
            else
            {
                // For admins and other cases, only show parent messages
                query = query.Where(m => m.ParentMessageId == null);
            }

            var totalCount = await query.CountAsync();

            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            var items = messages.Select(m => MapToDTO(m)).ToList();

            return new PagedResultDTO<MessageDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<MessageDTO?> GetByIdAsync(int id, string? userId = null)
        {
            var message = await _context.Messages
                .Include(m => m.SenderUser)
                .Include(m => m.RecipientUser)
                .Include(m => m.Client)
                .Include(m => m.TeamMember)
                .Include(m => m.Replies)
                    .ThenInclude(r => r.SenderUser)
                .Include(m => m.Replies)
                    .ThenInclude(r => r.RecipientUser)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (message == null) return null;

            // Mark as read if user is recipient
            if (!string.IsNullOrEmpty(userId) && message.RecipientUserId == userId && message.Status == MessageStatus.Unread)
            {
                message.Status = MessageStatus.Read;
                message.ReadAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return MapToDTO(message);
        }

        public async Task<MessageDTO> CreateAsync(MessageCreateDTO dto, string? userId = null)
        {
            if (!Enum.TryParse<MessageType>(dto.Type, out var messageType))
            {
                throw new ArgumentException("Invalid message type");
            }

            var message = new Message
            {
                Subject = dto.Subject,
                Content = dto.Content,
                Type = messageType,
                Status = MessageStatus.Unread,
                SenderName = dto.SenderName,
                SenderEmail = dto.SenderEmail,
                SenderUserId = userId,
                RecipientUserId = dto.RecipientUserId,
                ClientId = dto.ClientId,
                TeamMemberId = dto.TeamMemberId,
                RelatedEntityId = dto.RelatedEntityId,
                RelatedEntityType = dto.RelatedEntityType,
                ParentMessageId = dto.ParentMessageId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // If this is a reply, update parent message
            if (dto.ParentMessageId.HasValue)
            {
                var parent = await _context.Messages.FindAsync(dto.ParentMessageId.Value);
                if (parent != null)
                {
                    parent.Status = MessageStatus.Replied;
                    parent.RepliedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }
            }

            return await GetByIdAsync(message.Id, userId) ?? MapToDTO(message);
        }

        public async Task<MessageDTO?> UpdateAsync(int id, MessageUpdateDTO dto, string userId)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null) return null;

            // Check permissions
            if (message.RecipientUserId != userId && message.SenderUserId != userId)
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                if (!isAdmin)
                {
                    throw new UnauthorizedAccessException("You do not have permission to update this message.");
                }
            }

            if (!string.IsNullOrEmpty(dto.Status) && Enum.TryParse<MessageStatus>(dto.Status, out var status))
            {
                message.Status = status;
                if (status == MessageStatus.Read && message.ReadAt == null)
                {
                    message.ReadAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id, userId);
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var message = await _context.Messages.FindAsync(id);
            if (message == null) return false;

            // Check permissions
            if (message.SenderUserId != userId)
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");
                if (!isAdmin)
                {
                    throw new UnauthorizedAccessException("You do not have permission to delete this message.");
                }
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadCountAsync(string? userId = null)
        {
            var query = _context.Messages.Where(m => m.Status == MessageStatus.Unread);

            if (!string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.FindByIdAsync(userId);
                var isAdmin = user != null && await _userManager.IsInRoleAsync(user, "Admin");

                if (isAdmin)
                {
                    // Admin sees all unread messages
                    return await query.CountAsync();
                }
                else
                {
                    // Others see only messages where they are recipient
                    return await query.Where(m => m.RecipientUserId == userId).CountAsync();
                }
            }

            return await query.CountAsync();
        }

        private MessageDTO MapToDTO(Message m)
        {
            return new MessageDTO
            {
                Id = m.Id,
                Subject = m.Subject,
                Content = m.Content,
                Type = m.Type.ToString(),
                Status = m.Status.ToString(),
                SenderName = m.SenderName,
                SenderEmail = m.SenderEmail,
                SenderUserId = m.SenderUserId,
                SenderUserName = m.SenderUser != null 
                    ? $"{m.SenderUser.FirstName} {m.SenderUser.LastName}".Trim() 
                    : null,
                RecipientUserId = m.RecipientUserId,
                RecipientUserName = m.RecipientUser != null 
                    ? $"{m.RecipientUser.FirstName} {m.RecipientUser.LastName}".Trim() 
                    : null,
                ClientId = m.ClientId,
                ClientName = m.Client?.CompanyName,
                TeamMemberId = m.TeamMemberId,
                TeamMemberName = m.TeamMember != null 
                    ? $"{m.TeamMember.FirstName} {m.TeamMember.LastName}".Trim() 
                    : null,
                RelatedEntityId = m.RelatedEntityId,
                RelatedEntityType = m.RelatedEntityType,
                CreatedAt = m.CreatedAt,
                ReadAt = m.ReadAt,
                RepliedAt = m.RepliedAt,
                ParentMessageId = m.ParentMessageId,
                ReplyCount = m.Replies.Count,
                Replies = m.Replies.OrderBy(r => r.CreatedAt).Select(r => MapToDTO(r)).ToList()
            };
        }
    }
}
