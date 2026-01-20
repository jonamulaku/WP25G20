using WP25G20.DTOs;

namespace WP25G20.Services
{
    public interface IPaymentService
    {
        Task<PagedResultDTO<PaymentDTO>> GetAllAsync(FilterDTO filter, string? userId, bool isAdmin);
        Task<PaymentDTO?> GetByIdAsync(int id, string? userId, bool isAdmin);
        Task<IEnumerable<PaymentDTO>> GetByInvoiceIdAsync(int invoiceId, string? userId, bool isAdmin);
        Task<IEnumerable<PaymentDTO>> GetByClientIdAsync(int clientId, string? userId, bool isAdmin);
        Task<PaymentDTO> CreateAsync(PaymentCreateDTO dto, string userId);
        Task<PaymentDTO?> UpdateAsync(int id, PaymentUpdateDTO dto, string userId, bool isAdmin);
        Task<PaymentDTO?> ProcessPaymentAsync(PaymentProcessDTO dto, string userId, bool isAdmin);
        Task<bool> DeleteAsync(int id, string userId, bool isAdmin);
    }
}
