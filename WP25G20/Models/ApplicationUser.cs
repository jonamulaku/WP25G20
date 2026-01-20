using Microsoft.AspNetCore.Identity;

namespace WP25G20.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<Campaign> CreatedCampaigns { get; set; } = new List<Campaign>();
        public virtual ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
        public virtual ICollection<Client> ManagedClients { get; set; } = new List<Client>();
    }
}
