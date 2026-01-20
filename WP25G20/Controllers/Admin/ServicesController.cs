using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;

namespace WP25G20.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
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
            var result = await _serviceService.GetAllAsync(filter);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var service = await _serviceService.GetByIdAsync(id);
            if (service == null) return NotFound();
            return View(service);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ServiceCreateDTO dto)
        {
            if (!ModelState.IsValid) return View(dto);

            await _serviceService.CreateAsync(dto);
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var service = await _serviceService.GetByIdAsync(id);
            if (service == null) return NotFound();

            var updateDto = new ServiceUpdateDTO
            {
                Name = service.Name,
                Description = service.Description,
                Deliverables = service.Deliverables,
                BasePrice = service.BasePrice,
                PricingType = service.PricingType,
                IsActive = service.IsActive
            };

            return View(updateDto);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ServiceUpdateDTO dto)
        {
            if (!ModelState.IsValid) return View(dto);

            var result = await _serviceService.UpdateAsync(id, dto);
            if (result == null) return NotFound();

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceService.DeleteAsync(id);
            return RedirectToAction(nameof(Index));
        }
    }
}
