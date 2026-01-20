using System.ComponentModel.DataAnnotations;

namespace WP25G20.Models
{
    public class ActivityLog
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // Create, Read, Update, Delete
        
        [Required]
        [StringLength(100)]
        public string EntityType { get; set; } = string.Empty; // Client, Campaign, Task, etc.
        
        public int? EntityId { get; set; }
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        [StringLength(2000)]
        public string? Changes { get; set; } // JSON string of changes
        
        public string? UserId { get; set; }
        
        [StringLength(50)]
        public string? IpAddress { get; set; }
        
        [StringLength(500)]
        public string? UserAgent { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ApplicationUser? User { get; set; }
    }
}
