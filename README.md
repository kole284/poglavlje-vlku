# Poglavlje Vlku

This repository is published as a **showcase/demo project** for viewing code and architecture.

It was originally built as a client project, and this public version is **not intended for production deployment**.

Monorepo for an online bookstore with:
- a Next.js frontend application
- an ASP.NET Core backend API
- an SQLite database
- optional Docker/Nginx setup for local demonstration

## Technologies

- Frontend: Next.js 16, React 19, TypeScript, Sass
- Backend: ASP.NET Core (.NET 10), EF Core, JWT auth, MailKit
- Database: SQLite
- Local demo: Docker, Docker Compose, Nginx

## Project Structure

```
.
|- frontend/        # Next.js application
|- backend/         # ASP.NET Core Web API
|- nginx/           # Nginx config and SSL mount
|- docker-compose.yml
`- poglavlje-vlku.sln
```

## Important Context

- This repo is for portfolio/review purposes.
- It may contain simplifications, hardcoded assumptions, and non-production defaults.
- No production support or SLA is provided.

## Requirements

For local demo/development without Docker:
- Node.js 20+
- npm 10+
- .NET SDK 10

For containerized local run:
- Docker
- Docker Compose

## Quick Start (Local, without Docker)

### 1) Backend

From the project root:

```bash
cd backend
cp .env.example .env
dotnet restore
dotnet run
```

Backend default URL:
- http://localhost:5002

### 2) Frontend

In a new terminal, from the project root:

```bash
cd frontend
cp .env.example .env.production
npm install
npm run dev
```

Frontend default URL:
- http://localhost:3000

Note:
- In `frontend/.env.production`, set `NEXT_PUBLIC_API_URL` to the backend API, for example `http://localhost:5002/api`.

## Optional Docker Demo

From the project root:

```bash
docker compose up -d --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5002
- Nginx: http://localhost and https://localhost

For logs:

```bash
docker compose logs -f
```

To stop:

```bash
docker compose down
```

## Environment Variables

### Backend (`backend/.env`)

Use `backend/.env.example` as a template. Keys you should verify:
- SMTP configuration (`SMTP_*`)
- JWT (`Jwt__Secret`, `Jwt__Issuer`, `Jwt__Audience`)
- Admin credentials (`Admin__Username`, `Admin__Password`)
- `CONNECTION_STRING`

### Frontend (`frontend/.env.production`)

Use `frontend/.env.example` as a template:
- `NEXT_PUBLIC_API_URL`

## API Overview

Main routes:
- `POST /api/auth/login`
- `GET /api/books`
- `GET /api/books/{id}`
- `POST /api/books` (Admin JWT)
- `PUT /api/books/{id}` (Admin JWT)
- `PATCH /api/books/{id}` (Admin JWT)
- `DELETE /api/books/{id}` (Admin JWT)
- `POST /api/purchases`
- `GET /api/purchases`
- `GET /api/purchases/{id}`
- `GET /api/purchases/book/{bookId}`
- `GET /api/images`
- `POST /api/images/bulk`

## Build Commands

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
cd backend
dotnet build
dotnet run
```

## Notes

- This code is shared for inspection and demonstration.
- If you fork it for real-world use, review security, auth, secrets handling, and deployment hardening first.
- Never commit real secrets (`.env`, SMTP password, JWT secret).

## Additional

- Solution file: `poglavlje-vlku.sln`
- Hash helper tool for admin password: `tools/HashPassword`
