# ApprovalRequests Table Migration

This directory contains a manual migration script to create the `ApprovalRequests` and `ApprovalComments` tables that were missing from the EF Core migrations.

## Problem

The `ApprovalRequests` table was not created during the initial migration, causing the error:
```
Invalid object name 'ApprovalRequests'
```

This prevents the Approvals page from working in the client dashboard.

## Solution

Run the manual migration script to create the missing tables.

## Quick Start (One-Liner)

If you just want to run it quickly, use this command from the `WP25G20/Scripts` directory:

```powershell
docker cp CreateApprovalRequestsTable.sql marketing-agency-db:/tmp/migration.sql && docker exec marketing-agency-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrongPassword123" -d WP25G20 -C -i /tmp/migration.sql && docker exec marketing-agency-db rm /tmp/migration.sql
```

## How to Run

### Option 1: Using PowerShell Script (Recommended)

1. Open PowerShell in the `WP25G20/Scripts` directory
2. Run:
   ```powershell
   .\RunApprovalMigration.ps1
   ```

### Option 2: Using Docker Exec

1. Make sure your Docker container is running:
   ```powershell
   docker ps
   ```

2. Execute the SQL script:
   ```powershell
   docker exec -i marketing-agency-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrongPassword123" -d WP25G20 -C -i CreateApprovalRequestsTable.sql
   ```

   Or if the script file is not in the container, pipe it:
   ```powershell
   Get-Content CreateApprovalRequestsTable.sql | docker exec -i marketing-agency-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrongPassword123" -d WP25G20 -C
   ```

### Option 3: Using SQL Server Management Studio (SSMS)

1. Connect to your SQL Server instance:
   - Server: `localhost,1433` (or your Docker host IP)
   - Authentication: SQL Server Authentication
   - Login: `sa`
   - Password: `YourStrongPassword123`

2. Open the `CreateApprovalRequestsTable.sql` file
3. Execute it against the `WP25G20` database

### Option 4: Using Azure Data Studio or VS Code with SQL Extension

1. Connect to your SQL Server instance
2. Open the `CreateApprovalRequestsTable.sql` file
3. Execute it

## Verification

After running the migration, verify the tables were created:

```sql
USE WP25G20;
GO

-- Check if tables exist
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME IN ('ApprovalRequests', 'ApprovalComments');

-- Check table structure
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'ApprovalRequests'
ORDER BY ORDINAL_POSITION;
```

## What This Script Creates

1. **ApprovalRequests Table** with columns:
   - Id (Primary Key, Identity)
   - CampaignId (Required, Foreign Key to Campaigns)
   - TaskId (Optional, Foreign Key to Tasks)
   - ItemName, Description, ItemType
   - Status (enum: Pending, Approved, Rejected, ChangesRequested)
   - Explanation, CtaDescription, PlatformSpecs
   - PreviewUrl, PreviewType
   - DueDate, CreatedAt, UpdatedAt, ApprovedAt, RejectedAt
   - CreatedById, ApprovedById (Foreign Keys to AspNetUsers)

2. **ApprovalComments Table** with columns:
   - Id (Primary Key, Identity)
   - ApprovalRequestId (Required, Foreign Key to ApprovalRequests)
   - Comment, Action
   - CreatedAt, CreatedById (Foreign Key to AspNetUsers)

3. **Foreign Key Constraints**:
   - ApprovalRequests → Campaigns (Restrict)
   - ApprovalRequests → Tasks (Set Null)
   - ApprovalRequests → AspNetUsers (Set Null for both CreatedBy and ApprovedBy)
   - ApprovalComments → ApprovalRequests (Cascade)
   - ApprovalComments → AspNetUsers (Set Null)

4. **Indexes** for performance:
   - Composite index on CampaignId + Status
   - Index on CreatedAt
   - Indexes on all foreign key columns

## Notes

- The script is idempotent - it checks if tables exist before creating them
- Safe to run multiple times
- Does not drop or modify existing data
- Matches the EF Core model configuration exactly

## After Migration

Once the migration is complete:
1. Restart your application (if it's running)
2. The Approvals page in the client dashboard should now work
3. You should be able to create and view approval requests
