using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;

namespace WP25G20.Controllers.Public
{
    [Area("Public")]
    public class ServicesController : Controller
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        public async Task<IActionResult> Index(FilterDTO? filter)
        {
            filter ??= new FilterDTO { PageNumber = 1, PageSize = 10 };
            
            // Only show active services for public area
            filter.Filters ??= new Dictionary<string, string>();
            filter.Filters["IsActive"] = "true";
            
            var result = await _serviceService.GetAllAsync(filter);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var service = await _serviceService.GetByIdAsync(id);
            if (service == null || !service.IsActive)
            {
                return NotFound();
            }
            return View(service);
        }
    }
}
