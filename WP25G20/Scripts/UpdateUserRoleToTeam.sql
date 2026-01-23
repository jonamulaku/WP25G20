-- Script to update existing users with 'User' role to 'Team' role
-- Run this script in your SQL Server database to migrate existing users

-- First, ensure the 'Team' role exists
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Name = 'Team')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (NEWID(), 'Team', 'TEAM', NEWID())
    PRINT 'Team role created'
END
ELSE
BEGIN
    PRINT 'Team role already exists'
END

-- Get the role IDs
DECLARE @UserRoleId NVARCHAR(450)
DECLARE @TeamRoleId NVARCHAR(450)

SELECT @UserRoleId = Id FROM AspNetRoles WHERE Name = 'User'
SELECT @TeamRoleId = Id FROM AspNetRoles WHERE Name = 'Team'

-- Update all users with 'User' role to 'Team' role
IF @UserRoleId IS NOT NULL AND @TeamRoleId IS NOT NULL
BEGIN
    -- Remove 'User' role and add 'Team' role for users who have 'User' role
    UPDATE AspNetUserRoles
    SET RoleId = @TeamRoleId
    WHERE RoleId = @UserRoleId
    
    PRINT 'Updated ' + CAST(@@ROWCOUNT AS NVARCHAR(10)) + ' users from User role to Team role'
END
ELSE
BEGIN
    PRINT 'Could not find User or Team role. Please check your roles table.'
END

-- Optional: Remove the 'User' role if you no longer need it
-- Uncomment the following lines if you want to delete the 'User' role entirely
/*
IF @UserRoleId IS NOT NULL
BEGIN
    DELETE FROM AspNetRoles WHERE Id = @UserRoleId
    PRINT 'User role removed'
END
*/
