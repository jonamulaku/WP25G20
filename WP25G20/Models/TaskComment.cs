using System.ComponentModel.DataAnnotations;

namespace WP25G20.Models
{
    public class TaskComment
    {
        public int Id { get; set; }
        
        [Required]
        public int TaskId { get; set; }
        
        [Required]
        [StringLength(2000)]
        public string Comment { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        public string? CreatedById { get; set; }
        
        // Navigation properties
        public virtual Task Task { get; set; } = null!;
        public virtual ApplicationUser? CreatedBy { get; set; }
    }
}
