using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WP25G20.Models
{
    public class ApprovalRequest
    {
        public int Id { get; set; }
        
        [Required]
        public int CampaignId { get; set; }
        
        public int? TaskId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string ItemName { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string? Description { get; set; }
        
        [StringLength(50)]
        public string? ItemType { get; set; } // "Task", "Campaign", "Asset", etc.
        
        [Required]
        public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;
        
        [StringLength(5000)]
        public string? Explanation { get; set; }
        
        [StringLength(500)]
        public string? CtaDescription { get; set; }
        
        [StringLength(500)]
        public string? PlatformSpecs { get; set; }
        
        [StringLength(1000)]
        public string? PreviewUrl { get; set; }
        
        [StringLength(50)]
        public string? PreviewType { get; set; } // "image", "video", "text", etc.
        
        public DateTime? DueDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        
        // Foreign keys
        public string? CreatedById { get; set; } // Admin who created the approval request
        public string? ApprovedById { get; set; } // Client who approved/rejected
        
        // Navigation properties
        public virtual Campaign Campaign { get; set; } = null!;
        public virtual Task? Task { get; set; }
        public virtual ApplicationUser? CreatedBy { get; set; }
        public virtual ApplicationUser? ApprovedBy { get; set; }
        public virtual ICollection<ApprovalComment> Comments { get; set; } = new List<ApprovalComment>();
    }
    
    public enum ApprovalStatus
    {
        Pending,
        Approved,
        Rejected,
        ChangesRequested
    }
    
    public class ApprovalComment
    {
        public int Id { get; set; }
        
        [Required]
        public int ApprovalRequestId { get; set; }
        
        [Required]
        [StringLength(2000)]
        public string Comment { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Action { get; set; } = string.Empty; // "Created", "Approved", "Rejected", "Changes Requested", "Updated"
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign keys
        public string? CreatedById { get; set; }
        
        // Navigation properties
        public virtual ApprovalRequest ApprovalRequest { get; set; } = null!;
        public virtual ApplicationUser? CreatedBy { get; set; }
    }
}
