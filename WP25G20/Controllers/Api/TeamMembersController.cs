using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;

namespace WP25G20.Controllers.Api
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TeamMembersController : ControllerBase
    {
        private readonly ITeamMemberService _teamMemberService;

        public TeamMembersController(ITeamMemberService teamMemberService)
        {
            _teamMemberService = teamMemberService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<TeamMemberDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var result = await _teamMemberService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamMemberDTO>> GetById(int id)
        {
            var teamMember = await _teamMemberService.GetByIdAsync(id);
            if (teamMember == null) return NotFound();
            return Ok(teamMember);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TeamMemberDTO>> Create([FromBody] TeamMemberCreateDTO dto)
        {
            try
            {
                var teamMember = await _teamMemberService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = teamMember.Id }, teamMember);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TeamMemberDTO>> Update(int id, [FromBody] TeamMemberUpdateDTO dto)
        {
            try
            {
                var teamMember = await _teamMemberService.UpdateAsync(id, dto);
                if (teamMember == null) return NotFound();
                return Ok(teamMember);
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
            var deleted = await _teamMemberService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
