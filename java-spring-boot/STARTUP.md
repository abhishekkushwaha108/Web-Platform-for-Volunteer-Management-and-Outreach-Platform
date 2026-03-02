# Volunteer Management Platform - Application Startup Guide

## 📋 Project Overview

This is a microservices-based Spring Boot application for volunteer management and outreach. The platform consists of multiple independent services that communicate through a centralized API Gateway and service discovery using Eureka.

### Architecture Components

- **API Gateway**: Entry point for all client requests
- **Eureka Server**: Service discovery and registration center
- **Config Server**: Centralized configuration management
- **Identity Service**: Authentication and JWT token management
- **User Management Service**: User profile and role management

---

## 🔧 Prerequisites

Before starting the application, ensure you have the following installed:

- **Java 17 or higher**
  ```bash
  java -version
  ```

- **Maven 3.6+**
  ```bash
  mvn --version
  ```

- **Git** (for version control)

---

## 📁 Project Structure

```
java-spring-boot/
├── config-server/           # Configuration server (port 8888)
├── eureka-server/           # Service discovery (port 8761)
├── api-gateway/             # API Gateway (port 8080)
├── identity-service/        # Authentication service (port 8081)
├── user-management-service/ # User management (port 8082)
├── config-repo/             # Configuration files for services
└── pom.xml                  # Parent Maven POM
```

---

## 🚀 Quick Start

### Step 1: Build the Project

```bash
cd java-spring-boot
mvn clean install -DskipTests
```

This will compile all modules and prepare them for execution.

### Step 2: Start Services (in order)

**Terminal 1 - Start Eureka Server** (Service Discovery)
```bash
cd eureka-server
mvn spring-boot:run
```
- Accessible at: `http://localhost:8761`
- All other services will register here

**Terminal 2 - Start Config Server** (Configuration Management)
```bash
cd config-server
mvn spring-boot:run
```
- Accessible at: `http://localhost:8888`
- All services fetch their configuration from here

**Terminal 3 - Start Identity Service** (Authentication)
```bash
cd identity-service
mvn spring-boot:run
```
- Accessible at: `http://localhost:8081`
- Handles JWT token generation and validation

**Terminal 4 - Start User Management Service** (User Management)
```bash
cd user-management-service
mvn spring-boot:run
```
- Accessible at: `http://localhost:8082`
- Manages user profiles and roles

**Terminal 5 - Start API Gateway** (Main Entry Point)
```bash
cd api-gateway
mvn spring-boot:run
```
- Accessible at: `http://localhost:8080`
- Routes requests to individual services

### Step 3: Verify All Services are Running

Check Eureka Dashboard:
```bash
curl http://localhost:8761
```

You should see all 4 services registered (excluding Eureka itself):
- IDENTITY-SERVICE
- USER-MANAGEMENT-SERVICE
- API-GATEWAY
- CONFIG-SERVER

---

## 🔐 Service Configuration

### Configuration Files Location
All service configurations are in `config-repo/`:

```
config-repo/
├── Identity-service.yml          # Identity service config
└── user-management-service.yml   # User management config
```

### JWT Configuration
Update `jwt.secret` and `jwt.expiration` in Identity-service.yml:

```yaml
jwt:
  secret: your-secure-secret-key-here
  expiration: 3600000  # 1 hour in milliseconds
```

### Database Configuration
Configure database connections in respective service YAML files.

---

## 🔑 API Endpoints

### Through API Gateway (Recommended)
```
GET  /api/users                    # List all users
POST /api/users                    # Create new user
GET  /api/users/{id}              # Get user by ID
POST /api/auth/login              # Login and get JWT token
```

### Direct Service Access
- **Identity Service**: `http://localhost:8081/...`
- **User Management**: `http://localhost:8082/...`

---

## 🛠️ Troubleshooting

### Service fails to start
```bash
# Check if port is already in use
lsof -i :8080
# Kill process using the port (if needed)
kill -9 <PID>
```

### Services not registering with Eureka
- Ensure Eureka Server is running on `http://localhost:8761`
- Check service logs for connection errors
- Verify network connectivity between services

### Configuration not loading
- Ensure Config Server is running on `http://localhost:8888`
- Verify configuration files exist in `config-repo/`
- Check service logs for configuration errors

### JWT Token Issues
- Verify `jwt.secret` is set consistently
- Ensure token hasn't expired (check `jwt.expiration`)
- Token format: `Authorization: Bearer <token>`

---

## 📊 Monitoring & Logs

View logs for each service:
```bash
# Real-time logs
mvn spring-boot:run

# Or after build
java -jar target/service-name-1.0.0.jar
```

Check Eureka Dashboard for service health:
```
http://localhost:8761
```

---

## 🔄 Development Workflow

### Making Code Changes
1. Edit source code in respective module
2. Rebuild that module: `mvn clean install -DskipTests`
3. Restart the service: Stop current process and re-run `mvn spring-boot:run`

### Adding New Dependencies
1. Update `pom.xml` in the module
2. Run: `mvn clean install`
3. Restart the service

### Database Migrations
- Update database schemas in respective services
- Restart the affected service

---

## 📦 Build Artifacts

After successful build, JAR files are located in:
```
config-server/target/config-server-1.0.0.jar
eureka-server/target/eureka-server-1.0.0.jar
api-gateway/target/api-gateway-1.0.0.jar
identity-service/target/identity-service-1.0.0.jar
user-management-service/target/user-management-service-1.0.0.jar
```

---

## 🌐 Spring Boot Version

- **Current Version**: Spring Boot 3.3.11 (LTS)
- **Java Target**: Java 17+
- **Spring Cloud**: 2023.0.5

---

## ✅ Health Checks

All services expose health endpoints:
```bash
curl http://localhost:8081/actuator/health  # Identity Service
curl http://localhost:8082/actuator/health  # User Management
curl http://localhost:8080/actuator/health  # API Gateway
```

---

## 📝 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Eureka Documentation](https://github.com/Netflix/eureka)
- [JWT Documentation](https://jwt.io)

---

## 🤝 Support

For issues or questions, refer to the main README.md or consult the service-specific documentation in each microservice folder.

---

**Last Updated**: February 26, 2026
