using backend.Models;

namespace backend.Services;

public interface IBookService
{
    Task<List<Book>> GetAllBooksAsync();
    Task<Book?> GetBookByIdAsync(int id);
    Task<Book> CreateBookAsync(Book book);
    Task<bool> UpdateBookAsync(int id, Book book);
    Task<bool> PatchBookAsync(int id, System.Text.Json.JsonElement patch);
    Task<bool> DeleteBookAsync(int id);
}
