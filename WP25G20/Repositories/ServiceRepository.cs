using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Repositories
{
    public class ServiceRepository : IServiceRepository
    {
        private readonly ApplicationDbContext _context;

        public ServiceRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Service>> GetAllAsync()
        {
            return await _context.Services
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Service?> GetByIdAsync(int id)
        {
            return await _context.Services
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Service>> GetActiveServicesAsync()
        {
            return await _context.Services
                .Where(s => s.IsActive)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<Service> CreateAsync(Service service)
        {
            service.CreatedAt = DateTime.UtcNow;
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<Service> UpdateAsync(Service service)
        {
            service.UpdatedAt = DateTime.UtcNow;
            _context.Services.Update(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null) return false;

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Services.AnyAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<Service>> SearchAsync(string searchTerm)
        {
            return await _context.Services
                .Where(s => s.Name.Contains(searchTerm) ||
                           (s.Description != null && s.Description.Contains(searchTerm)))
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }
    }
}
