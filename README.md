# Web Platform for Volunteer Management and Outreach

A web-based platform designed to connect volunteers with community outreach activities and social initiatives. The platform enables organizers to manage events and allows volunteers to discover events, enroll in activities, and track their participation.

## Overview

The **Volunteer Management and Outreach Platform** aims to simplify volunteer coordination and event management through a centralized web application. It supports communication between event organizers and volunteers while making community participation easier to manage.

## Features

- **User Management:** Supports users with different roles, such as volunteers and event organizers.
- **Event Management:** Enables organizers to create and manage volunteer events.
- **Event Discovery:** Allows volunteers to explore available events.
- **Event Enrollment:** Enables volunteers to enroll in events and manage their registrations.
- **Enrollment Management:** Supports unenrolling from events and retrieving the list of volunteers registered for a specific event.
- **REST APIs:** Provides API endpoints for communication between frontend and backend services.
- **Microservices Architecture:** Uses separate services to organize application functionality and improve modularity.

## Technology Stack

### Frontend
- React
- JavaScript
- Vite
- HTML5
- CSS3
- Axios for HTTP requests

### Backend
- Java
- Spring Boot
- Spring Data JPA / Hibernate
- RESTful APIs
- Maven

### Architecture and Tools
- Microservices Architecture
- Netflix Eureka Server for service discovery
- API Gateway for centralized API routing
- Git and GitHub for version control

### Database
- Relational database supported through the backend persistence layer.

## Architecture

The application follows a frontend-backend architecture with a microservices-based backend design.

- **Frontend:** Provides the user interface for volunteers and organizers.
- **API Gateway:** Acts as the entry point for routing client requests to backend services.
- **Eureka Server:** Supports service registration and discovery.
- **Backend Microservices:** Handle application operations, including event management and volunteer enrollment.
- **Database:** Stores application data through the backend persistence layer.

## Key Event APIs

The application requires the following event-related API operations:

1. Enroll in an event.
2. Unenroll from an event.
3. Retrieve all volunteers enrolled in a specific event.

These operations support volunteer registration and event participation management.

## Project Structure

```text
## Project Structure

```text
Web-Platform-for-Volunteer-Management-and-Outreach-Platform/
├── frontend/
│   ├── package.json
│   └── src/
├── backend/
│   ├── pom.xml
│   ├── config-server/
│   ├── user-management-service/
│   ├── event-management-service/
│   ├── api-gateway/
│   └── eureka-server/
├── README.md
└── .gitignore
```

The frontend directory contains the client application. Backend services and infrastructure components should be included in the structure if they are maintained in this repository.

## Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- Java Development Kit (JDK)
- Maven
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/abhishekkushwaha108/Web-Platform-for-Volunteer-Management-and-Outreach-Platform.git
```

### 2. Navigate to the Project

```bash
cd Web-Platform-for-Volunteer-Management-and-Outreach-Platform
```

### 3. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173/`.

### 4. Run the Backend

If the backend services are available locally, navigate to each service directory containing its `pom.xml` file and run:

```bash
./mvnw spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

Configure the database connection, service ports, Eureka Server, and API Gateway according to the application's configuration before starting the services.

## Learning Outcomes

- Developing frontend applications using React.
- Integrating frontend applications with REST APIs.
- Understanding Java and Spring Boot application development.
- Learning microservices architecture and service-to-service communication.
- Understanding service discovery using Netflix Eureka.
- Learning API routing through an API Gateway.
- Implementing event enrollment and registration management.
- Using Git and GitHub for source code management.

## Future Enhancements

- Email notifications for event registration and updates.
- Volunteer participation history and activity tracking.
- Event feedback and rating functionality.
- Participation reports and analytics.
- Improved authentication and role-based access control.

## Author

**Abhishek Kushwaha**

GitHub: [abhishekkushwaha108](https://github.com/abhishekkushwaha108)

## License

A license can be added to the repository according to the project's distribution and usage requirements.
