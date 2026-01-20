using System.ComponentModel.DataAnnotations;

namespace WP25G20.Models
{
    public class TaskFile
    {
        public int Id { get; set; }
        
        [Required]
        public int TaskId { get; set; }
        
        [Required]
        [StringLength(500)]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(1000)]
        public string FilePath { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? ContentType { get; set; }
        
        public long FileSize { get; set; }
        
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        
        public string? UploadedById { get; set; }
        
        // Navigation properties
        public virtual Task Task { get; set; } = null!;
        public virtual ApplicationUser? UploadedBy { get; set; }
    }
}
