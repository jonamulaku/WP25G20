# PowerShell script to run the ApprovalRequests migration
# This script executes the SQL migration script against the SQL Server database

$scriptPath = Join-Path $PSScriptRoot "CreateApprovalRequestsTable.sql"
$containerName = "marketing-agency-db"
$saPassword = "YourStrongPassword123"
$databaseName = "WP25G20"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Running ApprovalRequests Migration" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker container is running
Write-Host "Checking if SQL Server container is running..." -ForegroundColor Yellow
$containerStatus = docker ps --filter "name=$containerName" --format "{{.Status}}"

if (-not $containerStatus) {
    Write-Host "ERROR: SQL Server container '$containerName' is not running!" -ForegroundColor Red
    Write-Host "Please start it with: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Container is running: $containerStatus" -ForegroundColor Green
Write-Host ""

# Check if script file exists
if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: Script file not found: $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "Executing migration script..." -ForegroundColor Yellow
Write-Host "Script: $scriptPath" -ForegroundColor Gray
Write-Host ""

# Copy the SQL file into the container temporarily
$tempContainerPath = "/tmp/CreateApprovalRequestsTable.sql"
Write-Host "Copying script to container..." -ForegroundColor Yellow

$copyResult = docker cp $scriptPath "${containerName}:${tempContainerPath}" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to copy script to container" -ForegroundColor Red
    Write-Host $copyResult -ForegroundColor Red
    exit 1
}

# Execute the SQL script using sqlcmd inside the container
Write-Host "Running migration..." -ForegroundColor Yellow
$migrationResult = docker exec $containerName /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $saPassword -d $databaseName -C -i $tempContainerPath 2>&1
$migrationExitCode = $LASTEXITCODE

# Clean up temporary file
docker exec $containerName rm -f $tempContainerPath 2>$null | Out-Null

# Check migration result
if ($migrationExitCode -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "✓ Migration completed successfully!" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The ApprovalRequests and ApprovalComments tables have been created." -ForegroundColor Cyan
    Write-Host "You can now access the Approvals page in the client dashboard." -ForegroundColor Cyan
    Write-Host ""
    if ($null -ne $migrationResult -and $migrationResult -ne "") {
        Write-Host $migrationResult
    }
} else {
    Write-Host ""
    Write-Host "ERROR: Migration failed with exit code $migrationExitCode" -ForegroundColor Red
    if ($null -ne $migrationResult -and $migrationResult -ne "") {
        Write-Host $migrationResult -ForegroundColor Red
    }
    exit 1
}
