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
    public class CampaignsController : ControllerBase
    {
        private readonly ICampaignService _campaignService;

        public CampaignsController(ICampaignService campaignService)
        {
            _campaignService = campaignService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<CampaignDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _campaignService.GetAllAsync(filter, userId, isAdmin);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CampaignDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var campaign = await _campaignService.GetByIdAsync(id, userId);
            if (campaign == null) return NotFound();
            return Ok(campaign);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CampaignDTO>> Create([FromBody] CampaignCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var campaign = await _campaignService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = campaign.Id }, campaign);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the campaign.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CampaignDTO>> Update(int id, [FromBody] CampaignUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var campaign = await _campaignService.UpdateAsync(id, dto, userId);
            if (campaign == null) return NotFound();
            return Ok(campaign);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var deleted = await _campaignService.DeleteAsync(id, userId);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
