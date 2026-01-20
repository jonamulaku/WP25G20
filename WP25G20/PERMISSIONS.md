# Permissions System Documentation

## Overview
The application implements a comprehensive role-based access control (RBAC) system with two roles: **Admin** and **User**.

## Roles

### Admin Role
- **Full Access**: Admins can view, create, update, and delete all resources
- **User Management**: Admins can assign users to campaigns and set their permissions
- **No Restrictions**: Admins bypass all permission checks

### User Role
- **Limited Access**: Users can only view and update resources they own or have been granted access to
- **Own Resources**: Users can view and update resources they created
- **Assigned Resources**: Users can view resources they've been assigned to (via CampaignUser)
- **Editor Role**: Users with Editor role on a campaign can update that campaign and its tasks

## Permission Rules by Entity

### Clients
**View Permissions:**
- ✅ Admin: Can view all clients
- ✅ User: Can only view clients they created

**Update Permissions:**
- ✅ Admin: Can update all clients
- ✅ User: Can only update clients they created

**Delete Permissions:**
- ✅ Admin: Can delete clients
- ❌ User: Cannot delete clients (only admins)

**Create Permissions:**
- ✅ Admin: Can create clients
- ❌ User: Cannot create clients (only admins)

### Campaigns
**View Permissions:**
- ✅ Admin: Can view all campaigns
- ✅ User: Can view campaigns they:
  - Created
  - Are assigned to (via CampaignUser with Viewer or Editor role)

**Update Permissions:**
- ✅ Admin: Can update all campaigns
- ✅ User: Can update campaigns they:
  - Created
  - Have Editor role on (via CampaignUser)

**Delete Permissions:**
- ✅ Admin: Can delete campaigns
- ❌ User: Cannot delete campaigns (only admins)

**Create Permissions:**
- ✅ Admin: Can create campaigns
- ❌ User: Cannot create campaigns (only admins)

**User Assignment:**
- ✅ Admin: Can assign users to campaigns and set their roles (Viewer/Editor)
- ✅ Admin: Can modify which users can view or update a campaign

### Tasks
**View Permissions:**
- ✅ Admin: Can view all tasks
- ✅ User: Can view tasks they:
  - Created
  - Are assigned to (AssignedToId)
  - Belong to campaigns they created
  - Belong to campaigns they're assigned to (via CampaignUser)

**Update Permissions:**
- ✅ Admin: Can update all tasks
- ✅ User: Can update tasks they:
  - Created
  - Are assigned to (AssignedToId)
  - Belong to campaigns they created
  - Belong to campaigns where they have Editor role

**Delete Permissions:**
- ✅ Admin: Can delete tasks
- ❌ User: Cannot delete tasks (only admins)

**Create Permissions:**
- ✅ Admin: Can create tasks
- ❌ User: Cannot create tasks (only admins)

### Services
**View Permissions:**
- ✅ Admin: Can view all services
- ✅ User: Can view all active services (public access)

**Update Permissions:**
- ✅ Admin: Can update services
- ❌ User: Cannot update services (only admins)

**Delete Permissions:**
- ✅ Admin: Can delete services
- ❌ User: Cannot delete services (only admins)

**Create Permissions:**
- ✅ Admin: Can create services
- ❌ User: Cannot create services (only admins)

## Implementation Details

### Authorization Helper
The `AuthorizationHelper` service provides methods to check permissions:
- `CanViewClientAsync()` - Checks if user can view a client
- `CanUpdateClientAsync()` - Checks if user can update a client
- `CanViewCampaignAsync()` - Checks if user can view a campaign
- `CanUpdateCampaignAsync()` - Checks if user can update a campaign
- `CanViewTaskAsync()` - Checks if user can view a task
- `CanUpdateTaskAsync()` - Checks if user can update a task

### Service Layer
All services check permissions before:
- Returning data (GetById)
- Updating resources (Update)
- Deleting resources (Delete)
- Filtering lists (GetAll)

### API Controllers
API controllers:
- Extract user ID from JWT token
- Check if user is admin
- Pass user context to services
- Services enforce permissions automatically

### Error Handling
When a user tries to access a resource without permission:
- `UnauthorizedAccessException` is thrown
- Error handling middleware returns 401/403 status
- Appropriate error message is returned

## Permission Flow

1. **Request arrives** → Controller extracts user ID and role
2. **Service method called** → User context passed to service
3. **Permission check** → AuthorizationHelper validates access
4. **Action allowed/denied** → Based on role and ownership
5. **Activity logged** → All actions logged with user ID

## Examples

### Example 1: User viewing their own client
- User ID: "user-123"
- Client CreatedById: "user-123"
- Result: ✅ Allowed (user owns the client)

### Example 2: User viewing another user's client
- User ID: "user-123"
- Client CreatedById: "user-456"
- Result: ❌ Denied (UnauthorizedAccessException)

### Example 3: User viewing assigned campaign
- User ID: "user-123"
- Campaign has CampaignUser with UserId: "user-123", Role: Viewer
- Result: ✅ Allowed (user is assigned to campaign)

### Example 4: User updating campaign with Editor role
- User ID: "user-123"
- Campaign has CampaignUser with UserId: "user-123", Role: Editor
- Result: ✅ Allowed (user has Editor role)

### Example 5: Admin accessing any resource
- User Role: Admin
- Any resource
- Result: ✅ Allowed (admin bypasses all checks)
