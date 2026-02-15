using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;

    public BooksController(IBookService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _bookService.GetAllBooksAsync();
        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var book = await _bookService.GetBookByIdAsync(id);
        if (book == null) return NotFound();
        return Ok(book);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Book input)
    {
        if (input == null) return BadRequest();
        try
        {
            var book = await _bookService.CreateBookAsync(input);
            return CreatedAtAction(nameof(Get), new { id = book.Id }, book);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] Book input)
    {
        var success = await _bookService.UpdateBookAsync(id, input);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Patch(int id, [FromBody] JsonElement patch)
    {
        if (patch.ValueKind == JsonValueKind.Undefined || patch.ValueKind == JsonValueKind.Null)
            return BadRequest("Invalid patch body");

        var success = await _bookService.PatchBookAsync(id, patch);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _bookService.DeleteBookAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
