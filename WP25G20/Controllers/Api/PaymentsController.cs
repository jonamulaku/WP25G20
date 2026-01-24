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
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResultDTO<PaymentDTO>>> GetAll([FromQuery] FilterDTO filter)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _paymentService.GetAllAsync(filter, userId, isAdmin);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDTO>> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            try
            {
                var payment = await _paymentService.GetByIdAsync(id, userId, isAdmin);
                if (payment == null) return NotFound();
                return Ok(payment);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpGet("invoice/{invoiceId}")]
        public async Task<ActionResult<IEnumerable<PaymentDTO>>> GetByInvoiceId(int invoiceId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            try
            {
                var payments = await _paymentService.GetByInvoiceIdAsync(invoiceId, userId, isAdmin);
                return Ok(payments);
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

        [HttpGet("client/{clientId}")]
        public async Task<ActionResult<IEnumerable<PaymentDTO>>> GetByClientId(int clientId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var payments = await _paymentService.GetByClientIdAsync(clientId, userId, isAdmin);
            return Ok(payments);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Client")]
        public async Task<ActionResult<PaymentDTO>> Create([FromBody] PaymentCreateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var payment = await _paymentService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PaymentDTO>> Update(int id, [FromBody] PaymentUpdateDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var isAdmin = User.IsInRole("Admin");
                var payment = await _paymentService.UpdateAsync(id, dto, userId, isAdmin);
                if (payment == null) return NotFound();
                return Ok(payment);
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

        [HttpPost("process")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PaymentDTO>> ProcessPayment([FromBody] PaymentProcessDTO dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var isAdmin = User.IsInRole("Admin");
                var payment = await _paymentService.ProcessPaymentAsync(dto, userId, isAdmin);
                if (payment == null) return NotFound();
                return Ok(payment);
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
                var deleted = await _paymentService.DeleteAsync(id, userId, isAdmin);
                if (!deleted) return NotFound();
                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}
