@echo off
REM ===============================================
REM Volunteer Management Microservices Startup Script
REM ===============================================
REM This batch file starts all microservices with 10-second intervals
REM Prerequisites: 
REM   - Maven must be installed and in PATH
REM   - MySQL database with proper schemas created
REM   - Java 17+ installed
REM ===============================================

echo.
echo ========================================
echo Starting Volunteer Management Platform
echo ========================================
echo.

REM Navigate to java-spring-boot directory
cd /d "%~dp0"
if not exist "config-server" (
    echo Error: Not in java-spring-boot directory. Exiting.
    exit /b 1
)

REM ===============================================
REM 1. START CONFIG SERVER (Port 8888)
REM ===============================================
echo [1/6] Starting Config Server on port 8888...
echo       This server provides centralized configuration
start cmd /k "cd config-server && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

REM ===============================================
REM 2. START EUREKA SERVER (Port 8761)
REM ===============================================
echo [2/6] Starting Eureka Server on port 8761...
echo       Service Registry and Discovery
start cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

REM ===============================================
REM 3. START IDENTITY SERVICE (Port 8082)
REM ===============================================
echo [3/6] Starting Identity Service on port 8082...
echo       Database: identity_db
echo       Handles authentication and JWT tokens
start cmd /k "cd identity-service && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

REM ===============================================
REM 4. START USER MANAGEMENT SERVICE (Port 8081)
REM ===============================================
echo [4/6] Starting User Management Service on port 8081...
echo       Database: user_management_db
echo       Manages user CRUD operations
start cmd /k "cd user-management-service && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

REM ===============================================
REM 5. START EVENT MANAGEMENT SERVICE (Port 8083)
REM ===============================================
echo [5/6] Starting Event Management Service on port 8083...
echo       Database: event_db
echo       Manages volunteer events and activities
start cmd /k "cd event-management-service && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

REM ===============================================
REM 6. START API GATEWAY (Port 8080)
REM ===============================================
echo [6/6] Starting API Gateway on port 8080...
echo       Entry point for all client requests
echo       Routes requests to appropriate microservices
start cmd /k "cd api-gateway && mvn spring-boot:run"
timeout /t 10 /nobreak
echo.

REM ===============================================
REM All services started
REM ===============================================
echo.
echo ========================================
echo All services are starting up!
echo ========================================
echo.
echo Service URLs:
echo   - Config Server:       http://localhost:8888
echo   - Eureka Dashboard:    http://localhost:8761
echo   - User Service:        http://localhost:8081
echo   - Identity Service:    http://localhost:8082
echo   - Event Service:       http://localhost:8083
echo   - API Gateway:         http://localhost:8080
echo.
echo Note: Please ensure MySQL is running with the required databases:
echo   - identity_db
echo   - user_management_db
echo   - event_db
echo.
echo To stop all services, close all command windows or use Task Manager
echo.
pause
