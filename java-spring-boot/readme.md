Milestone 1 — Microservices Foundation (Config Server + User Service)
1. Executive Summary

Milestone 1 establishes the core backend infrastructure for a scalable microservices system.
The objective was to implement centralized configuration management and a User Management Service that consumes configuration dynamically at runtime.

The milestone demonstrates how services remain environment-agnostic by retrieving database credentials from a dedicated configuration server.

2. Components Implemented
Config Repository

A standalone directory that stores configuration files for all services.

Example:

config-repo/
 └── user-management-service.yml


Purpose:

Holds environment-specific properties

Keeps secrets outside application code

Acts as the single source of truth

Config Server (Port 8888)

A Spring Boot application responsible for reading configuration files from the config repo and exposing them via REST endpoints.

Responsibilities:

Loads configuration at startup

Serves properties to client services

Enables centralized config updates

Endpoint example:

http://localhost:8888/user-management-service/default

User Management Service (Port 8081)

A client microservice that fetches configuration from the Config Server at startup and initializes its database connection dynamically.

Responsibilities:

User CRUD operations

Business logic layer

Database persistence

3. Folder Structure
java-spring-boot/
│
├── config-repo/
│   └── user-management-service.yml
│
├── config-server/
│   ├── src/main/java/.../ConfigServerApplication.java
│   └── src/main/resources/application.yml
│
├── user-management-service/
│   ├── src/main/java/.../controller
│   ├── src/main/java/.../service
│   ├── src/main/java/.../repository
│   ├── src/main/java/.../model
│   ├── src/main/java/.../dto
│   ├── src/main/java/.../exception
│   └── src/main/resources/application.yml
│
└── pom.xml (multi-module parent)

4. How Config Server & Config Repo Work in Sync
Step-by-Step Flow

Config Server starts

It reads configuration files from config-repo

Config Server exposes REST endpoints for each service

User Management Service starts

It calls Config Server using:

spring.config.import=configserver:http://localhost:8888


Config Server returns properties

User Service initializes datasource using received config

Result:
The service runs without any hardcoded credentials.

5. Configuration Lifecycle
Config File → Config Server → REST Endpoint → User Service → Database Connection


This enables:

Centralized config updates

Environment-based profiles

Runtime configuration consistency

6. Technical Stack

Java 17

Spring Boot 3.x

Spring Cloud Config Server

MySQL 8

Spring Data JPA

Maven

7. API Endpoints
Method	Endpoint	Description
POST	/api/users	Create user
GET	/api/users	Get all users
GET	/api/users/{id}	Get user by ID
PUT	/api/users/{id}	Update user
DELETE	/api/users/{id}	Delete user
8. Application Startup Flow

Run in this order:

1️⃣ MySQL
2️⃣ Config Server
3️⃣ User Management Service

Reason:
User Service requires configuration from Config Server before it can initialize its database connection.

9. Verification
Verify Config Server
curl http://localhost:8888/user-management-service/default


Expected:
JSON containing spring.datasource.* properties.

10. Outcome

Milestone 1 successfully provides:

Centralized configuration architecture

Config-driven service startup

Database integration through external config

Clean multi-module structure

This forms the base for future additions like service discovery and API gateway.
________________________________________________________________________


+++++++++++++++++++++++++++++++++++++++++++++
Milestone 2 — Service Discovery & API Gateway
______________________________________________
The goal of this milestone was to transform the previously standalone microservices into a fully connected distributed system by introducing:

Centralized Service Discovery

A Unified API Gateway

Dynamic service registration and routing

This enables dynamic service registration, inter-service communication, and a single entry point for all client requests.

The system evolves from standalone services to a fully connected microservices architecture.

2. Objectives

The primary objectives achieved in this milestone include:

Implementing a Service Registry using Netflix Eureka

Enabling automatic service registration and discovery

Creating an API Gateway to centralize client access

Decoupling services from hardcoded URLs

Establishing a scalable communication architecture


Architecture:


                ┌─────────────────────┐
                │        Client        │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │     API Gateway     │  (Port 8080)
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │     Eureka Server   │  (Port 8761)
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ User Management MS  │  (Port 8081)
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       MySQL DB      │  (Port 3306)
                └─────────────────────┘

Architectural Roles:
Gateway Layer → Handles incoming traffic
Discovery Layer → Tracks service instances
Service Layer → Business logic
Data Layer → Persistent storage

Components
4.1 Eureka Server — Service Registry

Purpose

The Eureka Server acts as the central directory for all microservices.
It enables services to locate each other dynamically without hardcoded endpoints.

Responsibilities

Maintains a registry of active services

Performs health monitoring

Enables load-balanced communication

Port: 8761

4.2 API Gateway — Routing Layer

Purpose

The API Gateway serves as the single entry point for all external client requests.

Key Capabilities

Dynamic routing using service names

Centralized request handling

Future support for authentication, rate limiting, and logging

Port: 8080

4.3 User Management Service — Business Service

Enhancements in Milestone 2

Registers automatically with Eureka

Retrieves configuration from Config Server

Exposes REST APIs via Gateway

Port: 8081

4.4 Configuration Layer (from Milestone 1)

Although implemented earlier, the Config Server remains a critical dependency in this milestone.

Role

Supplies environment-specific configuration

Centralizes sensitive properties

Ensures consistency across services

5. Technology Stack
| Category                 | Technology                  |
| ------------------------ | --------------------------- |
| Programming Language     | Java 17+                    |
| Framework                | Spring Boot                 |
| Service Discovery        | Spring Cloud Netflix Eureka |
| API Gateway              | Spring Cloud Gateway        |
| Configuration Management | Spring Cloud Config         |
| Database                 | MySQL 8                     |
| ORM                      | Spring Data JPA / Hibernate |
| Build Tool               | Maven                       |
| API Testing              | Postman   |
| Documentation            | OpenAPI (Swagger)           |


7. Application Startup Workflow

The startup sequence is essential due to service dependencies.

Step 1 — Start Database

Provides persistent storage for services.

Step 2 — Start Config Server

All services fetch configuration during boot.

Step 3 — Start Eureka Server

Enables service registration.

Step 4 — Start User Management Service

Registers itself with Eureka and loads configuration.

Step 5 — Start API Gateway

Begins routing client requests.

7. Application Startup Workflow

The startup sequence is essential due to service dependencies.

Step 1 — Start Database

Provides persistent storage for services.

Step 2 — Start Config Server

All services fetch configuration during boot.

Step 3 — Start Eureka Server

Enables service registration.

Step 4 — Start User Management Service

Registers itself with Eureka and loads configuration.

Step 5 — Start API Gateway

Begins routing client requests.

8. Request Processing Flow

Client sends HTTP request to API Gateway

Gateway queries Eureka for service instance

Eureka returns service location

Gateway forwards request to User Service

Service processes request and interacts with database

Response returned to client

This flow removes direct service coupling and improves scalability.

9. Verification & Testing
9.1 Eureka Dashboard

URL:

http://localhost:8761


Expected Result:
Registered instance of User Management Service visible

9.2 Gateway Routing Test
GET http://localhost:8080/api/users


Expected Result:
Response from User Management Service

9.3 Health Monitoring
http://localhost:8081/actuator/health


Expected Result:
Service status UP

10. Key Learnings

During this milestone, the following concepts were implemented and validated:

Service discovery patterns

Dynamic routing architecture

Dependency-driven startup sequencing

Decoupled service communication

Production-style microservices structure

11. Outcome

Milestone 2 successfully establishes:

Dynamic service registration

Centralized API routing

Decoupled microservices communication

Scalable backend architecture

The system is now capable of handling distributed service interactions in a maintainable and extensible manner.