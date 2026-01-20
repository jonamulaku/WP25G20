namespace WP25G20.DTOs
{
    public class PaymentDTO
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string PaymentNumber { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? PaymentReference { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string? Notes { get; set; }
        public string? ProcessedByName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
    
    public class PaymentCreateDTO
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? PaymentReference { get; set; }
        public string? Notes { get; set; }
    }
    
    public class PaymentUpdateDTO
    {
        public decimal? Amount { get; set; }
        public string? Status { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentReference { get; set; }
        public DateTime? ProcessedDate { get; set; }
        public string? Notes { get; set; }
    }
    
    public class PaymentProcessDTO
    {
        public int PaymentId { get; set; }
        public bool IsSuccess { get; set; }
        public string? TransactionId { get; set; }
        public string? Notes { get; set; }
    }
}
