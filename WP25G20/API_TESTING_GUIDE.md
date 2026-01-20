# API Testing Guide

## Base URL

```
http://localhost:5000/api
```

or

```
https://localhost:5001/api
```

## Step 1: Register a New User

**Endpoint:** `POST /api/auth/register`

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "Admin123!",
  "confirmPassword": "Admin123!",
  "firstName": "Admin",
  "lastName": "User"
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "confirmPassword": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "expiresAt": "2024-01-13T11:34:34Z",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": ["User"]
  }
}
```

**Save the `token` value for subsequent requests!**

---

## Step 2: Login (Alternative to Register)

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Example using curl:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

---

## Step 3: Assign Admin Role (Important!)

After registering, you need to manually assign the Admin role to your user. You can do this by:

1. **Using SQL Server Management Studio:**

   ```sql
   -- Find your user ID
   SELECT Id, Email FROM AspNetUsers WHERE Email = 'admin@example.com';

   -- Find Admin role ID
   SELECT Id, Name FROM AspNetRoles WHERE Name = 'Admin';

   -- Assign role (replace UserId and RoleId with actual values)
   INSERT INTO AspNetUserRoles (UserId, RoleId)
   VALUES ('YOUR_USER_ID', 'ADMIN_ROLE_ID');
   ```

2. **Or create a seed data script** (recommended for development)

---

## Step 4: Test Protected Endpoints

All endpoints below require authentication. Include the JWT token in the Authorization header.

### Get All Clients

**Endpoint:** `GET /api/clients`

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example using curl:**

```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**With Pagination & Filtering:**

```bash
curl -X GET "http://localhost:5000/api/clients?pageNumber=1&pageSize=10&searchTerm=test&sortBy=companyName&sortDescending=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Client by ID

**Endpoint:** `GET /api/clients/{id}`

**Example:**

```bash
curl -X GET http://localhost:5000/api/clients/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create Client (Admin Only)

**Endpoint:** `POST /api/clients`

**Request Body:**

```json
{
  "companyName": "Acme Corporation",
  "contactPerson": "John Doe",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "notes": "Important client"
}
```

**Example:**

```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corporation",
    "contactPerson": "John Doe",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "notes": "Important client"
  }'
```

---

### Update Client (Admin Only)

**Endpoint:** `PUT /api/clients/{id}`

**Request Body:**

```json
{
  "companyName": "Acme Corporation Updated",
  "contactPerson": "Jane Doe",
  "email": "contact@acme.com",
  "phone": "+1234567890",
  "address": "456 New St",
  "notes": "Updated notes",
  "isActive": true
}
```

**Example:**

```bash
curl -X PUT http://localhost:5000/api/clients/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Acme Corporation Updated",
    "email": "contact@acme.com",
    "isActive": true
  }'
```

---

### Delete Client (Admin Only)

**Endpoint:** `DELETE /api/clients/{id}`

**Example:**

```bash
curl -X DELETE http://localhost:5000/api/clients/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Campaigns API Examples

### Get All Campaigns

**Endpoint:** `GET /api/campaigns`

**Example:**

```bash
curl -X GET http://localhost:5000/api/campaigns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**With Filters:**

```bash
curl -X GET "http://localhost:5000/api/campaigns?pageNumber=1&pageSize=10&filters[Status]=Active&sortBy=startDate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Campaign by ID

**Endpoint:** `GET /api/campaigns/{id}`

**Example:**

```bash
curl -X GET http://localhost:5000/api/campaigns/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create Campaign (Admin Only)

**Endpoint:** `POST /api/campaigns`

**Request Body:**

```json
{
  "name": "Summer Marketing Campaign 2025",
  "description": "Social media marketing campaign for summer products",
  "clientId": 1,
  "serviceId": 1,
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z",
  "budget": 50000.0,
  "notes": "Focus on Instagram and Facebook",
  "assignedUserIds": ["user-id-1", "user-id-2"]
}
```

**Example:**

```bash
curl -X POST http://localhost:5000/api/campaigns \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Marketing Campaign 2025",
    "description": "Social media marketing campaign",
    "clientId": 1,
    "serviceId": 1,
    "startDate": "2025-06-01T00:00:00Z",
    "endDate": "2025-08-31T23:59:59Z",
    "budget": 50000.00,
    "notes": "Focus on Instagram and Facebook"
  }'
```

**Important Notes:**

- You need to create a **Client** and **Service** first before creating a Campaign
- `assignedUserIds` is **optional** - you can omit this field or pass an empty array
- If you provide `assignedUserIds`, the user IDs **must exist** in the system (valid user IDs from AspNetUsers table)
- To get valid user IDs, first create users via registration or check existing users
- **If you don't have valid user IDs, simply omit the `assignedUserIds` field:**

```json
{
  "name": "Summer Marketing Campaign 2025",
  "description": "Social media marketing campaign",
  "clientId": 1,
  "serviceId": 1,
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z",
  "budget": 50000.0,
  "notes": "Focus on Instagram and Facebook"
}
```

---

### Update Campaign (Admin Only)

**Endpoint:** `PUT /api/campaigns/{id}`

**Request Body:**

```json
{
  "name": "Summer Marketing Campaign 2025 - Updated",
  "description": "Updated campaign description",
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-09-30T23:59:59Z",
  "budget": 75000.0,
  "status": "Active",
  "notes": "Extended until September",
  "assignedUserIds": ["user-id-1", "user-id-2"]
}
```

**Note:** `assignedUserIds` is optional. If provided, it will replace all existing user assignments for the campaign.

**Example:**

```bash
curl -X PUT http://localhost:5000/api/campaigns/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Marketing Campaign 2025 - Updated",
    "status": "Active",
    "budget": 75000.00
  }'
```

**Valid Status Values:** `Pending`, `Active`, `Paused`, `Completed`, `Cancelled`

---

### Delete Campaign (Admin Only)

**Endpoint:** `DELETE /api/campaigns/{id}`

**Example:**

```bash
curl -X DELETE http://localhost:5000/api/campaigns/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Tasks API Examples

### Get All Tasks

**Endpoint:** `GET /api/tasks`

**Example:**

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**With Filters:**

```bash
# Get tasks by status
curl -X GET "http://localhost:5000/api/tasks?filters[Status]=Pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get tasks for a specific campaign
curl -X GET "http://localhost:5000/api/tasks?filters[CampaignId]=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get tasks assigned to a specific user (requires user ID)
curl -X GET "http://localhost:5000/api/tasks?filters[AssignedToId]=user-id-here" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get My Tasks (Current User)

**Endpoint:** `GET /api/tasks/me`

**Description:** Get all tasks assigned to the currently logged-in user. This endpoint automatically uses your user ID from the JWT token, so you don't need to specify it.

**Example:**

```bash
curl -X GET http://localhost:5000/api/tasks/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**With Filters:**

```bash
# Get my pending tasks
curl -X GET "http://localhost:5000/api/tasks/me?filters[Status]=Pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get my tasks for a specific campaign
curl -X GET "http://localhost:5000/api/tasks/me?filters[CampaignId]=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get my tasks sorted by due date
curl -X GET "http://localhost:5000/api/tasks/me?sortBy=dueDate&sortDescending=false" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get my tasks with pagination
curl -X GET "http://localhost:5000/api/tasks/me?pageNumber=1&pageSize=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Note:** This endpoint automatically filters tasks by your user ID from the JWT token. Any authenticated user can access this endpoint to see their own assigned tasks.

---

### Get Task by ID

**Endpoint:** `GET /api/tasks/{id}`

**Example:**

```bash
curl -X GET http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create Task (Admin Only)

**Endpoint:** `POST /api/tasks`

**Request Body:**

```json
{
  "title": "Design Instagram Post",
  "description": "Create 5 Instagram posts for the summer campaign",
  "campaignId": 1,
  "assignedToId": "user-id-here",
  "dueDate": "2025-06-15T23:59:59Z",
  "priority": "High",
  "notes": "Use brand colors and summer theme"
}
```

**Example:**

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Instagram Post",
    "description": "Create 5 Instagram posts",
    "campaignId": 1,
    "dueDate": "2025-06-15T23:59:59Z",
    "priority": "High"
  }'
```

**Valid Priority Values:** `Low`, `Medium`, `High`, `Urgent`

**Note:** Campaign must exist before creating a task.

---

### Update Task (Users can update their assigned tasks)

**Endpoint:** `PUT /api/tasks/{id}`

**Request Body:**

```json
{
  "title": "Design Instagram Post - Updated",
  "description": "Updated description",
  "assignedToId": "user-id-here",
  "dueDate": "2025-06-20T23:59:59Z",
  "priority": "Urgent",
  "status": "InProgress",
  "notes": "Need to finish by end of week"
}
```

**Example:**

```bash
# Mark task as in progress
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Instagram Post",
    "status": "InProgress",
    "priority": "High"
  }'

# Mark task as completed
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Instagram Post",
    "status": "Completed"
  }'
```

**Valid Status Values:** `Pending`, `InProgress`, `Completed`, `Cancelled`, `OnHold`

---

### Delete Task (Admin Only)

**Endpoint:** `DELETE /api/tasks/{id}`

**Example:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Services API Examples

### Get All Services

**Endpoint:** `GET /api/services`

**Example:**

```bash
curl -X GET http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get Active Services Only:**

```bash
curl -X GET "http://localhost:5000/api/services?filters[IsActive]=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Service by ID

**Endpoint:** `GET /api/services/{id}`

**Example:**

```bash
curl -X GET http://localhost:5000/api/services/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Create Service (Admin Only)

**Endpoint:** `POST /api/services`

**Request Body:**

```json
{
  "name": "Social Media Management",
  "description": "Complete social media management including content creation, posting, and engagement",
  "deliverables": "10 posts per month, daily engagement, monthly analytics report",
  "basePrice": 1500.0,
  "pricingType": "Monthly"
}
```

**Example:**

```bash
curl -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Social Media Management",
    "description": "Complete social media management",
    "deliverables": "10 posts per month, daily engagement",
    "basePrice": 1500.00,
    "pricingType": "Monthly"
  }'
```

**Valid PricingType Values:** `Fixed`, `Monthly`, `Hourly`, `ProjectBased`

---

### Update Service (Admin Only)

**Endpoint:** `PUT /api/services/{id}`

**Request Body:**

```json
{
  "name": "Social Media Management - Premium",
  "description": "Updated description",
  "deliverables": "15 posts per month, daily engagement, weekly analytics",
  "basePrice": 2000.0,
  "pricingType": "Monthly",
  "isActive": true
}
```

**Example:**

```bash
curl -X PUT http://localhost:5000/api/services/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Social Media Management - Premium",
    "basePrice": 2000.00,
    "isActive": true
  }'
```

---

### Delete Service (Admin Only)

**Endpoint:** `DELETE /api/services/{id}`

**Example:**

```bash
curl -X DELETE http://localhost:5000/api/services/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Users API Examples

### Get All Users (Admin Only)

**Endpoint:** `GET /api/users`

**Example:**

```bash
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**With Filters:**

```bash
# Get active users only
curl -X GET "http://localhost:5000/api/users?filters[IsActive]=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get users by role
curl -X GET "http://localhost:5000/api/users?filters[Role]=Admin" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get User by ID (Admin Only)

**Endpoint:** `GET /api/users/{id}`

**Example:**

```bash
curl -X GET http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Get Current User

**Endpoint:** `GET /api/users/me`

**Example:**

```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

**Note:** To create a new user, use `POST /api/auth/register` (see Authentication section). Admin users are created via SeedData. This section only covers viewing, updating, and deleting existing users.

---

### Update User (Admin Only)

**Endpoint:** `PUT /api/users/{id}`

**Request Body:**

```json
{
  "email": "updated@marketingagency.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "isActive": true,
  "roles": ["Admin"]
}
```

---

### Delete User (Admin Only)

**Endpoint:** `DELETE /api/users/{id}`

**Example:**

```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Change Password

**Endpoint:** `POST /api/users/{id}/change-password`

**Request Body:**

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

---

## Complete Workflow Example

Here's a complete example of creating a full workflow:

```bash
# 1. Login and get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@marketingagency.com","password":"Admin123!"}' \
  | jq -r '.token')

# 2. Create a Service
SERVICE_ID=$(curl -s -X POST http://localhost:5000/api/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Google Ads Campaign",
    "description": "PPC advertising on Google",
    "basePrice": 2000.00,
    "pricingType": "Monthly"
  }' | jq -r '.id')

echo "Service ID: $SERVICE_ID"

# 3. Create a Client
CLIENT_ID=$(curl -s -X POST http://localhost:5000/api/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Tech Startup Inc",
    "email": "contact@techstartup.com",
    "contactPerson": "Jane Smith"
  }' | jq -r '.id')

echo "Client ID: $CLIENT_ID"

# 4. Create a Campaign
CAMPAIGN_ID=$(curl -s -X POST http://localhost:5000/api/campaigns \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Q1 Marketing Push\",
    \"description\": \"Quarterly marketing campaign\",
    \"clientId\": $CLIENT_ID,
    \"serviceId\": $SERVICE_ID,
    \"startDate\": \"2025-01-01T00:00:00Z\",
    \"endDate\": \"2025-03-31T23:59:59Z\",
    \"budget\": 10000.00
  }" | jq -r '.id')

echo "Campaign ID: $CAMPAIGN_ID"

# 5. Create a Task for the Campaign
TASK_ID=$(curl -s -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Setup Google Ads Account\",
    \"description\": \"Create and configure Google Ads account for client\",
    \"campaignId\": $CAMPAIGN_ID,
    \"dueDate\": \"2025-01-15T23:59:59Z\",
    \"priority\": \"High\"
  }" | jq -r '.id')

echo "Task ID: $TASK_ID"

# 6. Get all created resources
echo "=== Summary ==="
curl -s -X GET http://localhost:5000/api/clients/$CLIENT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.companyName'

curl -s -X GET http://localhost:5000/api/campaigns/$CAMPAIGN_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.name'

curl -s -X GET http://localhost:5000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.title'
```

---

## PowerShell Examples

```powershell
# Login
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@marketingagency.com","password":"Admin123!"}'

$token = $response.token

# Create Service
$service = Invoke-RestMethod -Uri "http://localhost:5000/api/services" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{
    "name": "SEO Optimization",
    "description": "Search engine optimization services",
    "basePrice": 2500.00,
    "pricingType": "Monthly"
  }'

# Create Campaign
$campaign = Invoke-RestMethod -Uri "http://localhost:5000/api/campaigns" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body (@{
    name = "Q1 SEO Campaign"
    description = "SEO optimization for Q1"
    clientId = 1
    serviceId = $service.id
    startDate = "2025-01-01T00:00:00Z"
    endDate = "2025-03-31T23:59:59Z"
    budget = 15000.00
  } | ConvertTo-Json)

# Create Task
$task = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" `
  -Method POST `
  -Headers @{Authorization="Bearer $token"} `
  -ContentType "application/json" `
  -Body (@{
    title = "Keyword Research"
    description = "Research and analyze keywords"
    campaignId = $campaign.id
    dueDate = "2025-01-20T23:59:59Z"
    priority = "High"
  } | ConvertTo-Json)
```

---

## Available API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Clients (All require authentication)

- `GET /api/clients` - Get all clients (with pagination/filtering)
- `GET /api/clients/{id}` - Get client by ID
- `POST /api/clients` - Create client (Admin only)
- `PUT /api/clients/{id}` - Update client (Admin only)
- `DELETE /api/clients/{id}` - Delete client (Admin only)

### Campaigns (All require authentication)

- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/{id}` - Get campaign by ID
- `POST /api/campaigns` - Create campaign (Admin only)
- `PUT /api/campaigns/{id}` - Update campaign (Admin only)
- `DELETE /api/campaigns/{id}` - Delete campaign (Admin only)

### Tasks (All require authentication)

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/{id}` - Update task (Users can update their assigned tasks)
- `DELETE /api/tasks/{id}` - Delete task (Admin only)

### Services (All require authentication)

- `GET /api/services` - Get all services
- `GET /api/services/{id}` - Get service by ID
- `POST /api/services` - Create service (Admin only)
- `PUT /api/services/{id}` - Update service (Admin only)
- `DELETE /api/services/{id}` - Delete service (Admin only)

### Users (Admin only)

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/me` - Get current logged-in user
- `PUT /api/users/{id}` - Update user (Admin only)
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `POST /api/users/{id}/change-password` - Change user password

**Note:** To create a new user, use `POST /api/auth/register` (public endpoint). Admin users are created via SeedData.

---

## Using Postman

1. **Create a new request** for registration/login
2. **Set method** to POST
3. **Set URL** to `http://localhost:5000/api/auth/register` or `/api/auth/login`
4. **Go to Headers** tab, add:
   - Key: `Content-Type`, Value: `application/json`
5. **Go to Body** tab, select "raw" and "JSON", paste the JSON body
6. **Send request** and copy the `token` from response
7. **For protected endpoints:**
   - Go to **Authorization** tab
   - Select **Type: Bearer Token**
   - Paste your JWT token
   - Now all requests will include the token automatically

---

## Using JavaScript/Fetch

```javascript
// 1. Login
const loginResponse = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "admin@example.com",
    password: "Admin123!",
  }),
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 2. Get Clients
const clientsResponse = await fetch("http://localhost:5000/api/clients", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const clients = await clientsResponse.json();
console.log(clients);

// 3. Create Client
const createResponse = await fetch("http://localhost:5000/api/clients", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    companyName: "New Company",
    email: "new@company.com",
  }),
});
```

---

## Filter Parameters

All list endpoints support these query parameters:

- `pageNumber` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `searchTerm` - Search in name/description
- `sortBy` - Field to sort by (e.g., "companyName", "createdAt")
- `sortDescending` - true/false
- `filters` - Additional filters (varies by endpoint)

**Example:**

```
GET /api/clients?pageNumber=1&pageSize=20&searchTerm=acme&sortBy=companyName&sortDescending=false
```

---

## Common Issues

1. **401 Unauthorized** - Token missing or expired

   - Solution: Login again to get a new token

2. **403 Forbidden** - User doesn't have required role

   - Solution: Assign Admin role to user

3. **400 Bad Request** - Invalid request data

   - Solution: Check request body format and required fields

4. **404 Not Found** - Endpoint or resource doesn't exist
   - Solution: Verify URL and resource ID

---

## Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# Register
echo "Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')
echo "Token: $TOKEN"

# Get Clients
echo -e "\nGetting clients..."
curl -X GET "$BASE_URL/clients" \
  -H "Authorization: Bearer $TOKEN"

# Create Client
echo -e "\n\nCreating client..."
curl -X POST "$BASE_URL/clients" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "email": "test@company.com"
  }'
```

Run with: `bash test-api.sh`
