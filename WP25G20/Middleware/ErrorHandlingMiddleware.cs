using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace WP25G20.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError;
            var message = "An error occurred while processing your request.";

            switch (exception)
            {
                case UnauthorizedAccessException:
                    code = HttpStatusCode.Unauthorized;
                    message = exception.Message;
                    break;
                case ArgumentException:
                case InvalidOperationException:
                    code = HttpStatusCode.BadRequest;
                    message = exception.Message;
                    break;
                case KeyNotFoundException:
                case FileNotFoundException:
                    code = HttpStatusCode.NotFound;
                    message = "The requested resource was not found.";
                    break;
                case DbUpdateException dbEx:
                    code = HttpStatusCode.BadRequest;
                    // Check if it's a foreign key constraint violation
                    if (dbEx.InnerException?.Message.Contains("FOREIGN KEY") == true || 
                        dbEx.InnerException?.Message.Contains("DELETE statement conflicted") == true)
                    {
                        message = "Cannot delete this item because it has related records. Please delete or reassign related items first.";
                    }
                    else
                    {
                        message = "A database error occurred while processing your request.";
                    }
                    break;
            }

            var result = JsonSerializer.Serialize(new { error = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}
