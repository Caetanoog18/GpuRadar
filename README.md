# GPU Radar

GPU Radar is a full-stack web application created to help users find and compare graphics card prices from different online stores. The idea behind the project is simple: instead of manually searching multiple websites, users can search for a GPU model and quickly see available offers, identify the lowest price, and save products for future reference.

The project was developed as part of a Web Services and Software Development study, with a focus on REST APIs, external service integration, database persistence, and modern backend development practices.

## Main Features

* Search GPUs by model name
* Compare prices from different stores
* Automatically identify the best available offer
* Save favorite products
* Store search history
* Interactive API documentation with Swagger
* Integration with an external product search service through SerpApi

## Technologies

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* PostgreSQL
* Maven
* Swagger / OpenAPI

### Frontend

* Angular
* TypeScript
* Angular Material
* SCSS

### Infrastructure

* Docker
* Docker Compose

### External Services

* SerpApi (Google Shopping Search)

## Project Architecture

The application follows a layered architecture commonly used in Spring Boot applications.

```text
Frontend (Angular)
        |
        v
Spring Boot REST API
        |
        +------------------+
        |                  |
        v                  v
    PostgreSQL         SerpApi
```

The frontend communicates with the backend through REST endpoints. The backend is responsible for business logic, persistence, and integration with external services. Product information is retrieved from SerpApi and processed before being returned to the client.

## API Endpoints

### Products

Search products:

```http
GET /api/products?name=RTX 4060
```

Get the best offer:

```http
GET /api/products/best-offer?name=RTX 4060
```

### Search History

List all searches:

```http
GET /api/search-history
```

Get search by ID:

```http
GET /api/search-history/{id}
```

### Favorites

List favorites:

```http
GET /api/favorites
```

Get favorite by ID:

```http
GET /api/favorites/{id}
```

Create favorite:

```http
POST /api/favorites
```

Delete favorite:

```http
DELETE /api/favorites/{id}
```

## Running the Application

### Clone the repository

```bash
git clone https://github.com/Caetanoog18/GpuRadar.git

cd GpuRadar
```

### Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_NAME=gpuradar
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

SERPAPI_KEY=your_serpapi_key
```

### Start the application with Docker

```bash
docker compose up --build
```

### Access the application

Frontend:

```text
http://localhost:4200
```

Backend:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui/index.html
```


## License
This project is available for educational and portfolio purposes.
