# 🐳 Docker Deployment Guide

This document provides a quick reference for deploying the MIMSC Lab application using Docker.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Docker Compose
- At least 4GB RAM and 5GB disk space

### One-Command Setup

**Linux/macOS:**
```bash
chmod +x docker-setup.sh && ./docker-setup.sh
```

**Windows (PowerShell):**
```powershell
.\docker-setup.ps1
```

**Windows (Command Prompt):**
```cmd
docker-setup.bat
```

## 📋 What Gets Installed

The Docker setup creates:
- **Next.js Application** (Port 3000)
- **MongoDB Database** (Port 27017)
- **Persistent Data Volumes** for database storage

## 🔧 Manual Setup

If you prefer manual control:

```bash
# 1. Create environment file
cp .env.docker .env

# 2. Build and start
docker-compose up -d --build

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f
```

## 🌐 Access the Application

Once running:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **MongoDB**: localhost:27017

### Default Admin Credentials
```
Email: admin@mimsc.ma
Password: Admin@123456
```

## 📝 Common Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart after code changes
docker-compose up -d --build

# Clean everything
docker-compose down -v
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000  # Linux/macOS
netstat -ano | findstr :3000  # Windows
```

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Database Connection Issues
```bash
# Verify MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb
```

## 📚 Full Documentation

For detailed instructions, troubleshooting, and platform-specific guides, see:
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Complete setup guide for all platforms

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Next.js Application (3000)      │
│  - Web Server                       │
│  - API Routes                       │
│  - Admin Panel                      │
└──────────────┬──────────────────────┘
               │
               │ MongoDB Connection
               │
┌──────────────▼──────────────────────┐
│     MongoDB Database (27017)        │
│  - User Data                        │
│  - Events                           │
│  - Publications                     │
└─────────────────────────────────────┘
```

## 🔒 Security Notes

**For Production:**
1. Change `NEXTAUTH_SECRET` to a strong random string
2. Update `ADMIN_PASSWORD` to a secure password
3. Use environment-specific `.env` files
4. Enable HTTPS with a reverse proxy
5. Restrict MongoDB network access

## 📦 What's Included

- [`Dockerfile`](Dockerfile:1) - Multi-stage build for Next.js
- [`docker-compose.yml`](docker-compose.yml:1) - Service orchestration
- [`.dockerignore`](.dockerignore:1) - Build optimization
- [`.env.docker`](.env.docker:1) - Environment template
- [`mongo-init/init-mongo.js`](mongo-init/init-mongo.js:1) - Database initialization
- Setup scripts for all platforms

## 🆘 Need Help?

1. Check [`DOCKER_SETUP.md`](DOCKER_SETUP.md:1) for detailed instructions
2. Review container logs: `docker-compose logs -f`
3. Verify environment variables: `cat .env`
4. Check container status: `docker-compose ps`

## 📄 License

Same as the main project.

---

**Last Updated**: 2025-11-21