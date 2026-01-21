using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Models;

namespace WP25G20.Data
{
    public static class SeedData
    {
        public static async System.Threading.Tasks.Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Create roles
            string[] roles = { "Admin", "Client", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Create admin user
            var adminEmail = "admin@marketingagency.com";
            var adminPassword = "Admin123!";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FirstName = "Admin",
                    LastName = "User",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    Console.WriteLine($"Admin user created: {adminEmail} / {adminPassword}");
                }
            }
            else
            {
                // Ensure admin has Admin role
                if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Create test user
            var testEmail = "user@marketingagency.com";
            var testPassword = "User123!";

            var testUser = await userManager.FindByEmailAsync(testEmail);
            if (testUser == null)
            {
                testUser = new ApplicationUser
                {
                    UserName = testEmail,
                    Email = testEmail,
                    EmailConfirmed = true,
                    FirstName = "Test",
                    LastName = "User",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(testUser, testPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(testUser, "User");
                    Console.WriteLine($"Test user created: {testEmail} / {testPassword}");
                }
            }

            // Create client user
            var clientEmail = "client@marketingagency.com";
            var clientPassword = "Client123!";

            var clientUser = await userManager.FindByEmailAsync(clientEmail);
            if (clientUser == null)
            {
                clientUser = new ApplicationUser
                {
                    UserName = clientEmail,
                    Email = clientEmail,
                    EmailConfirmed = true,
                    FirstName = "Client",
                    LastName = "User",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(clientUser, clientPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(clientUser, "Client");
                    Console.WriteLine($"Client user created: {clientEmail} / {clientPassword}");
                }
            }
            else
            {
                // Ensure client has Client role
                if (!await userManager.IsInRoleAsync(clientUser, "Client"))
                {
                    await userManager.AddToRoleAsync(clientUser, "Client");
                }
            }
        }

        public static async System.Threading.Tasks.Task SeedTeamMembersAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            var teamMembers = new[]
            {
                new TeamMember
                {
                    FirstName = "Alex",
                    LastName = "Martinez",
                    Email = "alex.martinez@marketingagency.com",
                    Role = "Digital Marketing Specialist",
                    Description = "Handles both paid advertising (Google Ads, Facebook/Instagram Ads) and organic social media management. Ensures that campaigns are optimized for lead generation, engagement, and ROI.",
                    Phone = "+1 555-0101",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new TeamMember
                {
                    FirstName = "Sarah",
                    LastName = "Chen",
                    Email = "sarah.chen@marketingagency.com",
                    Role = "Graphic Designer",
                    Description = "Creates all visual assets for campaigns, social media, and advertisements. Ensures the designs align with the brand's identity and appeal to the target audience.",
                    Phone = "+1 555-0102",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new TeamMember
                {
                    FirstName = "Michael",
                    LastName = "Thompson",
                    Email = "michael.thompson@marketingagency.com",
                    Role = "Campaign Manager",
                    Description = "Oversees the execution and optimization of marketing campaigns across all channels. Ensures everything runs smoothly, from strategy to implementation, and provides ongoing campaign performance reports.",
                    Phone = "+1 555-0103",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            foreach (var teamMember in teamMembers)
            {
                var exists = await context.TeamMembers
                    .AnyAsync(tm => tm.Email == teamMember.Email);

                if (!exists)
                {
                    context.TeamMembers.Add(teamMember);
                    Console.WriteLine($"Team member created: {teamMember.FirstName} {teamMember.LastName} - {teamMember.Role}");
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
