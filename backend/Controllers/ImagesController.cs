using backend.Data;
using backend.Models; // Proveri da li je ovde tvoja Images klasa
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ImagesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/images
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var images = await _context.Images.ToListAsync();
        return Ok(images);
    }

    // POST: api/images/bulk
    [HttpPost("bulk")]
    public async Task<IActionResult> PostImagesBulk([FromBody] List<Images> images)
    {
        if (images == null || !images.Any())
        {
            return BadRequest("Lista slika je prazna.");
        }

        _context.Images.AddRange(images);
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Uspešno dodato {images.Count} slika." });
    }
}