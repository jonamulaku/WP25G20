using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.DTOs;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Services
{
    public class ServiceService : IServiceService
    {
        private readonly IServiceRepository _repository;
        private readonly ApplicationDbContext _context;

        public ServiceService(IServiceRepository repository, ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<PagedResultDTO<ServiceDTO>> GetAllAsync(FilterDTO filter)
        {
            var query = _context.Services.AsQueryable();

            // Apply search
            if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
            {
                query = query.Where(s => s.Name.Contains(filter.SearchTerm) ||
                                       (s.Description != null && s.Description.Contains(filter.SearchTerm)));
            }

            // Apply filters
            if (filter.Filters != null && filter.Filters.ContainsKey("IsActive"))
            {
                var isActive = bool.Parse(filter.Filters["IsActive"]);
                query = query.Where(s => s.IsActive == isActive);
            }

            // Apply sorting
            if (!string.IsNullOrWhiteSpace(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "name" => filter.SortDescending
                        ? query.OrderByDescending(s => s.Name)
                        : query.OrderBy(s => s.Name),
                    "price" => filter.SortDescending
                        ? query.OrderByDescending(s => s.BasePrice)
                        : query.OrderBy(s => s.BasePrice),
                    _ => query.OrderByDescending(s => s.CreatedAt)
                };
            }
            else
            {
                query = query.OrderByDescending(s => s.CreatedAt);
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(s => new ServiceDTO
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    Deliverables = s.Deliverables,
                    BasePrice = s.BasePrice,
                    PricingType = s.PricingType.ToString(),
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt,
                    CampaignCount = s.Campaigns.Count
                })
                .ToListAsync();

            return new PagedResultDTO<ServiceDTO>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize
            };
        }

        public async Task<ServiceDTO?> GetByIdAsync(int id)
        {
            var service = await _repository.GetByIdAsync(id);
            if (service == null) return null;

            return new ServiceDTO
            {
                Id = service.Id,
                Name = service.Name,
                Description = service.Description,
                Deliverables = service.Deliverables,
                BasePrice = service.BasePrice,
                PricingType = service.PricingType.ToString(),
                IsActive = service.IsActive,
                CreatedAt = service.CreatedAt,
                CampaignCount = service.Campaigns.Count
            };
        }

        public async Task<ServiceDTO> CreateAsync(ServiceCreateDTO dto)
        {
            var service = new Service
            {
                Name = dto.Name,
                Description = dto.Description,
                Deliverables = dto.Deliverables,
                BasePrice = dto.BasePrice,
                PricingType = Enum.TryParse<ServicePricingType>(dto.PricingType, out var pricingType) 
                    ? pricingType 
                    : ServicePricingType.Fixed,
                IsActive = true
            };

            var created = await _repository.CreateAsync(service);

            return new ServiceDTO
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Deliverables = created.Deliverables,
                BasePrice = created.BasePrice,
                PricingType = created.PricingType.ToString(),
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt,
                CampaignCount = 0
            };
        }

        public async Task<ServiceDTO?> UpdateAsync(int id, ServiceUpdateDTO dto)
        {
            var service = await _repository.GetByIdAsync(id);
            if (service == null) return null;

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.Deliverables = dto.Deliverables;
            service.BasePrice = dto.BasePrice;
            service.IsActive = dto.IsActive;

            if (Enum.TryParse<ServicePricingType>(dto.PricingType, out var pricingType))
            {
                service.PricingType = pricingType;
            }

            var updated = await _repository.UpdateAsync(service);

            return new ServiceDTO
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                Deliverables = updated.Deliverables,
                BasePrice = updated.BasePrice,
                PricingType = updated.PricingType.ToString(),
                IsActive = updated.IsActive,
                CreatedAt = updated.CreatedAt,
                CampaignCount = updated.Campaigns.Count
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _repository.ExistsAsync(id);
        }
    }
}
