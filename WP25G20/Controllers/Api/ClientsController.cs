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

        [HttpGet("me")]
        public async Task<ActionResult<ClientDTO>> GetCurrentClient()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            
            // Get all clients and find the one matching the user's email
            var clientFilter = new FilterDTO { PageSize = 1000 };
            var clientResult = await _clientService.GetAllAsync(clientFilter, userId, isAdmin);
            
            // Try to get email from claims
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            ClientDTO? client = null;
            
            if (!string.IsNullOrEmpty(userEmail))
            {
                // Find client by email
                client = clientResult.Items?.FirstOrDefault(c => c.Email?.ToLower() == userEmail.ToLower());
            }
            
            // If not found by email, get the first client (service filters by user)
            if (client == null)
            {
                client = clientResult.Items?.FirstOrDefault();
            }
            
            if (client == null) return NotFound();
            return Ok(client);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ClientDTO>> Update(int id, [FromBody] ClientUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            
            // Non-admin users can only update their own client data
            if (!isAdmin)
            {
                var userEmail = User.FindFirstValue(ClaimTypes.Email);
                if (string.IsNullOrEmpty(userEmail) || dto.Email?.ToLower() != userEmail.ToLower())
                {
                    return StatusCode(403, new { message = "You can only update your own client profile." });
                }
            }

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
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }

        [HttpPut("me")]
        public async Task<ActionResult<ClientDTO>> UpdateCurrentClient([FromBody] ClientUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            
            // Get client for current user
            var clientFilter = new FilterDTO { PageSize = 1000 };
            var clientResult = await _clientService.GetAllAsync(clientFilter, userId, isAdmin);
            var existingClient = clientResult.Items?.FirstOrDefault();
            
            // If client doesn't exist, use id=0 to create it (ClientService handles this)
            int clientId = existingClient?.Id ?? 0;
            
            // Ensure the email in DTO matches the user's email
            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            if (!string.IsNullOrEmpty(userEmail))
            {
                dto.Email = userEmail;
            }
            else if (existingClient != null)
            {
                dto.Email = existingClient.Email;
            }

            try
            {
                var updatedClient = await _clientService.UpdateAsync(clientId, dto, userId);
                if (updatedClient == null) return NotFound();
                return Ok(updatedClient);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
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
