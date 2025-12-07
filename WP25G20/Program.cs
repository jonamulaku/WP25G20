using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WP25G20.Data;

var builder = WebApplication.CreateBuilder(args);

// =========================================
// DATABASE
// =========================================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================
// IDENTITY (Login/Register)
// =========================================
builder.Services.AddDefaultIdentity<IdentityUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>();

// =========================================
// MVC + RAZOR PAGES
// =========================================
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();   // ➜ SHUMË E RËNDËSISHME!!

var app = builder.Build();

// =========================================
// PIPELINE
// =========================================
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// ROUTES
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();  // ➜ Identity Routes (Register/Login) punon

app.Run();


