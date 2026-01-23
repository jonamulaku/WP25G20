using System.ComponentModel.DataAnnotations;

namespace WP25G20.Models
{
    public class Message
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        [StringLength(5000)]
        public string Content { get; set; } = string.Empty;
        
        [Required]
        public MessageType Type { get; set; }
        
        [Required]
        public MessageStatus Status { get; set; } = MessageStatus.Unread;
        
        // Sender information (for contact form messages, this is the external user)
        [StringLength(200)]
        public string? SenderName { get; set; }
        
        [EmailAddress]
        [StringLength(100)]
        public string? SenderEmail { get; set; }
        
        // For internal messages (admin to team, admin to client)
        public string? SenderUserId { get; set; }
        public string? RecipientUserId { get; set; }
        
        // For client messages
        public int? ClientId { get; set; }
        
        // For team member messages
        public int? TeamMemberId { get; set; }
        
        // Related entity (campaign, task, etc.)
        public int? RelatedEntityId { get; set; }
        [StringLength(50)]
        public string? RelatedEntityType { get; set; } // "Campaign", "Task", etc.
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReadAt { get; set; }
        public DateTime? RepliedAt { get; set; }
        
        // Navigation properties
        public virtual ApplicationUser? SenderUser { get; set; }
        public virtual ApplicationUser? RecipientUser { get; set; }
        public virtual Client? Client { get; set; }
        public virtual TeamMember? TeamMember { get; set; }
        
        // Replies (threading)
        public int? ParentMessageId { get; set; }
        public virtual Message? ParentMessage { get; set; }
        public virtual ICollection<Message> Replies { get; set; } = new List<Message>();
    }
    
    public enum MessageType
    {
        ContactForm,      // From contact form on main page
        AdminToTeam,      // Admin messaging team members
        AdminToClient,    // Admin messaging clients
        TeamToAdmin,      // Team members messaging admin
        ClientToAdmin,    // Clients messaging admin
        Internal          // Internal admin-to-admin messages
    }
    
    public enum MessageStatus
    {
        Unread,
        Read,
        Replied,
        Archived
    }
}
