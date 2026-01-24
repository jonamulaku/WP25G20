using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;
using System.Security.Claims;

namespace WP25G20.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApprovalRequestsController : ControllerBase
    {
        private readonly IApprovalRequestService _approvalRequestService;

        public ApprovalRequestsController(IApprovalRequestService approvalRequestService)
        {
            _approvalRequestService = approvalRequestService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<ApprovalRequestDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _approvalRequestService.GetAllAsync(filter, userId, isAdmin);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApprovalRequestDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var approvalRequest = await _approvalRequestService.GetByIdAsync(id, userId);
            if (approvalRequest == null) return NotFound();
            return Ok(approvalRequest);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Client")]
        public async Task<ActionResult<ApprovalRequestDTO>> Create([FromBody] ApprovalRequestCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                // If client, verify they own the campaign
                var isAdmin = User.IsInRole("Admin");
                if (!isAdmin)
                {
                    // Verify the campaign belongs to the client
                    // This will be checked in the service layer
                }
                
                var result = await _approvalRequestService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while creating the approval request." });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApprovalRequestDTO>> Update(int id, [FromBody] ApprovalRequestUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var result = await _approvalRequestService.UpdateAsync(id, dto, userId);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while updating the approval request." });
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
                var deleted = await _approvalRequestService.DeleteAsync(id, userId);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while deleting the approval request." });
            }
        }

        [HttpPost("{id}/process")]
        [Authorize(Roles = "Client")]
        public async Task<ActionResult<ApprovalRequestDTO>> ProcessApproval(int id, [FromBody] ApprovalActionDTO actionDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var result = await _approvalRequestService.ProcessApprovalAsync(id, actionDto, userId);
                if (result == null) return NotFound();
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the actual error for debugging
                System.Diagnostics.Debug.WriteLine($"Error processing approval: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = $"An error occurred while processing the approval request: {ex.Message}" });
            }
        }
    }
}
