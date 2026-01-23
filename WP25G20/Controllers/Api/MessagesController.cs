using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;
using System.Security.Claims;

namespace WP25G20.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedResultDTO<MessageDTO>>> GetAll([FromQuery] MessageFilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _messageService.GetAllAsync(filter, userId);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<MessageDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var message = await _messageService.GetByIdAsync(id, userId);
            if (message == null) return NotFound();
            return Ok(message);
        }

        [HttpPost]
        public async Task<ActionResult<MessageDTO>> Create([FromBody] MessageCreateDTO dto)
        {
            // For contact form, no auth required
            var userId = User?.FindFirstValue(ClaimTypes.NameIdentifier);
            
            try
            {
                var message = await _messageService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = message.Id }, message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the message.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<MessageDTO>> Update(int id, [FromBody] MessageUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var message = await _messageService.UpdateAsync(id, dto, userId);
                if (message == null) return NotFound();
                return Ok(message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var deleted = await _messageService.DeleteAsync(id, userId);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("unread-count")]
        [Authorize]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var count = await _messageService.GetUnreadCountAsync(userId);
            return Ok(count);
        }
    }
}
