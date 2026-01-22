using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Models;
using TaskModel = WP25G20.Models.Task;
using TaskStatus = WP25G20.Models.TaskStatus;
using TaskPriority = WP25G20.Models.TaskPriority;

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

        public static async System.Threading.Tasks.Task SeedSampleDataAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Get admin user for CreatedById
            var adminUser = await userManager.FindByEmailAsync("admin@marketingagency.com");
            var adminUserId = adminUser?.Id;

            // IMPORTANT: Only seed if database is completely empty
            // This prevents overwriting shared development data
            var hasAnyData = await context.Services.AnyAsync() || 
                            await context.Clients.AnyAsync() || 
                            await context.Campaigns.AnyAsync();
            
            if (hasAnyData)
            {
                Console.WriteLine("Database already contains data. Skipping sample data seeding to preserve shared data.");
                return;
            }

            // Seed Services
            if (!await context.Services.AnyAsync())
            {
                var services = new[]
                {
                    new Service
                    {
                        Name = "Digital Marketing",
                        Description = "Comprehensive digital marketing services including social media and paid advertising",
                        Deliverables = "Social media management, paid ad campaigns, SEO optimization",
                        BasePrice = 2500.00m,
                        PricingType = ServicePricingType.Monthly,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Service
                    {
                        Name = "Graphic Design",
                        Description = "Professional graphic design services for campaigns and branding",
                        Deliverables = "Logo design, marketing collateral, UI/UX design",
                        BasePrice = 1500.00m,
                        PricingType = ServicePricingType.ProjectBased,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Service
                    {
                        Name = "Campaign Management",
                        Description = "End-to-end campaign management and optimization",
                        Deliverables = "Strategy planning, execution, performance reporting",
                        BasePrice = 3000.00m,
                        PricingType = ServicePricingType.Monthly,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Service
                    {
                        Name = "Analytics & Reporting",
                        Description = "Comprehensive analytics and performance reporting",
                        Deliverables = "Performance tracking, trend analysis, actionable insights",
                        BasePrice = 1200.00m,
                        PricingType = ServicePricingType.Monthly,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Services.AddRange(services);
                await context.SaveChangesAsync();
                Console.WriteLine("Services seeded successfully");
            }

            // Seed Clients
            if (!await context.Clients.AnyAsync())
            {
                var clients = new[]
                {
                    new Client
                    {
                        CompanyName = "TechStart Solutions",
                        ContactPerson = "John Smith",
                        Email = "john.smith@techstart.com",
                        Phone = "+1 555-1001",
                        Address = "123 Tech Street, San Francisco, CA 94102",
                        Notes = "Fast-growing tech startup, needs aggressive marketing",
                        IsActive = true,
                        CreatedById = adminUserId,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Client
                    {
                        CompanyName = "GreenLife Organics",
                        ContactPerson = "Sarah Johnson",
                        Email = "sarah@greenlife.com",
                        Phone = "+1 555-1002",
                        Address = "456 Organic Ave, Portland, OR 97201",
                        Notes = "Organic food company, focuses on sustainability",
                        IsActive = true,
                        CreatedById = adminUserId,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Client
                    {
                        CompanyName = "Fashion Forward Inc",
                        ContactPerson = "Michael Chen",
                        Email = "michael@fashionforward.com",
                        Phone = "+1 555-1003",
                        Address = "789 Fashion Blvd, New York, NY 10001",
                        Notes = "Luxury fashion brand, seasonal campaigns",
                        IsActive = true,
                        CreatedById = adminUserId,
                        CreatedAt = DateTime.UtcNow
                    },
                    new Client
                    {
                        CompanyName = "FitZone Gym",
                        ContactPerson = "Emily Rodriguez",
                        Email = "emily@fitzone.com",
                        Phone = "+1 555-1004",
                        Address = "321 Fitness Way, Los Angeles, CA 90001",
                        Notes = "Local gym chain, needs local marketing",
                        IsActive = true,
                        CreatedById = adminUserId,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Clients.AddRange(clients);
                await context.SaveChangesAsync();
                Console.WriteLine("Clients seeded successfully");
            }

            // Seed Campaigns (need to get services and clients first)
            if (!await context.Campaigns.AnyAsync())
            {
                var services = await context.Services.ToListAsync();
                var clients = await context.Clients.ToListAsync();

                if (services.Any() && clients.Any())
                {
                    var campaigns = new[]
                    {
                        new Campaign
                        {
                            Name = "Q1 Social Media Blitz",
                            Description = "Comprehensive social media campaign for Q1 to increase brand awareness and engagement",
                            ClientId = clients[0].Id,
                            ServiceId = services[0].Id,
                            StartDate = DateTime.UtcNow.AddDays(-30),
                            EndDate = DateTime.UtcNow.AddDays(60),
                            Budget = 15000.00m,
                            Status = CampaignStatus.Active,
                            Notes = "Focus on LinkedIn and Instagram",
                            CreatedById = adminUserId,
                            CreatedAt = DateTime.UtcNow.AddDays(-30)
                        },
                        new Campaign
                        {
                            Name = "Brand Identity Redesign",
                            Description = "Complete brand identity redesign including logo, colors, and marketing materials",
                            ClientId = clients[1].Id,
                            ServiceId = services[1].Id,
                            StartDate = DateTime.UtcNow.AddDays(-15),
                            EndDate = DateTime.UtcNow.AddDays(45),
                            Budget = 8000.00m,
                            Status = CampaignStatus.Active,
                            Notes = "Eco-friendly design focus",
                            CreatedById = adminUserId,
                            CreatedAt = DateTime.UtcNow.AddDays(-15)
                        },
                        new Campaign
                        {
                            Name = "Spring Collection Launch",
                            Description = "Marketing campaign for spring fashion collection launch",
                            ClientId = clients[2].Id,
                            ServiceId = services[2].Id,
                            StartDate = DateTime.UtcNow.AddDays(-7),
                            EndDate = DateTime.UtcNow.AddDays(53),
                            Budget = 25000.00m,
                            Status = CampaignStatus.Active,
                            Notes = "High-end luxury market",
                            CreatedById = adminUserId,
                            CreatedAt = DateTime.UtcNow.AddDays(-7)
                        },
                        new Campaign
                        {
                            Name = "New Year Fitness Challenge",
                            Description = "Local marketing campaign for New Year fitness membership drive",
                            ClientId = clients[3].Id,
                            ServiceId = services[0].Id,
                            StartDate = DateTime.UtcNow.AddDays(-10),
                            EndDate = DateTime.UtcNow.AddDays(20),
                            Budget = 5000.00m,
                            Status = CampaignStatus.Active,
                            Notes = "Target local community",
                            CreatedById = adminUserId,
                            CreatedAt = DateTime.UtcNow.AddDays(-10)
                        }
                    };

                    context.Campaigns.AddRange(campaigns);
                    await context.SaveChangesAsync();
                    Console.WriteLine("Campaigns seeded successfully");

                    // Seed Tasks (need campaigns and team members)
                    var campaignsList = await context.Campaigns.ToListAsync();
                    var teamMembers = await context.TeamMembers.ToListAsync();

                    if (campaignsList.Any() && teamMembers.Any())
                    {
                        var tasks = new[]
                        {
                            new TaskModel
                            {
                                Title = "Create social media content calendar",
                                Description = "Develop a comprehensive content calendar for Q1 social media campaign",
                                CampaignId = campaignsList[0].Id,
                                AssignedToTeamMemberId = teamMembers[0].Id, // Digital Marketing Specialist
                                DueDate = DateTime.UtcNow.AddDays(5),
                                Priority = TaskPriority.High,
                                Status = TaskStatus.InProgress,
                                Notes = "Include posts for LinkedIn and Instagram",
                                CreatedById = adminUserId,
                                CreatedAt = DateTime.UtcNow.AddDays(-25)
                            },
                            new TaskModel
                            {
                                Title = "Design new logo concepts",
                                Description = "Create 3-5 logo concepts for brand identity redesign",
                                CampaignId = campaignsList[1].Id,
                                AssignedToTeamMemberId = teamMembers[1].Id, // Graphic Designer
                                DueDate = DateTime.UtcNow.AddDays(10),
                                Priority = TaskPriority.High,
                                Status = TaskStatus.Pending,
                                Notes = "Must reflect eco-friendly values",
                                CreatedById = adminUserId,
                                CreatedAt = DateTime.UtcNow.AddDays(-10)
                            },
                            new TaskModel
                            {
                                Title = "Set up paid ad campaigns",
                                Description = "Configure Google Ads and Facebook Ads for spring collection launch",
                                CampaignId = campaignsList[2].Id,
                                AssignedToTeamMemberId = teamMembers[0].Id, // Digital Marketing Specialist
                                DueDate = DateTime.UtcNow.AddDays(3),
                                Priority = TaskPriority.Urgent,
                                Status = TaskStatus.Pending,
                                Notes = "Target high-income demographics",
                                CreatedById = adminUserId,
                                CreatedAt = DateTime.UtcNow.AddDays(-5)
                            },
                            new TaskModel
                            {
                                Title = "Develop campaign strategy",
                                Description = "Create comprehensive campaign strategy document",
                                CampaignId = campaignsList[2].Id,
                                AssignedToTeamMemberId = teamMembers[2].Id, // Campaign Manager
                                DueDate = DateTime.UtcNow.AddDays(7),
                                Priority = TaskPriority.Medium,
                                Status = TaskStatus.InProgress,
                                Notes = "Include KPIs and success metrics",
                                CreatedById = adminUserId,
                                CreatedAt = DateTime.UtcNow.AddDays(-7)
                            },
                            new TaskModel
                            {
                                Title = "Create local flyers and posters",
                                Description = "Design promotional materials for local gym marketing",
                                CampaignId = campaignsList[3].Id,
                                AssignedToTeamMemberId = teamMembers[1].Id, // Graphic Designer
                                DueDate = DateTime.UtcNow.AddDays(2),
                                Priority = TaskPriority.High,
                                Status = TaskStatus.Completed,
                                CompletedAt = DateTime.UtcNow.AddDays(-1),
                                Notes = "Print-ready files needed",
                                CreatedById = adminUserId,
                                CreatedAt = DateTime.UtcNow.AddDays(-8)
                            },
                            new TaskModel
                            {
                                Title = "Monitor campaign performance",
                                Description = "Track and analyze campaign metrics weekly",
                                CampaignId = campaignsList[0].Id,
                                AssignedToTeamMemberId = teamMembers[2].Id, // Campaign Manager
                                DueDate = DateTime.UtcNow.AddDays(1),
                                Priority = TaskPriority.Medium,
                                Status = TaskStatus.Pending,
                                Notes = "Generate weekly reports",
                                CreatedById = adminUserId,
                                CreatedAt = DateTime.UtcNow.AddDays(-20)
                            }
                        };

                        context.Tasks.AddRange(tasks);
                        await context.SaveChangesAsync();
                        Console.WriteLine("Tasks seeded successfully");
                    }
                }
            }
        }
    }
}
