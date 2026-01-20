using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;

namespace WP25G20.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<ServiceDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var result = await _serviceService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDTO>> GetById(int id)
        {
            var service = await _serviceService.GetByIdAsync(id);
            if (service == null) return NotFound();
            return Ok(service);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceDTO>> Create([FromBody] ServiceCreateDTO dto)
        {
            var service = await _serviceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceDTO>> Update(int id, [FromBody] ServiceUpdateDTO dto)
        {
            var service = await _serviceService.UpdateAsync(id, dto);
            if (service == null) return NotFound();
            return Ok(service);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _serviceService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
