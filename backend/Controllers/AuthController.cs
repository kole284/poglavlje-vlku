using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Get admin credentials from configuration
        var adminPassword = _configuration["Admin:Password"] ?? "admin";
        var adminUsername = _configuration["Admin:Username"] ?? "admin";

        // Verify credentials
        if (request.Username != adminUsername || !VerifyPassword(request.Password, adminPassword))
        {
            return Unauthorized(new { message = "Pogrešno korisničko ime ili lozinka." });
        }

        // Generate JWT token
        var token = GenerateJwtToken(adminUsername);
        
        return Ok(new { 
            token = token,
            message = "Uspešna prijava."
        });
    }

    private bool VerifyPassword(string inputPassword, string storedPassword)
    {
        // If stored password starts with "HASHED:", it's a bcrypt hash
        if (storedPassword.StartsWith("HASHED:"))
        {
            var hash = storedPassword.Substring(7);
            return BCrypt.Net.BCrypt.Verify(inputPassword, hash);
        }
        
        // Otherwise, plain text comparison (for backward compatibility, but not recommended)
        return inputPassword == storedPassword;
    }

    private string GenerateJwtToken(string username)
    {
        var jwtSecret = _configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");
        var jwtIssuer = _configuration["Jwt:Issuer"] ?? "PoglavljeVlku";
        var jwtAudience = _configuration["Jwt:Audience"] ?? "PoglavljeVlkuAdmin";

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
