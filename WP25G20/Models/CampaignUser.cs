namespace WP25G20.Models
{
    public class CampaignUser
    {
        public int Id { get; set; }
        
        public int CampaignId { get; set; }
        public string UserId { get; set; } = string.Empty;
        
        public CampaignUserRole Role { get; set; } = CampaignUserRole.Viewer;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual Campaign Campaign { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;
    }
    
    public enum CampaignUserRole
    {
        Viewer,
        Editor
    }
}
