using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchasesController : ControllerBase
{
    private readonly IPurchaseService _purchaseService;

    public PurchasesController(IPurchaseService purchaseService)
    {
        _purchaseService = purchaseService;
    }

    public class PurchaseRequest
    {
        public int BookId { get; set; }
        public int Quantity { get; set; } = 1;
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
        public string? Street { get; set; }
        public string? HouseNumber { get; set; }
        public string? Apartment { get; set; }
        public string? Municipality { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
        public string? Phone { get; set; }
        public decimal? TotalPrice { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PurchaseRequest req)
    {
        if (req == null) return BadRequest();
        try
        {
            var purchase = await _purchaseService.CreatePurchaseAsync(
                req.BookId,
                req.Quantity,
                req.BuyerName,
                req.BuyerEmail,
                req.Street,
                req.HouseNumber,
                req.Apartment,
                req.Municipality,
                req.City,
                req.Zip,
                req.Phone,
                req.TotalPrice
            );
            return CreatedAtAction(nameof(Get), new { id = purchase.Id }, purchase);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var p = await _purchaseService.GetPurchaseByIdAsync(id);
        if (p == null) return NotFound();
        return Ok(p);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _purchaseService.GetAllPurchasesAsync();
        return Ok(items);
    }

    [HttpGet("book/{bookId:int}")]
    public async Task<IActionResult> GetByBook(int bookId)
    {
        var items = await _purchaseService.GetPurchasesByBookIdAsync(bookId);
        return Ok(items);
    }
}
