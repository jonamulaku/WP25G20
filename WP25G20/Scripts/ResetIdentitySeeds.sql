-- Script to check and reset identity seeds for development
-- WARNING: Only use this in development! This will reset identity counters.

USE WP25G20;
GO

-- Check current identity values
SELECT 
    OBJECT_NAME(OBJECT_ID) AS TableName,
    IDENT_CURRENT(OBJECT_NAME(OBJECT_ID)) AS CurrentIdentityValue,
    (SELECT COUNT(*) FROM sys.identity_columns WHERE object_id = OBJECT_ID(OBJECT_NAME(OBJECT_ID))) AS HasIdentity
FROM sys.tables
WHERE OBJECTPROPERTY(OBJECT_ID, 'TableHasIdentity') = 1
ORDER BY TableName;
GO

-- Reset identity seeds (ONLY FOR DEVELOPMENT!)
-- Uncomment the lines below to reset specific tables

-- Reset Campaigns identity to start from 1
-- DBCC CHECKIDENT ('Campaigns', RESEED, 0);
-- GO

-- Reset Clients identity to start from 1
-- DBCC CHECKIDENT ('Clients', RESEED, 0);
-- GO

-- Reset Services identity to start from 1
-- DBCC CHECKIDENT ('Services', RESEED, 0);
-- GO

-- Reset Tasks identity to start from 1
-- DBCC CHECKIDENT ('Tasks', RESEED, 0);
-- GO

-- Reset Invoices identity to start from 1
-- DBCC CHECKIDENT ('Invoices', RESEED, 0);
-- GO

-- Reset all identity columns at once (if tables are empty)
-- EXEC sp_MSforeachtable @command1 = 'IF OBJECTPROPERTY(object_id(''?''), ''TableHasIdentity'') = 1 DBCC CHECKIDENT(''?'', RESEED, 0)';
-- GO
