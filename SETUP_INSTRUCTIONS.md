# Setup Instructions for New Team Members

When you clone the repository, follow these steps to set up your local database:

## Prerequisites
- .NET SDK installed
- SQL Server (LocalDB or full SQL Server instance)
- Connection string configured in `appsettings.Development.json`

## Steps to Set Up Database

### 1. Navigate to the Project Directory
```bash
cd WP25G20/WP25G20
```

### 2. Apply Database Migrations
This will create the database schema with all tables:
```bash
dotnet ef database update
```

This command will:
- Create the database if it doesn't exist
- Apply all migrations in order:
  - InitialCreate
  - InitialMarketingAgency
  - SyncModelChanges
  - AddTeamMemberTable

### 3. Run the Application
```bash
dotnet run
```

**Important:** The seed data runs automatically when you start the app in **Development mode**. This will:
- Create roles: Admin, Client, User
- Create test users:
  - **Admin**: `admin@marketingagency.com` / `Admin123!`
  - **User**: `user@marketingagency.com` / `User123!`
  - **Client**: `client@marketingagency.com` / `Client123!`
- Create 3 team members:
  - Alex Martinez (Digital Marketing Specialist)
  - Sarah Chen (Graphic Designer)
  - Michael Thompson (Campaign Manager)
- Create sample data:
  - 4 Services (Digital Marketing, Graphic Design, Campaign Management, Analytics)
  - 4 Clients (TechStart Solutions, GreenLife Organics, Fashion Forward Inc, FitZone Gym)
  - 4 Campaigns (linked to clients and services)
  - 6 Tasks (assigned to team members)

### 4. Verify Setup
- Check the console output for seed data confirmation messages
- Try logging in with the admin credentials
- Check the database to verify all tables and data exist

## Troubleshooting

### If migrations fail:
1. Make sure your connection string in `appsettings.Development.json` is correct
2. Ensure SQL Server is running
3. Try: `dotnet ef database update --verbose` for more details

### If seed data doesn't run:
- Ensure you're running in Development mode (check `ASPNETCORE_ENVIRONMENT`)
- Check the console for any error messages
- Seed data only runs in Development mode for security

### Reset Database (if needed):
```bash
# Drop the database
dotnet ef database drop

# Recreate it
dotnet ef database update
```

## Notes
- Seed data is **idempotent** - it won't create duplicates if run multiple times
- Only runs in Development environment
- Production deployments should use different seeding strategies
