using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WP25G20.DTOs;
using WP25G20.Services;
using System.Security.Claims;

namespace WP25G20.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [Area("Admin")]
    public class TasksController : Controller
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        public async Task<IActionResult> Index(FilterDTO? filter)
        {
            filter ??= new FilterDTO { PageNumber = 1, PageSize = 10 };
            var result = await _taskService.GetAllAsync(filter);
            return View(result);
        }

        public async Task<IActionResult> Details(int id)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null) return NotFound();
            return View(task);
        }

        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(TaskCreateDTO dto)
        {
            if (!ModelState.IsValid) return View(dto);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                await _taskService.CreateAsync(dto, userId);
                return RedirectToAction(nameof(Index));
            }
            catch (ArgumentException ex)
            {
                ModelState.AddModelError("", ex.Message);
                return View(dto);
            }
        }

        public async Task<IActionResult> Edit(int id)
        {
            var task = await _taskService.GetByIdAsync(id);
            if (task == null) return NotFound();

            var updateDto = new TaskUpdateDTO
            {
                Title = task.Title,
                Description = task.Description,
                AssignedToId = task.AssignedToId,
                DueDate = task.DueDate,
                Priority = task.Priority,
                Status = task.Status,
                Notes = task.Notes
            };

            return View(updateDto);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, TaskUpdateDTO dto)
        {
            if (!ModelState.IsValid) return View(dto);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _taskService.UpdateAsync(id, dto, userId);
            if (result == null) return NotFound();

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _taskService.DeleteAsync(id, userId);
            return RedirectToAction(nameof(Index));
        }
    }
}
