using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;

namespace WP25G20.Controllers.Public
{
    [Area("Public")]
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
            
            // Only show active clients for public area
            filter.Filters ??= new Dictionary<string, string>();
            filter.Filters["IsActive"] = "true";
            
            var result = await _clientService.GetAllAsync(filter);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null || !client.IsActive)
            {
                return NotFound();
            }
            return View(client);
        }
    }
}
