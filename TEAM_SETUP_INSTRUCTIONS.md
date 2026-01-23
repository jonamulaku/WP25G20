# Team Setup Instructions

## For Everyone (First Time Setup)

### 1. Create Your Local Configuration

**Copy the template file:**
```powershell
# In WP25G20 folder
Copy-Item appsettings.Development.json.template appsettings.Development.json
```

**Edit `appsettings.Development.json`** with your connection string:
- **If you're the HOST** (running the database): Use `localhost` or `127.0.0.1`
- **If you're a CLIENT** (connecting to shared DB): Use the host's IP address

---

## For the HOST (Person Running Shared Database)

### 1. Keep Default Settings

Your `appsettings.Development.json` should use `localhost`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=WP25G20;User Id=sa;Password=YourStrongPassword123;TrustServerCertificate=True;Encrypt=False;MultipleActiveResultSets=True;Connection Timeout=60;"
  }
}
```

### 2. Keep docker-compose.yml as is

No changes needed - it already uses `marketing-agency-db` service name.

### 3. Start Both Services
```powershell
docker-compose up -d
```

---

## For CLIENTS (Teammates Connecting to Shared Database)

### 1. Update appsettings.Development.json

Use the **host's IP address**:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=192.168.0.65,1433;Database=WP25G20;User Id=sa;Password=YourStrongPassword123;TrustServerCertificate=True;Encrypt=False;MultipleActiveResultSets=True;Connection Timeout=60;"
  }
}
```

Replace `192.168.0.65` with the actual host IP.

### 2. Create docker-compose.override.yml

**Copy the example:**
```powershell
Copy-Item docker-compose.override.yml.example docker-compose.override.yml
```

**Edit `docker-compose.override.yml`** and uncomment/update:
```yaml
services:
  webapp:
    environment:
      - ConnectionStrings__DefaultConnection=Server=192.168.0.65,1433;Database=WP25G20;User Id=sa;Password=YourStrongPassword123;TrustServerCertificate=True;Encrypt=False;MultipleActiveResultSets=True;Connection Timeout=60;
```

Replace `192.168.0.65` with the host's IP.

### 3. Stop Local SQL Server, Run Only Web App
```powershell
# Stop local SQL Server
docker-compose stop sqlserver

# Run only web app (it will use the override connection string)
docker-compose up -d webapp
```

---

## Important Notes

✅ **`appsettings.Development.json`** is gitignored - each person has their own  
✅ **`docker-compose.override.yml`** is gitignored - each person can customize  
✅ **`docker-compose.yml`** is committed - shared by everyone  
✅ **Template files** (`.template` and `.example`) are committed - safe to share  

---

## Quick Reference

**Host:**
- `appsettings.Development.json`: Use `localhost`
- `docker-compose.yml`: No changes needed
- Run: `docker-compose up -d`

**Clients:**
- `appsettings.Development.json`: Use host's IP
- `docker-compose.override.yml`: Use host's IP
- Run: `docker-compose up -d webapp` (SQL Server stopped)
