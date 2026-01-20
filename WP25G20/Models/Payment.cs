using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WP25G20.Models
{
    public class Payment
    {
        public int Id { get; set; }
        
        [Required]
        public int InvoiceId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string PaymentNumber { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        public PaymentMethod Method { get; set; } = PaymentMethod.BankTransfer;
        
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        
        [StringLength(100)]
        public string? TransactionId { get; set; }
        
        [StringLength(500)]
        public string? PaymentReference { get; set; }
        
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? ProcessedDate { get; set; }
        
        [StringLength(1000)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Foreign keys
        public string? ProcessedById { get; set; }
        
        // Navigation properties
        public virtual Invoice Invoice { get; set; } = null!;
        public virtual ApplicationUser? ProcessedBy { get; set; }
    }
    
    public enum PaymentMethod
    {
        BankTransfer,
        CreditCard,
        DebitCard,
        PayPal,
        Stripe,
        Check,
        Cash,
        Other
    }
    
    public enum PaymentStatus
    {
        Pending,
        Processing,
        Completed,
        Failed,
        Refunded,
        Cancelled
    }
}
