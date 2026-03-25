# poglavlje-vlku

## Overview

`poglavlje-vlku` is a comprehensive full-stack web application designed for managing and selling books, featuring robust authentication, image handling, and purchase functionalities. This project is built with a modern technology stack, separating the concerns into a powerful C#/.NET backend API and a dynamic Next.js/React frontend. The entire application is containerized using Docker, ensuring easy setup, deployment, and scalability.

## Key Features & Benefits

### Features

*   **User Authentication:** Secure user registration, login, and authorization through the C# backend.
*   **Book Management:** Full CRUD (Create, Read, Update, Delete) operations for books, including details like title, author, description, and price.
*   **Image Handling:** Dedicated API endpoints for managing and serving images associated with books or other content.
*   **Purchase Functionality:** API endpoints to facilitate the purchasing process, likely involving order creation and tracking.
*   **Modern Frontend:** A responsive and interactive user interface developed with Next.js and React, providing a seamless user experience.
*   **Robust Backend:** A high-performance and scalable API layer built with C# and ASP.NET Core, utilizing Entity Framework Core for data persistence.
*   **Containerized Deployment:** Both frontend and backend are Dockerized, allowing for consistent development, testing, and production environments.

### Benefits

*   **Scalable Architecture:** The decoupled frontend and backend, combined with containerization, allows for independent scaling of services.
*   **Rapid Development:** Leveraging Next.js for the frontend and .NET Core for the backend enables efficient development cycles.
*   **Ease of Deployment:** Docker and Docker Compose simplify the deployment process across various environments.
*   **Clear Separation of Concerns:** A well-defined API boundary between frontend and backend promotes maintainability and allows for independent team development.
*   **Cross-Platform Compatibility:** Built with technologies that are inherently cross-platform, offering flexibility in development and deployment environments.

## Technologies Used

The `poglavlje-vlku` project leverages a modern and robust technology stack:

*   **Backend:**
    *   **Language:** C#
    *   **Framework:** ASP.NET Core (implied by .NET SDK, Controllers, and `AppDbContext`)
    *   **Database:** SQLite (implied by `mkdir -p /app/data` in backend Dockerfile)
    *   **ORM:** Entity Framework Core
*   **Frontend:**
    *   **Language:** TypeScript
    *   **Frameworks:** Next.js, React
    *   **Styling:** Sass (from `package.json`)
*   **DevOps & Tools:**
    *   **Containerization:** Docker
    *   **Runtime Environment:** Node.js

## Prerequisites & Dependencies

To get this project up and running, you'll need the following installed on your system:

*   **Git:** For cloning the repository.
*   **Docker & Docker Compose:** For building and running the application in containers (recommended).
    *   [Install Docker](https://docs.docker.com/get-docker/)
    *   [Install Docker Compose](https://docs.docker.com/compose/install/)

### For Manual Development (without Docker)

If you prefer to run the services directly outside of Docker:

*   **Backend Development:**
    *   [.NET SDK 10.0](https://dotnet.microsoft.com/download) (or a compatible version as specified in `backend/Dockerfile`)
*   **Frontend Development:**
    *   [Node.js 20.x](https://nodejs.org/en/download/) (LTS recommended)
    *   npm (comes with Node.js), or yarn/pnpm/bun.

## Installation & Setup Instructions

The easiest way to get `poglavlje-vlku` running is by using Docker Compose.

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/kole284/poglavlje-vlku.git
cd poglavlje-vlku
```

### 2. Configure Environment Variables

#### Backend

Create a `.env` file for the backend service by copying the example and filling in the necessary details (e.g., database connection string, JWT secrets).

```bash
cp backend/.env.example backend/.env
# Open backend/.env and configure as needed
```

#### Frontend

While the Docker Compose setup handles passing the API URL, for local development or if running the frontend separately, you might need a `.env.local` file:

```bash
cp frontend/.env.local.example frontend/.env.local
# Open frontend/.env.local and configure (e.g., NEXT_PUBLIC_API_URL=http://localhost:8080)
```
*(Note: An `frontend/.env.local.example` was not explicitly provided, but is a common Next.js practice for local environment variables.)*

### 3. Build and Run with Docker Compose (Recommended)

Navigate to the root of the project directory where the `docker-compose.yml` (example provided below) would reside.

```yaml
# A possible docker-compose.yml structure (create this file in the project root)
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080" # Map host port 8080 to container port 8080
    volumes:
      - ./backend/data:/app/data # Persist SQLite database to host
    env_file:
      - ./backend/.env
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000" # Map host port 3000 to container port 3000
    environment:
      # This variable tells the frontend where to find the backend API within the Docker network
      NEXT_PUBLIC_API_URL: http://backend:8080
    depends_on:
      - backend
    restart: always
```

Then, execute the following command to build the Docker images and start the services:

```bash
docker compose up --build
```

This command will:
*   Build the `backend` image using `backend/Dockerfile`.
*   Build the `frontend` image using `frontend/Dockerfile`.
*   Start both services. The backend will be accessible on `http://localhost:8080` and the frontend on `http://localhost:3000`.

### 4. Manual Setup (Alternative for Developers)

If you prefer to run the backend and frontend services independently:

#### Backend Setup

```bash
cd backend

# Restore .NET dependencies
dotnet restore

# Apply database migrations (for initial setup or updates)
dotnet ef database update

# Run the backend application
dotnet run
```
The backend API should now be running, typically on `http://localhost:5000` or `http://localhost:5001` (HTTPS) depending on your `launchSettings.json` and `Program.cs` configuration. Adjust the frontend's API URL accordingly.

#### Frontend Setup

```bash
cd frontend

# Install Node.js dependencies
npm install # or yarn install, pnpm install, bun install

# Start the development server
npm run dev # or yarn dev, pnpm dev, bun dev
```
The frontend development server will start, usually on `http://localhost:3000`. It will hot-reload changes as you modify files.

## Usage Examples

### Accessing the Frontend

Once the application is running (either via Docker Compose or manually), open your web browser and navigate to:

```
http://localhost:3000
```
You can start interacting with the application, browsing books, authenticating users, and making purchases.

### Interacting with the Backend API

The backend exposes several API endpoints. You can use tools like Postman, Insomnia, or curl to test them.
Common endpoints based on the controllers include:

*   `http://localhost:8080/api/auth` (for user authentication)
*   `http://localhost:8080/api/books` (for book management)
*   `http://localhost:8080/api/images` (for image uploads/retrieval)
*   `http://localhost:8080/api/purchases` (for purchase operations)

*(Note: Specific routes and request/response formats would be detailed in a separate API documentation or discoverable via Swagger/OpenAPI if implemented in the backend.)*

## Configuration Options

### Backend Configuration (`backend/.env`)

The backend service uses environment variables for sensitive or environment-specific configurations. The `backend/.env` file (not checked into version control) should contain:

*   **Database Connection String:** For SQLite, this might specify the path to the database file (e.g., `ConnectionStrings__DefaultConnection=Data Source=/app/data/poglavlje-vlku.db`).
*   **JWT Secret:** A strong, randomly generated string used for signing JSON Web Tokens for authentication (e.g., `Jwt__Key=YOUR_SUPER_SECRET_KEY`).
*   **Other API Settings:** Any other custom settings for the backend application.

### Frontend Configuration (`frontend/.env.local` & `frontend/next.config.ts`)

*   **Environment Variables (`frontend/.env.local`):**
    *   `NEXT_PUBLIC_API_URL`: The base URL of the backend API (e.g., `http://localhost:8080`). This prefix `NEXT_PUBLIC_` makes the variable accessible on the client side.
*   **Next.js Configuration (`frontend/next.config.ts`):**
    The `frontend/next.config.ts` file allows for advanced Next.js configuration, such as custom headers, image optimization domains, rewrites, and more.

    ```typescript
    import type { NextConfig } from "next";

    const nextConfig: NextConfig = {
      // Example: Allow images from specific domains
      images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost', // Or your image server hostname
            port: '8080', // If images are served from backend
            pathname: '/images/**',
          },
        ],
      },
      // Other Next.js configurations
    };

    export default nextConfig;
    ```

### Deployment Considerations (Nginx)

The presence of `auto-fix-nginx.sh` suggests that Nginx is intended for use in production deployments, likely acting as a reverse proxy, load balancer, or for serving static files. This script might automate the configuration of Nginx for the `poglavlje-vlku` application. Further details on Nginx setup would typically be provided in a separate deployment guide.

## Contributing Guidelines

We welcome contributions to `poglavlje-vlku`! If you'd like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  **Make your changes**, ensuring they adhere to the existing code style.
4.  **Write clear, concise commit messages.**
5.  **Test your changes thoroughly.**
6.  **Push your branch** to your forked repository.
7.  **Open a Pull Request** to the `main` branch of the original repository, describing your changes and their benefits.

## License Information

This project currently does not have an explicit license specified. Please contact the repository owner, kole284, for licensing information.

## Acknowledgments

*   Built with [Next.js](https://nextjs.org) and [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
*   Powered by [.NET](https://dotnet.microsoft.com/) and Microsoft technologies.
*   Leverages the power of [Docker](https://www.docker.com/) for containerization.
