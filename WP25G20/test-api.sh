#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== Testing Marketing Agency API ==="
echo ""

# Test 1: Login
echo "1. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@marketingagency.com",
    "password": "Admin123!"
  }')

echo "Login Response:"
echo $LOGIN_RESPONSE | jq '.' 2>/dev/null || echo $LOGIN_RESPONSE
echo ""

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✓ Token received: ${TOKEN:0:50}..."
  echo ""
  
  # Test 2: Get Clients
  echo "2. Testing Get Clients..."
  CLIENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/clients" \
    -H "Authorization: Bearer $TOKEN")
  
  echo "Clients Response:"
  echo $CLIENTS_RESPONSE | jq '.' 2>/dev/null || echo $CLIENTS_RESPONSE
  echo ""
  
  # Test 3: Create Client
  echo "3. Testing Create Client..."
  CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/clients" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "companyName": "Test Company API",
      "email": "testapi@company.com",
      "contactPerson": "Test Person"
    }')
  
  echo "Create Client Response:"
  echo $CREATE_RESPONSE | jq '.' 2>/dev/null || echo $CREATE_RESPONSE
  echo ""
  
  echo "=== Tests Complete ==="
else
  echo "✗ Failed to get token. Check if admin user exists."
  echo "Run the application first to seed the admin user."
fi
