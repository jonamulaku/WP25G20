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
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<InvoiceDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _invoiceService.GetAllAsync(filter, userId, isAdmin);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var invoice = await _invoiceService.GetByIdAsync(id, userId, isAdmin);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetByClientId(int clientId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var invoices = await _invoiceService.GetByClientIdAsync(clientId, userId, isAdmin);
            return Ok(invoices);
        }

        [HttpGet("campaign/{campaignId}")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetByCampaignId(int campaignId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var invoices = await _invoiceService.GetByCampaignIdAsync(campaignId, userId, isAdmin);
            return Ok(invoices);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<InvoiceDTO>> Create([FromBody] InvoiceCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var invoice = await _invoiceService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, invoice);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<InvoiceDTO>> Update(int id, [FromBody] InvoiceUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var isAdmin = User.IsInRole("Admin");
                var invoice = await _invoiceService.UpdateAsync(id, dto, userId, isAdmin);
                if (invoice == null) return NotFound();
                return Ok(invoice);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
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
                var isAdmin = User.IsInRole("Admin");
                var deleted = await _invoiceService.DeleteAsync(id, userId, isAdmin);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("{id}/mark-as-paid")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsPaid(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _invoiceService.MarkAsPaidAsync(id, DateTime.UtcNow, userId);
            if (!result) return NotFound();
            return Ok(new { message = "Invoice marked as paid" });
        }

        [HttpPost("{id}/mark-as-sent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkAsSent(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _invoiceService.MarkAsSentAsync(id, userId);
            if (!result) return NotFound();
            return Ok(new { message = "Invoice marked as sent" });
        }

        [HttpPost("ensure-campaign-invoices")]
        [Authorize(Roles = "Admin,Client")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> EnsureInvoicesForCampaigns()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var isAdmin = User.IsInRole("Admin");
            var invoices = await _invoiceService.EnsureInvoicesForCampaignsAsync(userId, isAdmin);
            return Ok(invoices);
        }
    }
}
