# Simple migration runner - run from WP25G20\Scripts directory
# Or adjust the path below

$scriptFile = "CreateApprovalRequestsTable.sql"
$containerName = "marketing-agency-db"
$saPassword = "YourStrongPassword123"
$databaseName = "WP25G20"

Write-Host "Starting migration..." -ForegroundColor Cyan

# Check if container is running
$containerRunning = docker ps --filter "name=$containerName" --format "{{.Names}}"
if (-not $containerRunning) {
    Write-Host "Starting Docker container..." -ForegroundColor Yellow
    docker start $containerName
    Start-Sleep -Seconds 5
}

# Get the full path to the script
$scriptPath = Join-Path $PSScriptRoot $scriptFile
if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: Script not found at $scriptPath" -ForegroundColor Red
    exit 1
}

Write-Host "Copying script to container..." -ForegroundColor Yellow
docker cp $scriptPath "${containerName}:/tmp/migration.sql"

Write-Host "Executing migration..." -ForegroundColor Yellow
docker exec $containerName /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $saPassword -d $databaseName -C -i /tmp/migration.sql

Write-Host "Cleaning up..." -ForegroundColor Yellow
docker exec $containerName rm /tmp/migration.sql

Write-Host "Migration complete!" -ForegroundColor Green
