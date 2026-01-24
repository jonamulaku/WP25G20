using System.ComponentModel.DataAnnotations;

namespace WP25G20.DTOs
{
    public class ApprovalRequestDTO
    {
        public int Id { get; set; }
        public int CampaignId { get; set; }
        public string CampaignName { get; set; } = string.Empty;
        public int? TaskId { get; set; }
        public string? TaskTitle { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ItemType { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Explanation { get; set; }
        public string? CtaDescription { get; set; }
        public string? PlatformSpecs { get; set; }
        public string? PreviewUrl { get; set; }
        public string? PreviewType { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public string? CreatedByName { get; set; }
        public string? ApprovedByName { get; set; }
        public List<ApprovalCommentDTO> Comments { get; set; } = new List<ApprovalCommentDTO>();
    }

    public class ApprovalCommentDTO
    {
        public int Id { get; set; }
        public int ApprovalRequestId { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? CreatedByName { get; set; }
    }

    public class ApprovalRequestCreateDTO
    {
        [Required]
        public int CampaignId { get; set; }

        public int? TaskId { get; set; }

        [Required]
        [StringLength(200)]
        public string ItemName { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(50)]
        public string? ItemType { get; set; }

        [StringLength(5000)]
        public string? Explanation { get; set; }

        [StringLength(500)]
        public string? CtaDescription { get; set; }

        [StringLength(500)]
        public string? PlatformSpecs { get; set; }

        [StringLength(1000)]
        public string? PreviewUrl { get; set; }

        [StringLength(50)]
        public string? PreviewType { get; set; }

        public DateTime? DueDate { get; set; }
    }

    public class ApprovalRequestUpdateDTO
    {
        [Required]
        [StringLength(200)]
        public string ItemName { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [StringLength(5000)]
        public string? Explanation { get; set; }

        [StringLength(500)]
        public string? CtaDescription { get; set; }

        [StringLength(500)]
        public string? PlatformSpecs { get; set; }

        [StringLength(1000)]
        public string? PreviewUrl { get; set; }

        [StringLength(50)]
        public string? PreviewType { get; set; }

        public DateTime? DueDate { get; set; }
    }

    public class ApprovalActionDTO
    {
        [Required]
        public string Action { get; set; } = string.Empty; // "Approved", "Rejected", "ChangesRequested"

        [StringLength(2000)]
        public string? Comment { get; set; }
    }
}
