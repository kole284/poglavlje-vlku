using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend.Services;

public class BookService : IBookService
{
    private readonly AppDbContext _db;

    public BookService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Book>> GetAllBooksAsync()
    {
        return await _db.Books.AsNoTracking().ToListAsync();
    }

    public async Task<Book?> GetBookByIdAsync(int id)
    {
        return await _db.Books.FindAsync(id);
    }

    public async Task<Book> CreateBookAsync(Book book)
    {
        if (string.IsNullOrWhiteSpace(book.Title) || string.IsNullOrWhiteSpace(book.Author))
            throw new ArgumentException("Title and Author are required");

        var newBook = new Book
        {
            Title = book.Title,
            Author = book.Author,
            Description = book.Description,
            Price = book.Price,
            Stock = book.Stock,
            ImageUrl = book.ImageUrl
        };

        _db.Books.Add(newBook);
        await _db.SaveChangesAsync();
        return newBook;
    }

    public async Task<bool> UpdateBookAsync(int id, Book book)
    {
        var existing = await _db.Books.FindAsync(id);
        if (existing == null) return false;

        existing.Title = book.Title ?? existing.Title;
        existing.Author = book.Author ?? existing.Author;
        existing.Description = book.Description ?? existing.Description;
        existing.Price = book.Price;
        existing.Stock = book.Stock;
        existing.ImageUrl = book.ImageUrl ?? existing.ImageUrl;

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> PatchBookAsync(int id, JsonElement patch)
    {
        var existing = await _db.Books.FindAsync(id);
        if (existing == null) return false;

        if (patch.ValueKind != JsonValueKind.Object) return false;

        if (patch.TryGetProperty("title", out var titleProp) && titleProp.ValueKind == JsonValueKind.String)
            existing.Title = titleProp.GetString() ?? existing.Title;

        if (patch.TryGetProperty("author", out var authorProp) && authorProp.ValueKind == JsonValueKind.String)
            existing.Author = authorProp.GetString() ?? existing.Author;

        if (patch.TryGetProperty("description", out var descProp) && descProp.ValueKind == JsonValueKind.String)
            existing.Description = descProp.GetString() ?? existing.Description;

        if (patch.TryGetProperty("imageUrl", out var imgProp) && imgProp.ValueKind == JsonValueKind.String)
            existing.ImageUrl = imgProp.GetString() ?? existing.ImageUrl;

        if (patch.TryGetProperty("price", out var priceProp) && (priceProp.ValueKind == JsonValueKind.Number))
        {
            try { existing.Price = priceProp.GetDecimal(); } catch { /* ignore parse errors */ }
        }

        if (patch.TryGetProperty("stock", out var stockProp) && (stockProp.ValueKind == JsonValueKind.Number))
        {
            try { existing.Stock = stockProp.GetInt32(); } catch { /* ignore parse errors */ }
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBookAsync(int id)
    {
        var book = await _db.Books.FindAsync(id);
        if (book == null) return false;

        _db.Books.Remove(book);
        await _db.SaveChangesAsync();
        return true;
    }
}
