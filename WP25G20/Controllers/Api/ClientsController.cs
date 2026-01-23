using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WP25G20.DTOs;
using WP25G20.Services;
using System.Security.Claims;

namespace WP25G20.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<ClientDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _clientService.GetAllAsync(filter, userId, isAdmin);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ClientDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var client = await _clientService.GetByIdAsync(id, userId);
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ClientDTO>> Create([FromBody] ClientCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var client = await _clientService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ClientDTO>> Update(int id, [FromBody] ClientUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var client = await _clientService.UpdateAsync(id, dto, userId);
                if (client == null) return NotFound();
                return Ok(client);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var deleted = await _clientService.DeleteAsync(id, userId);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (DbUpdateException ex)
            {
                // Check if it's a foreign key constraint violation
                var errorMessage = "Cannot delete client because it has related records. Please delete or reassign related items first.";
                if (ex.InnerException?.Message.Contains("FOREIGN KEY") == true || 
                    ex.InnerException?.Message.Contains("DELETE statement conflicted") == true)
                {
                    errorMessage = "Cannot delete client because it has related campaigns or invoices. Please delete or reassign them first.";
                }
                return BadRequest(new { error = errorMessage });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
