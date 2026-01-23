using System.ComponentModel.DataAnnotations;

namespace WP25G20.DTOs
{
    public class CampaignDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public int ServiceId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal Budget { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TaskCount { get; set; }
        public int CompletedTaskCount { get; set; }
        public List<string> AssignedUserIds { get; set; } = new List<string>();
    }
    
    public class CampaignCreateDTO
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        public int ClientId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Budget { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public List<string>? AssignedUserIds { get; set; }
    }
    
    public class CampaignUpdateDTO
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        public int ServiceId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Budget { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }

        public List<string>? AssignedUserIds { get; set; }
    }
}
