# Bookstore Application - Setup & Run Guide

## Project Structure

This is a full-stack bookstore application with a .NET backend and Next.js frontend.

### Backend (.NET 10)
- **Location**: `backend/`
- **Database**: SQLite (local)
- **Models**: `Book`, `Purchase`
- **Services**: `IBookService`, `IPurchaseService` with dependency injection
- **Controllers**: `BooksController`, `PurchasesController`
- **API Port**: `5002` (default)

### Frontend (Next.js)
- **Location**: `frontend/`
- **Framework**: Next.js 14+, React 18+, TypeScript
- **Styling**: SCSS modules
- **Storage**: localStorage for cart persistence
- **Dev Port**: `3000` (default)

## Features

### Admin Panel (`/admin`)
- Password-protected interface (default password: `admin`)
- Add new books with title, author, description, price, stock, and image URL
- Update existing books
- Delete books
- Real-time book grid display

### Order Page (`/order`)
- Browse all available books
- View book details (title, price, image)
- Add books to cart with single click

### Cart (`/cart`)
- View all items in cart
- Adjust quantities (+/- buttons)
- Remove items
- Complete purchase with buyer info (name, email)
- Automatic stock deduction on purchase

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
   ```powershell
   cd backend
   ```

2. Restore NuGet packages:
   ```powershell
   dotnet restore
   ```

3. Build the project:
   ```powershell
   dotnet build
   ```

4. Run the backend:
   ```powershell
   dotnet run
   ```

   - Backend starts on `https://localhost:5002`
   - SQLite database created automatically with sample data
   - Database file: `backend/bin/Debug/net10.0/bookstore.db`

### Frontend Setup

1. Navigate to frontend folder (from root):
   ```powershell
   cd frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env.local` file in `frontend/` directory:
   ```
   NEXT_PUBLIC_API_URL=https://localhost:5002
   ```

4. Run development server:
   ```powershell
   npm run dev
   ```

   - Frontend starts on `http://localhost:3000`
   - Browser opens automatically

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create new book (Admin)
- `PUT /api/books/{id}` - Update book (Admin)
- `DELETE /api/books/{id}` - Delete book (Admin)

### Purchases
- `POST /api/purchases` - Create purchase (decrements stock)
- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/{id}` - Get purchase by ID
- `GET /api/purchases/book/{bookId}` - Get purchases for specific book

## Usage Workflow

1. **Start Backend** → Start Frontend → Navigate to `http://localhost:3000`

2. **Add Books**:
   - Go to `/admin` page
   - Enter password: `admin`
   - Click "Dodaj novu knjizu" (Add new book)
   - Fill in form (title, author, price, stock, etc.)
   - Click "Kreiraj"

3. **Buy Books**:
   - Go to `/order` page
   - Browse available books
   - Click "Dodaj u korpu" (Add to cart) on desired books
   - Go to `/cart` page
   - Adjust quantities if needed
   - Enter buyer name and email
   - Click "Izvrši kupovinu" (Complete purchase)

4. **Manage Purchases**:
   - Stock automatically decreases when purchase completes
   - View all purchases in admin panel via API: `GET /api/purchases`

## Database

### SQLite Location
```
backend/bin/Debug/net10.0/bookstore.db
```

### Sample Data
Three sample books are seeded on first run:
- "Gospodar prstenova" by J.R.R. Tolkien
- "Harry Potter i Kamen mudrosti" by J.K. Rowling
- "Igra prestola" by George R.R. Martin

## Technologies Used

- **Backend**: .NET 10, Entity Framework Core 10.0.0, SQLite, ASP.NET Core Web API
- **Frontend**: Next.js 14+, React 18+, TypeScript, SCSS
- **Authentication**: Client-side password gate (localStorage)
- **HTTP**: Fetch API with CORS enabled
- **Styling**: Flexbox, CSS Grid, SCSS variables and mixins

## Troubleshooting

### CORS Errors
- Ensure backend is running on `https://localhost:5002`
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Backend has CORS enabled for all origins in development

### Port Already in Use
- Backend: Change port in `launchSettings.json`
- Frontend: Run with custom port:
  ```powershell
  npm run dev -- -p 3001
  ```

### Database Issues
- Delete `backend/bin/Debug/net10.0/bookstore.db` to reset
- Restart backend to recreate with sample data

## Notes

- Admin password stored in localStorage (`adminPassword` key)
- Cart items stored in localStorage (`cart` key)
- All styling uses SCSS variables (`$color-primary-light`, `$color-primary-dark`)
- Components use `'use client'` directive for client-side interactivity in Next.js
- No server-side authentication implemented (development mode)
