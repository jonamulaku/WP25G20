using WP25G20.Models;

namespace WP25G20.Repositories
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<Payment?> GetByPaymentNumberAsync(string paymentNumber);
        Task<IEnumerable<Payment>> GetByInvoiceIdAsync(int invoiceId);
        Task<IEnumerable<Payment>> GetByClientIdAsync(int clientId);
        Task<Payment> CreateAsync(Payment payment);
        Task<Payment> UpdateAsync(Payment payment);
        Task<bool> DeleteAsync(int id);
        Task<bool> PaymentNumberExistsAsync(string paymentNumber);
        Task<string> GeneratePaymentNumberAsync();
    }
}
