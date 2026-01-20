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
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<TaskDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _taskService.GetAllAsync(filter, userId, isAdmin);
            return Ok(result);
        }

        [HttpGet("me")]
        public async Task<ActionResult<PagedResultDTO<TaskDTO>>> GetMyTasks([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _taskService.GetMyTasksAsync(userId, filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var task = await _taskService.GetByIdAsync(id, userId);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<TaskDTO>> Create([FromBody] TaskCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var task = await _taskService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDTO>> Update(int id, [FromBody] TaskUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var task = await _taskService.UpdateAsync(id, dto, userId);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var deleted = await _taskService.DeleteAsync(id, userId);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
