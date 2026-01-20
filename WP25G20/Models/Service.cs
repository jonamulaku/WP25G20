using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WP25G20.Models
{
    public class Service
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        [StringLength(500)]
        public string? Deliverables { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? BasePrice { get; set; }
        
        public ServicePricingType PricingType { get; set; } = ServicePricingType.Fixed;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<Campaign> Campaigns { get; set; } = new List<Campaign>();
    }
    
    public enum ServicePricingType
    {
        Fixed,
        Monthly,
        Hourly,
        ProjectBased
    }
}
