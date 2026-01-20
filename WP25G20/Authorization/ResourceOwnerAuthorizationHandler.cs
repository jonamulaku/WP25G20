using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Authorization
{
    public class ResourceOwnerRequirement : IAuthorizationRequirement
    {
    }

    public class ResourceOwnerAuthorizationHandler : AuthorizationHandler<ResourceOwnerRequirement>
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ResourceOwnerAuthorizationHandler(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        protected override async System.Threading.Tasks.Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            ResourceOwnerRequirement requirement)
        {
            if (context.User.IsInRole("Admin"))
            {
                context.Succeed(requirement);
                return;
            }

            var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return;
            }

            // Check if user is accessing their own resource
            // This will be checked in the service layer for specific resources
            context.Succeed(requirement);
        }
    }
}
