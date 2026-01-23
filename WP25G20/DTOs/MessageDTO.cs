using System.ComponentModel.DataAnnotations;

namespace WP25G20.DTOs
{
    public class MessageDTO
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? SenderName { get; set; }
        public string? SenderEmail { get; set; }
        public string? SenderUserId { get; set; }
        public string? SenderUserName { get; set; }
        public string? RecipientUserId { get; set; }
        public string? RecipientUserName { get; set; }
        public int? ClientId { get; set; }
        public string? ClientName { get; set; }
        public int? TeamMemberId { get; set; }
        public string? TeamMemberName { get; set; }
        public int? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime? RepliedAt { get; set; }
        public int? ParentMessageId { get; set; }
        public int ReplyCount { get; set; }
        public List<MessageDTO> Replies { get; set; } = new List<MessageDTO>();
    }
    
    public class MessageCreateDTO
    {
        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        [StringLength(5000)]
        public string Content { get; set; } = string.Empty;
        
        [Required]
        public string Type { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? SenderName { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string? SenderEmail { get; set; }
        
        public string? RecipientUserId { get; set; }
        public int? ClientId { get; set; }
        public int? TeamMemberId { get; set; }
        public int? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
        public int? ParentMessageId { get; set; }
    }
    
    public class MessageFilterDTO
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
        public string? Type { get; set; }
        public string? Status { get; set; }
        public string? SearchTerm { get; set; }
    }
    
    public class MessageUpdateDTO
    {
        public string? Status { get; set; }
    }
}
