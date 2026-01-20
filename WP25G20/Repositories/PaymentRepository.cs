using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Client)
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Campaign)
                .Include(p => p.ProcessedBy)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Client)
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Campaign)
                .Include(p => p.ProcessedBy)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Payment?> GetByPaymentNumberAsync(string paymentNumber)
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                .FirstOrDefaultAsync(p => p.PaymentNumber == paymentNumber);
        }

        public async Task<IEnumerable<Payment>> GetByInvoiceIdAsync(int invoiceId)
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                .Include(p => p.ProcessedBy)
                .Where(p => p.InvoiceId == invoiceId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Payment>> GetByClientIdAsync(int clientId)
        {
            return await _context.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Client)
                .Include(p => p.ProcessedBy)
                .Where(p => p.Invoice.ClientId == clientId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Payment> CreateAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<Payment> UpdateAsync(Payment payment)
        {
            payment.UpdatedAt = DateTime.UtcNow;
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
            return payment;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return false;

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> PaymentNumberExistsAsync(string paymentNumber)
        {
            return await _context.Payments.AnyAsync(p => p.PaymentNumber == paymentNumber);
        }

        public async Task<string> GeneratePaymentNumberAsync()
        {
            var year = DateTime.UtcNow.Year;
            var prefix = $"PAY-{year}-";
            
            var lastPayment = await _context.Payments
                .Where(p => p.PaymentNumber.StartsWith(prefix))
                .OrderByDescending(p => p.PaymentNumber)
                .FirstOrDefaultAsync();

            int nextNumber = 1;
            if (lastPayment != null)
            {
                var parts = lastPayment.PaymentNumber.Split('-');
                if (parts.Length == 3 && int.TryParse(parts[2], out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            return $"{prefix}{nextNumber:D6}";
        }
    }
}
