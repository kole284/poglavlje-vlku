using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace backend.Services;

public class PurchaseService : IPurchaseService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IEmailService _emailService;

    public PurchaseService(AppDbContext db, IConfiguration config, IEmailService emailService)
    {
        _db = db;
        _config = config;
        _emailService = emailService;
    }

    public async Task<List<Purchase>> GetAllPurchasesAsync()
    {
        return await _db.Purchases.Include(p => p.Book).ToListAsync();
    }

    public async Task<Purchase?> GetPurchaseByIdAsync(int id)
    {
        return await _db.Purchases.Include(p => p.Book).FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Purchase> CreatePurchaseAsync(int bookId, int quantity, string? buyerName, string? buyerEmail,
        string? street = null, string? houseNumber = null, string? apartment = null,
        string? municipality = null, string? city = null, string? zip = null, string? phone = null,
        decimal? totalPrice = null)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be at least 1");

        var book = await _db.Books.FindAsync(bookId);
        if (book == null)
            throw new KeyNotFoundException("Book not found");

        if (book.Stock < quantity)
            throw new InvalidOperationException("Not enough stock");

        book.Stock -= quantity;

        var purchase = new Purchase
        {
            BookId = book.Id,
            Quantity = quantity,
            TotalPrice = totalPrice ?? (book.Price * quantity),
            BuyerName = buyerName,
            BuyerEmail = buyerEmail,
            Street = street,
            HouseNumber = houseNumber,
            Apartment = apartment,
            Municipality = municipality,
            City = city,
            Zip = zip,
            Phone = phone
        };

        _db.Purchases.Add(purchase);
        await _db.SaveChangesAsync();

        // send notification email (best-effort) via IEmailService
        try
        {
            await _emailService.SendPurchaseNotificationAsync(purchase);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Failed to send purchase notification email: " + ex.Message);
        }

        return purchase;
    }

    public async Task<List<Purchase>> GetPurchasesByBookIdAsync(int bookId)
    {
        return await _db.Purchases.Where(p => p.BookId == bookId).Include(p => p.Book).ToListAsync();
    }
}
