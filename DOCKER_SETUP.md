# Docker Setup Guide for MIMSC Lab

This guide provides comprehensive instructions for setting up and running the MIMSC Lab application using Docker on different operating systems.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Platform-Specific Instructions](#platform-specific-instructions)
  - [Linux](#linux)
  - [macOS](#macos)
  - [Windows](#windows)
- [Configuration](#configuration)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### All Platforms
- **Docker Desktop** (or Docker Engine for Linux)
  - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - macOS: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/)
- **Docker Compose** (included with Docker Desktop, separate install for Linux)

### System Requirements
- **RAM**: Minimum 4GB, recommended 8GB+
- **Disk Space**: At least 5GB free space
- **CPU**: 2+ cores recommended

---

## Quick Start

### Automated Setup (Recommended)

Choose the appropriate script for your operating system:

#### Linux/macOS
```bash
# Make the script executable
chmod +x docker-setup.sh

# Run the setup script
./docker-setup.sh
```

#### Windows (Command Prompt)
```cmd
docker-setup.bat
```

#### Windows (PowerShell)
```powershell
# You may need to allow script execution first
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run the setup script
.\docker-setup.ps1
```

### Manual Setup

If you prefer to run commands manually:

```bash
# 1. Create environment file
cp .env.docker .env

# 2. Build and start containers
docker-compose up -d --build

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

---

## Platform-Specific Instructions

### Linux

#### Installation

1. **Install Docker Engine**:
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Add your user to docker group
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Install Docker Compose**:
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

3. **Verify Installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

4. **Run Setup**:
   ```bash
   chmod +x docker-setup.sh
   ./docker-setup.sh
   ```

#### Troubleshooting Linux

- **Permission Denied**: Make sure your user is in the docker group
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```

- **Port Already in Use**: Check if ports 3000 or 27017 are already in use
  ```bash
  sudo lsof -i :3000
  sudo lsof -i :27017
  ```

---

### macOS

#### Installation

1. **Install Docker Desktop**:
   - Download from [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - Install the `.dmg` file
   - Start Docker Desktop from Applications

2. **Verify Installation**:
   ```bash
   docker --version
   docker-compose --version
   ```

3. **Run Setup**:
   ```bash
   chmod +x docker-setup.sh
   ./docker-setup.sh
   ```

#### Troubleshooting macOS

- **Docker Desktop Not Starting**: 
  - Check System Preferences → Security & Privacy
  - Allow Docker Desktop to run
  - Restart your Mac if needed

- **Slow Performance**: 
  - Increase Docker Desktop resources in Preferences → Resources
  - Recommended: 4GB RAM, 2 CPUs minimum

---

### Windows

#### Installation

1. **Install Docker Desktop**:
   - Download from [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Run the installer
   - Restart your computer when prompted

2. **Enable WSL 2** (Recommended):
   - Open PowerShell as Administrator:
   ```powershell
   wsl --install
   ```
   - Restart your computer

3. **Verify Installation**:
   ```cmd
   docker --version
   docker-compose --version
   ```

4. **Run Setup**:

   **Option A: Command Prompt**
   ```cmd
   docker-setup.bat
   ```

   **Option B: PowerShell**
   ```powershell
   # Allow script execution (first time only)
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   
   # Run setup
   .\docker-setup.ps1
   ```

#### Windows-Specific Notes

- **Hyper-V**: Docker Desktop requires Hyper-V or WSL 2
- **Virtualization**: Must be enabled in BIOS
- **File Paths**: Use forward slashes (/) in Docker commands
- **Line Endings**: Git may convert line endings; ensure scripts use LF not CRLF

#### Troubleshooting Windows

- **WSL 2 Installation Failed**:
  ```powershell
  # Update WSL
  wsl --update
  
  # Set WSL 2 as default
  wsl --set-default-version 2
  ```

- **Docker Desktop Won't Start**:
  - Check if Hyper-V is enabled in Windows Features
  - Ensure virtualization is enabled in BIOS
  - Try running as Administrator

- **Port Conflicts**:
  ```powershell
  # Check what's using port 3000
  netstat -ano | findstr :3000
  
  # Check what's using port 27017
  netstat -ano | findstr :27017
  ```

---

## Configuration

### Environment Variables

The application uses environment variables defined in the `.env` file. A template is provided in [`.env.docker`](.env.docker:1).

#### Key Configuration Options

```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=adminpassword
MONGO_USERNAME=erraji0elmahdi
MONGO_PASSWORD=Tri2soukain@
MONGO_DATABASE=mimsc-lab

# Application URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Security
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Admin Credentials
ADMIN_EMAIL=admin@mimsc.ma
ADMIN_PASSWORD=Admin@123456
```

#### Customizing Configuration

1. Copy the template:
   ```bash
   cp .env.docker .env
   ```

2. Edit `.env` with your preferred values:
   ```bash
   # Linux/macOS
   nano .env
   
   # Windows
   notepad .env
   ```

3. Restart containers to apply changes:
   ```bash
   docker-compose restart
   ```

---

## Common Commands

### Container Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View container status
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f nextjs-app
docker-compose logs -f mongodb
```

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p adminpassword

# Backup MongoDB data
docker-compose exec mongodb mongodump --out /data/backup

# Restore MongoDB data
docker-compose exec mongodb mongorestore /data/backup
```

### Application Management

```bash
# Rebuild application (after code changes)
docker-compose up -d --build nextjs-app

# Execute commands in container
docker-compose exec nextjs-app sh

# View application logs
docker-compose logs -f nextjs-app
```

### Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution**:
```bash
# Find process using the port
# Linux/macOS
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# Kill the process or change port in docker-compose.yml
```

#### 2. Container Fails to Start

**Solution**:
```bash
# Check logs
docker-compose logs

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

#### 3. Database Connection Issues

**Solution**:
```bash
# Check if MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Verify environment variables
docker-compose exec nextjs-app env | grep MONGODB
```

#### 4. Permission Denied (Linux)

**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER .
```

#### 5. Out of Disk Space

**Solution**:
```bash
# Clean up Docker resources
docker system prune -a --volumes

# Check disk usage
docker system df
```

### Getting Help

If you encounter issues not covered here:

1. Check container logs: `docker-compose logs -f`
2. Verify environment variables: `cat .env`
3. Check Docker status: `docker-compose ps`
4. Review Docker Desktop logs (if using Desktop)

---

## Architecture

### Container Structure

The application consists of two main containers:

1. **nextjs-app**: Next.js application server
   - Port: 3000
   - Uses Node.js 20 Alpine
   - Includes Prisma for SQLite database
   - Connects to MongoDB for dynamic content

2. **mongodb**: MongoDB database server
   - Port: 27017
   - Version: 7.0
   - Persistent data storage via Docker volumes
   - Initialized with custom user and database

### Data Persistence

- **MongoDB Data**: Stored in `mongodb_data` volume
- **SQLite Data**: Stored in `prisma_data` volume
- **Volumes persist** even when containers are stopped

### Network

- Containers communicate via `mimsc-network` bridge network
- Application connects to MongoDB using internal DNS: `mongodb:27017`

---

## Accessing the Application

Once the containers are running:

- **Web Application**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Admin Panel**: http://localhost:3000/admin/login

### Default Admin Credentials

```
Email: admin@mimsc.ma
Password: Admin@123456
```

**⚠️ Important**: Change these credentials in production!

---

## Production Deployment

For production deployment:

1. **Update Environment Variables**:
   - Change `NEXTAUTH_SECRET` to a strong random string
   - Update `ADMIN_PASSWORD` to a secure password
   - Set `NODE_ENV=production`

2. **Use HTTPS**:
   - Set up a reverse proxy (nginx, Traefik)
   - Configure SSL certificates

3. **Secure MongoDB**:
   - Use strong passwords
   - Enable authentication
   - Restrict network access

4. **Backup Strategy**:
   - Regular MongoDB backups
   - Volume snapshots
   - Off-site backup storage

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review container logs: `docker-compose logs -f`
3. Consult the project documentation

---

**Last Updated**: 2025-11-21