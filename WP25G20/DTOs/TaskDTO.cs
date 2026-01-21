using System.ComponentModel.DataAnnotations;

namespace WP25G20.DTOs
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CampaignId { get; set; }
        public string CampaignName { get; set; } = string.Empty;
        public int? AssignedToTeamMemberId { get; set; }
        public string? AssignedToTeamMemberName { get; set; }
        public string? AssignedToTeamMemberRole { get; set; }
        [Obsolete("Use AssignedToTeamMemberId instead")]
        public string? AssignedToId { get; set; }
        [Obsolete("Use AssignedToTeamMemberName instead")]
        public string? AssignedToName { get; set; }
        public DateTime? DueDate { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int CommentCount { get; set; }
        public int FileCount { get; set; }
    }
    
    public class TaskCreateDTO
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        public int CampaignId { get; set; }

        public int? AssignedToTeamMemberId { get; set; }
        
        [Obsolete("Use AssignedToTeamMemberId instead")]
        public string? AssignedToId { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }
    }
    
    public class TaskUpdateDTO
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        public int? AssignedToTeamMemberId { get; set; }
        
        [Obsolete("Use AssignedToTeamMemberId instead")]
        public string? AssignedToId { get; set; }

        public DateTime? DueDate { get; set; }

        [Required]
        [StringLength(20)]
        public string Priority { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }
    }
}
