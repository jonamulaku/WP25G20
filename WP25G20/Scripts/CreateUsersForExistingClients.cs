using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WP25G20.Data;
using WP25G20.Models;

namespace WP25G20.Scripts
{
    /// <summary>
    /// Migration script to create ApplicationUser accounts for existing clients
    /// Run this once to create user accounts for all existing clients
    /// </summary>
    public static class CreateUsersForExistingClients
    {
        public static async System.Threading.Tasks.Task RunAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var logger = serviceProvider.GetService<ILoggerFactory>()?.CreateLogger("CreateUsersForExistingClients");

            try
            {
                // Ensure Client role exists
                if (!await roleManager.RoleExistsAsync("Client"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Client"));
                    logger?.LogInformation("Client role created");
                }

                // Get all active clients
                var clients = await context.Clients
                    .Where(c => c.IsActive)
                    .ToListAsync();

                int createdCount = 0;
                int skippedCount = 0;
                int errorCount = 0;

                foreach (var client in clients)
                {
                    // Check if user already exists
                    var existingUser = await userManager.FindByEmailAsync(client.Email);
                    if (existingUser != null)
                    {
                        // User exists - ensure they have Client role
                        if (!await userManager.IsInRoleAsync(existingUser, "Client"))
                        {
                            await userManager.AddToRoleAsync(existingUser, "Client");
                            logger?.LogInformation($"Added Client role to existing user: {client.Email}");
                        }
                        skippedCount++;
                        continue;
                    }

                    // Create new user for client
                    var clientUser = new ApplicationUser
                    {
                        UserName = client.Email,
                        Email = client.Email,
                        EmailConfirmed = true,
                        FirstName = client.ContactPerson?.Split(' ').FirstOrDefault(),
                        LastName = client.ContactPerson?.Split(' ').Skip(1).FirstOrDefault(),
                        IsActive = client.IsActive,
                        CreatedAt = client.CreatedAt
                    };

                    // Default password: Client123! (clients should change this on first login)
                    var defaultPassword = "Client123!";
                    var result = await userManager.CreateAsync(clientUser, defaultPassword);

                    if (result.Succeeded)
                    {
                        // Assign Client role
                        await userManager.AddToRoleAsync(clientUser, "Client");
                        createdCount++;
                        logger?.LogInformation($"Created user account for client: {client.Email} / {defaultPassword}");
                    }
                    else
                    {
                        errorCount++;
                        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                        logger?.LogError($"Failed to create user for client {client.Email}: {errors}");
                    }
                }

                logger?.LogInformation($"Migration completed: {createdCount} users created, {skippedCount} skipped, {errorCount} errors");
                Console.WriteLine($"Migration completed: {createdCount} users created, {skippedCount} skipped, {errorCount} errors");
            }
            catch (Exception ex)
            {
                logger?.LogError(ex, "Error creating users for existing clients");
                throw;
            }
        }
    }
}
