-- Script to create ApplicationUser accounts for existing clients
-- This allows clients to log in with their email addresses
-- Default password: Client123! (clients should change this on first login)

-- First, ensure the 'Client' role exists
IF NOT EXISTS (SELECT 1 FROM AspNetRoles WHERE Name = 'Client')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp)
    VALUES (NEWID(), 'Client', 'CLIENT', NEWID())
    PRINT 'Client role created'
END

-- Get the Client role ID
DECLARE @ClientRoleId NVARCHAR(450)
SELECT @ClientRoleId = Id FROM AspNetRoles WHERE Name = 'Client'

-- Create users for clients that don't have a user account yet
DECLARE @ClientEmail NVARCHAR(100)
DECLARE @ClientContactPerson NVARCHAR(100)
DECLARE @ClientId INT
DECLARE @UserId NVARCHAR(450)
DECLARE @PasswordHash NVARCHAR(MAX)
DECLARE @SecurityStamp NVARCHAR(MAX)
DECLARE @ConcurrencyStamp NVARCHAR(MAX)

-- Default password hash for "Client123!" (this is a sample hash - you should use proper password hashing)
-- Note: This is a placeholder. In production, use proper password hashing via UserManager
SET @PasswordHash = 'AQAAAAIAAYagAAAAE...' -- This should be generated properly via UserManager

DECLARE client_cursor CURSOR FOR
SELECT Id, Email, ContactPerson
FROM Clients
WHERE IsActive = 1
  AND Email NOT IN (SELECT Email FROM AspNetUsers)

OPEN client_cursor
FETCH NEXT FROM client_cursor INTO @ClientId, @ClientEmail, @ClientContactPerson

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Check if user already exists
    IF NOT EXISTS (SELECT 1 FROM AspNetUsers WHERE Email = @ClientEmail)
    BEGIN
        SET @UserId = NEWID()
        SET @SecurityStamp = NEWID()
        SET @ConcurrencyStamp = NEWID()
        
        -- Insert user (Note: Password hash should be generated via UserManager in C# code)
        -- This is a placeholder - the actual implementation should be done via C# migration script
        PRINT 'Would create user for client: ' + @ClientEmail
        -- Actual INSERT would go here, but password hashing must be done via UserManager
    END
    
    FETCH NEXT FROM client_cursor INTO @ClientId, @ClientEmail, @ClientContactPerson
END

CLOSE client_cursor
DEALLOCATE client_cursor

PRINT 'Migration script completed. Note: User creation should be done via C# code using UserManager for proper password hashing.'
