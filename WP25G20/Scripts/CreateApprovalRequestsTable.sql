-- Manual Migration Script: Create ApprovalRequests and ApprovalComments Tables
-- This script creates the missing ApprovalRequests and ApprovalComments tables
-- that should have been created via EF Core migrations but weren't.

USE WP25G20;
GO

-- Create ApprovalRequests table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ApprovalRequests]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ApprovalRequests] (
        [Id] int NOT NULL IDENTITY,
        [CampaignId] int NOT NULL,
        [TaskId] int NULL,
        [ItemName] nvarchar(200) NOT NULL,
        [Description] nvarchar(2000) NULL,
        [ItemType] nvarchar(50) NULL,
        [Status] int NOT NULL DEFAULT 0,
        [Explanation] nvarchar(max) NULL,
        [CtaDescription] nvarchar(500) NULL,
        [PlatformSpecs] nvarchar(500) NULL,
        [PreviewUrl] nvarchar(1000) NULL,
        [PreviewType] nvarchar(50) NULL,
        [DueDate] datetime2 NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] datetime2 NULL,
        [ApprovedAt] datetime2 NULL,
        [RejectedAt] datetime2 NULL,
        [CreatedById] nvarchar(450) NULL,
        [ApprovedById] nvarchar(450) NULL,
        CONSTRAINT [PK_ApprovalRequests] PRIMARY KEY ([Id])
    );
    
    -- Create foreign key constraints
    ALTER TABLE [dbo].[ApprovalRequests]
        ADD CONSTRAINT [FK_ApprovalRequests_Campaigns_CampaignId]
        FOREIGN KEY ([CampaignId]) REFERENCES [dbo].[Campaigns] ([Id])
        ON DELETE NO ACTION;
    
    ALTER TABLE [dbo].[ApprovalRequests]
        ADD CONSTRAINT [FK_ApprovalRequests_Tasks_TaskId]
        FOREIGN KEY ([TaskId]) REFERENCES [dbo].[Tasks] ([Id])
        ON DELETE SET NULL;
    
    ALTER TABLE [dbo].[ApprovalRequests]
        ADD CONSTRAINT [FK_ApprovalRequests_AspNetUsers_CreatedById]
        FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AspNetUsers] ([Id])
        ON DELETE SET NULL;
    
    ALTER TABLE [dbo].[ApprovalRequests]
        ADD CONSTRAINT [FK_ApprovalRequests_AspNetUsers_ApprovedById]
        FOREIGN KEY ([ApprovedById]) REFERENCES [dbo].[AspNetUsers] ([Id])
        ON DELETE NO ACTION;
    
    -- Create indexes
    CREATE INDEX [IX_ApprovalRequests_CampaignId_Status] ON [dbo].[ApprovalRequests] ([CampaignId], [Status]);
    CREATE INDEX [IX_ApprovalRequests_CreatedAt] ON [dbo].[ApprovalRequests] ([CreatedAt]);
    CREATE INDEX [IX_ApprovalRequests_CampaignId] ON [dbo].[ApprovalRequests] ([CampaignId]);
    CREATE INDEX [IX_ApprovalRequests_TaskId] ON [dbo].[ApprovalRequests] ([TaskId]);
    CREATE INDEX [IX_ApprovalRequests_CreatedById] ON [dbo].[ApprovalRequests] ([CreatedById]);
    CREATE INDEX [IX_ApprovalRequests_ApprovedById] ON [dbo].[ApprovalRequests] ([ApprovedById]);
    
    PRINT 'ApprovalRequests table created successfully.';
END
ELSE
BEGIN
    PRINT 'ApprovalRequests table already exists.';
END
GO

-- Create ApprovalComments table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ApprovalComments]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ApprovalComments] (
        [Id] int NOT NULL IDENTITY,
        [ApprovalRequestId] int NOT NULL,
        [Comment] nvarchar(2000) NOT NULL,
        [Action] nvarchar(50) NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [CreatedById] nvarchar(450) NULL,
        CONSTRAINT [PK_ApprovalComments] PRIMARY KEY ([Id])
    );
    
    -- Create foreign key constraints
    ALTER TABLE [dbo].[ApprovalComments]
        ADD CONSTRAINT [FK_ApprovalComments_ApprovalRequests_ApprovalRequestId]
        FOREIGN KEY ([ApprovalRequestId]) REFERENCES [dbo].[ApprovalRequests] ([Id])
        ON DELETE CASCADE;
    
    ALTER TABLE [dbo].[ApprovalComments]
        ADD CONSTRAINT [FK_ApprovalComments_AspNetUsers_CreatedById]
        FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AspNetUsers] ([Id])
        ON DELETE SET NULL;
    
    -- Create indexes
    CREATE INDEX [IX_ApprovalComments_ApprovalRequestId] ON [dbo].[ApprovalComments] ([ApprovalRequestId]);
    CREATE INDEX [IX_ApprovalComments_CreatedAt] ON [dbo].[ApprovalComments] ([CreatedAt]);
    CREATE INDEX [IX_ApprovalComments_CreatedById] ON [dbo].[ApprovalComments] ([CreatedById]);
    
    PRINT 'ApprovalComments table created successfully.';
END
ELSE
BEGIN
    PRINT 'ApprovalComments table already exists.';
END
GO

PRINT 'Migration completed successfully!';
GO
