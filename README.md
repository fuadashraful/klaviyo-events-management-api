# Klaviyo Event API

## Overview

This service is responsible for sending event to Klaviyo and manage events.
---

## Tech Stack

- **Backend Framework:** NestJS  
- **Database:** Mysql (Typeorm)  
- **Language:** TypeScript  
- **Validation:** class-validator, class-transformer  
- **API Docs:** Swagger  
- **Dependency Injection:** NestJS DI container  

---
## Using the Application with Docker

This project can be run entirely using Docker and Docker Compose. Follow these steps:

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

---

### 1. Clone the repository & Run

```bash
git https://github.com/fuadashraful/klaviyo-events-management-api.git
cd book-management
cp .env.example .env
sudo docker compose up --build

npm install
npm start

```

## API Documentation (Swagger)

This project includes interactive API documentation powered by **Swagger (OpenAPI)**.

After starting the application, you can explore and test all available API endpoints directly from your browser.

### Accessing Swagger

Once the server is running, open your browser and go to:
n.b: swagger is enabled in development environment
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)