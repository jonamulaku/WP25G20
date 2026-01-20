namespace WP25G20.DTOs
{
    public class ServiceDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Deliverables { get; set; }
        public decimal? BasePrice { get; set; }
        public string PricingType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CampaignCount { get; set; }
    }
    
    public class ServiceCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Deliverables { get; set; }
        public decimal? BasePrice { get; set; }
        public string PricingType { get; set; } = string.Empty;
    }
    
    public class ServiceUpdateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Deliverables { get; set; }
        public decimal? BasePrice { get; set; }
        public string PricingType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
