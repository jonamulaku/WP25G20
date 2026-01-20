using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;
using System.Security.Claims;

namespace WP25G20.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    public class ClientsController : Controller
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        public async Task<IActionResult> Index(FilterDTO? filter)
        {
            filter ??= new FilterDTO { PageNumber = 1, PageSize = 10 };
            var result = await _clientService.GetAllAsync(filter);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null) return NotFound();
            return View(client);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ClientCreateDTO dto)
        {
            if (!ModelState.IsValid) return View(dto);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.CreateAsync(dto, userId);
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null) return NotFound();

            var updateDto = new ClientUpdateDTO
            {
                CompanyName = client.CompanyName,
                ContactPerson = client.ContactPerson,
                Email = client.Email,
                Phone = client.Phone,
                Address = client.Address,
                Notes = client.Notes,
                IsActive = client.IsActive
            };

            return View(updateDto);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, ClientUpdateDTO dto)
        {
            if (!ModelState.IsValid) return View(dto);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _clientService.UpdateAsync(id, dto, userId);
            if (result == null) return NotFound();

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _clientService.DeleteAsync(id, userId);
            return RedirectToAction(nameof(Index));
        }
    }
}
