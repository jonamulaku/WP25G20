namespace WP25G20.DTOs
{
    public class InvoiceDTO
    {
        public int Id { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public int? CampaignId { get; set; }
        public string? CampaignName { get; set; }
        public decimal Amount { get; set; }
        public decimal? TaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime IssueDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class InvoiceCreateDTO
    {
        public int ClientId { get; set; }
        public int? CampaignId { get; set; }
        public decimal Amount { get; set; }
        public decimal? TaxAmount { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Notes { get; set; }
    }
    
    public class InvoiceUpdateDTO
    {
        public decimal Amount { get; set; }
        public decimal? TaxAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public DateTime? PaidDate { get; set; }
        public string? Notes { get; set; }
    }
}
