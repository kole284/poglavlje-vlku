using backend.Models;

namespace backend.Services;

public interface IPurchaseService
{
    Task<List<Purchase>> GetAllPurchasesAsync();
    Task<Purchase?> GetPurchaseByIdAsync(int id);
    Task<Purchase> CreatePurchaseAsync(int bookId, int quantity, string? buyerName, string? buyerEmail,
        string? street = null, string? houseNumber = null, string? apartment = null,
        string? municipality = null, string? city = null, string? zip = null, string? phone = null,
        decimal? totalPrice = null);
    Task<List<Purchase>> GetPurchasesByBookIdAsync(int bookId);
}
