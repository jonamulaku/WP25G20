-- Quick script to check current identity seed values
USE WP25G20;
GO

SELECT 
    t.name AS TableName,
    IDENT_CURRENT(t.name) AS CurrentIdentityValue,
    (SELECT COUNT(*) FROM sys.identity_columns WHERE object_id = t.object_id) AS HasIdentityColumn
FROM sys.tables t
WHERE OBJECTPROPERTY(t.object_id, 'TableHasIdentity') = 1
ORDER BY t.name;
GO

-- Check specific table
-- SELECT IDENT_CURRENT('Campaigns') AS CurrentCampaignId;
-- SELECT IDENT_CURRENT('Clients') AS CurrentClientId;
-- SELECT IDENT_CURRENT('Services') AS CurrentServiceId;
-- SELECT IDENT_CURRENT('Tasks') AS CurrentTaskId;
