using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WP25G20.Models
{
    public class Campaign
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [Required]
        public int ClientId { get; set; }
        
        [Required]
        public int ServiceId { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Budget { get; set; }
        
        public CampaignStatus Status { get; set; } = CampaignStatus.Pending;
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Foreign keys
        public string? CreatedById { get; set; }
        
        // Navigation properties
        public virtual Client Client { get; set; } = null!;
        public virtual Service Service { get; set; } = null!;
        public virtual ApplicationUser? CreatedBy { get; set; }
        public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
        public virtual ICollection<CampaignUser> CampaignUsers { get; set; } = new List<CampaignUser>();
        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }
    
    public enum CampaignStatus
    {
        Pending,
        Active,
        Paused,
        Completed,
        Cancelled
    }
}
