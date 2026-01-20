using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WP25G20.Models
{
    public class Task
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [Required]
        public int CampaignId { get; set; }
        
        public string? AssignedToId { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        
        public TaskStatus Status { get; set; } = TaskStatus.Pending;
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        
        // Foreign keys
        public string? CreatedById { get; set; }
        
        // Navigation properties
        public virtual Campaign Campaign { get; set; } = null!;
        public virtual ApplicationUser? AssignedTo { get; set; }
        public virtual ApplicationUser? CreatedBy { get; set; }
        public virtual ICollection<TaskFile> TaskFiles { get; set; } = new List<TaskFile>();
        public virtual ICollection<TaskComment> TaskComments { get; set; } = new List<TaskComment>();
    }
    
    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Urgent
    }
    
    public enum TaskStatus
    {
        Pending,
        InProgress,
        Completed,
        Cancelled,
        OnHold
    }
}
