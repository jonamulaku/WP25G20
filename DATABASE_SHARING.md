# Sharing Database with Team Members

## Option 1: SQL Server Backup File (Recommended - Simplest)

### On Your Machine (Export):
1. Open **SQL Server Management Studio (SSMS)**
2. Right-click on your database → **Tasks** → **Back Up...**
3. Choose backup destination (e.g., `C:\Backups\MarketingAgency.bak`)
4. Click **OK** to create backup
5. Share the `.bak` file with your teammate (via Git LFS, OneDrive, etc.)

### On Teammate's Machine (Import):
1. Open **SQL Server Management Studio (SSMS)**
2. Right-click on **Databases** → **Restore Database...**
3. Select **Device** → Browse and select the `.bak` file
4. Click **OK** to restore
5. Update connection string in `appsettings.Development.json` if needed

**Pros:** Complete database copy, includes all data, very fast
**Cons:** Large file size, needs to be re-shared when you add new data

---

## Option 2: Generate SQL Script with Data

### On Your Machine:
1. Open **SQL Server Management Studio (SSMS)**
2. Right-click on your database → **Tasks** → **Generate Scripts...**
3. Choose **Script entire database and all database objects**
4. Click **Advanced** → Set **Types of data to script** to **Schema and data**
5. Save script (e.g., `database-with-data.sql`)
6. Share the SQL file with your teammate

### On Teammate's Machine:
1. Create empty database: `CREATE DATABASE MarketingAgency;`
2. Open the SQL script file in SSMS
3. Execute the script (F5)
4. Done!

**Pros:** Text file, can be version controlled (if small), readable
**Cons:** Can be very large, slower for big databases

---

## Option 3: Use Seed Data (Current Approach)

This is what we have now - automatic seeding when app runs.

**Pros:** Automatic, always up-to-date, no manual steps
**Cons:** Need to write seed data code, only creates sample data

---

## Recommendation

For **development**, use **Option 1 (Backup/Restore)**:
- Fastest setup
- Complete data copy
- One-time setup per teammate

For **production-like data**, use **Option 3 (Seed Data)**:
- Automated
- Consistent across all developers
- Can be customized per environment
