using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Text;
using WP25G20.Authorization;
using WP25G20.Data;
using WP25G20.Middleware;
using WP25G20.Models;
using WP25G20.Repositories;
using WP25G20.Services;

var builder = WebApplication.CreateBuilder(args);

// =========================================
// DATABASE
// =========================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================
// IDENTITY (Login/Register)
// =========================================
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// =========================================
// JWT AUTHENTICATION
// =========================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
var issuer = jwtSettings["Issuer"] ?? "WP25G20";
var audience = jwtSettings["Audience"] ?? "WP25G20";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// =========================================
// REPOSITORIES (Dependency Injection)
// =========================================
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IActivityLogRepository, ActivityLogRepository>();
builder.Services.AddScoped<ITeamMemberRepository, TeamMemberRepository>();

// =========================================
// SERVICES (Dependency Injection)
// =========================================
builder.Services.AddScoped<IClientService, ClientService>();
builder.Services.AddScoped<ICampaignService, CampaignService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IServiceService, ServiceService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITeamMemberService, TeamMemberService>();
builder.Services.AddScoped<IAuthorizationHelper, AuthorizationHelper>();

// =========================================
// HTTP CONTEXT ACCESSOR
// =========================================
builder.Services.AddHttpContextAccessor();

// =========================================
// SESSION MANAGEMENT
// =========================================
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

// =========================================
// RESPONSE CACHING
// =========================================
builder.Services.AddResponseCaching();
builder.Services.AddMemoryCache();

// =========================================
// MVC + RAZOR PAGES + API
// =========================================
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // Keep PascalCase
    });
builder.Services.AddRazorPages();

// =========================================
// AUTHORIZATION POLICIES
// =========================================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ResourceOwner", policy =>
        policy.Requirements.Add(new ResourceOwnerRequirement()));
});

builder.Services.AddScoped<IAuthorizationHandler, ResourceOwnerAuthorizationHandler>();

// =========================================
// CORS (if needed for frontend)
// =========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// =========================================
// SWAGGER / OPENAPI
// =========================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Basic Swagger document info
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Marketing Agency API",
        Version = "v1",
        Description = "API for Marketing Agency Management System"
    });

    // Add JWT Bearer security definition - this creates the "Authorize" button in Swagger UI
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter your token (without 'Bearer' prefix).",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    // Add security requirement globally - this makes the Authorize button appear
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// =========================================
// CREATE DATABASE AND RUN MIGRATIONS
// =========================================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    
    try
    {
        logger.LogInformation("Setting up database...");
        
        // Apply migrations (this will create the database if it doesn't exist)
        // MigrateAsync() will handle database creation automatically
        logger.LogInformation("Applying migrations (database will be created if it doesn't exist)...");
        await dbContext.Database.MigrateAsync();
        logger.LogInformation("✅ Database setup successful");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Error setting up database");
        logger.LogError($"Connection string being used: {connectionString ?? "NULL - Connection string not found!"}");
        logger.LogError($"Full exception: {ex}");
        logger.LogError("Please ensure:");
        logger.LogError("  1. Docker container is running: docker-compose up -d");
        logger.LogError("  2. Connection string in appsettings.Development.json is correct");
        logger.LogError("  3. Check the actual exception details above for more information");
        throw; // Stop application if database setup fails
    }
}

// =========================================
// PIPELINE
// =========================================

// Error handling middleware (must be first)
app.UseMiddleware<ErrorHandlingMiddleware>();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Enable Swagger UI in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Marketing Agency API v1");
        c.RoutePrefix = "swagger"; // Swagger UI will be available at /swagger
        c.DocumentTitle = "Marketing Agency API Documentation";
        c.DefaultModelsExpandDepth(-1); // Hide schema models by default
        c.DisplayRequestDuration();
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Session must be before Authentication
app.UseSession();

// CORS must be before Authentication
app.UseCors("AllowAll");

// Response caching
app.UseResponseCaching();

app.UseAuthentication();
app.UseAuthorization();

// =========================================
// ROUTES
// =========================================
// API Routes
app.MapControllers();

// MVC Routes with Areas
app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Identity Routes (Register/Login)
app.MapRazorPages();

// =========================================
// SEED ROLES AND USERS (Development only)
// =========================================
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        try
        {
            await SeedData.SeedRolesAndAdminAsync(scope.ServiceProvider);
            await SeedData.SeedTeamMembersAsync(scope.ServiceProvider);
            // SeedSampleDataAsync removed - all business data (campaigns, services, tasks, clients)
            // now comes from the shared database, ensuring all teammates see the same real data
            logger.LogInformation("✅ Seed data completed successfully (users and team members only)");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "⚠️  Error seeding data, but application will continue");
        }
    }
}

app.Run();


