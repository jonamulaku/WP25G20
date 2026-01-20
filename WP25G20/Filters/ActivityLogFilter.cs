using Microsoft.AspNetCore.Mvc.Filters;
using WP25G20.Data;
using WP25G20.Models;
using WP25G20.Repositories;

namespace WP25G20.Filters
{
    public class ActivityLogFilter : IActionFilter
    {
        private readonly IActivityLogRepository _activityLogRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ActivityLogFilter(
            IActivityLogRepository activityLogRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _activityLogRepository = activityLogRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Can be used for pre-action logging if needed
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Logging is handled in services for more control
            // This filter can be used for automatic logging if needed
        }
    }
}
