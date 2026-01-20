using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly ApplicationDbContext _context;

        public ClientRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Client>> GetAllAsync()
        {
            return await _context.Clients
                .Include(c => c.CreatedBy)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Client?> GetByIdAsync(int id)
        {
            return await _context.Clients
                .Include(c => c.CreatedBy)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Client?> GetByIdWithCampaignsAsync(int id)
        {
            return await _context.Clients
                .Include(c => c.CreatedBy)
                .Include(c => c.Campaigns)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Client>> GetActiveClientsAsync()
        {
            return await _context.Clients
                .Where(c => c.IsActive)
                .Include(c => c.CreatedBy)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Client> CreateAsync(Client client)
        {
            client.CreatedAt = DateTime.UtcNow;
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task<Client> UpdateAsync(Client client)
        {
            client.UpdatedAt = DateTime.UtcNow;
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
            return client;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null) return false;

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Clients.AnyAsync(c => c.Id == id);
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            var query = _context.Clients.Where(c => c.Email == email);
            if (excludeId.HasValue)
            {
                query = query.Where(c => c.Id != excludeId.Value);
            }
            return await query.AnyAsync();
        }

        public async Task<IEnumerable<Client>> SearchAsync(string searchTerm)
        {
            return await _context.Clients
                .Where(c => c.CompanyName.Contains(searchTerm) ||
                           c.Email.Contains(searchTerm) ||
                           (c.ContactPerson != null && c.ContactPerson.Contains(searchTerm)))
                .Include(c => c.CreatedBy)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }
    }
}
