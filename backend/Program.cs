using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Add JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret must be configured");
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "PoglavljeVlku";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "PoglavljeVlkuAdmin";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };
});

builder.Services.AddAuthorization();

// Add EF Core with SQLite (embedded DB file for local development)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Sqlite") ?? "Data Source=books.db"));

// Add services
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();

// Email service and SMTP options
builder.Services.AddSingleton<IEmailService, EmailService>();
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(p => p.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseHttpsRedirection();

// Add authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database exists and seed initial data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Runtime dev DB migration: ensure Purchases table has expected columns
    try
    {
        var conn = db.Database.GetDbConnection();
        conn.Open();
        using (var cmd = conn.CreateCommand())
        {
            cmd.CommandText = "PRAGMA table_info('Purchases');";
            var existing = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            using (var rdr = cmd.ExecuteReader())
            {
                while (rdr.Read())
                {
                    // column name is at index 1
                    existing.Add(rdr.GetString(1));
                }
            }

            var toAdd = new (string Name, string Type)[] {
                ("BuyerAdress", "TEXT"),
                ("Municipality", "TEXT"),
                ("City", "TEXT"),
                ("Zip", "TEXT"),
                ("Phone", "TEXT"),
                ("TotalPrice", "REAL")
            };

            // also ensure new address split fields exist
            var toAdd2 = new (string Name, string Type)[] {
                ("Street", "TEXT"),
                ("HouseNumber", "TEXT"),
                ("Apartment", "TEXT")
            };

            foreach (var col in toAdd.Concat(toAdd2))
            {
                if (!existing.Contains(col.Name))
                {
                    using var addCmd = conn.CreateCommand();
                    addCmd.CommandText = $"ALTER TABLE Purchases ADD COLUMN {col.Name} {col.Type};";
                    addCmd.ExecuteNonQuery();
                }
            }
        }
        conn.Close();
    }
    catch (Exception ex)
    {
        Console.WriteLine("Runtime DB migration failed: " + ex.Message);
    }

    if (!db.Books.Any())
    {
        db.Books.AddRange(
            new Book { Title = "Bogati?r", Author = "Stefan Bakić", Description = "Prva knjiga", Price = 900m, Stock = 10, ImageUrl = "/images/bogatir.jpg" },
            new Book { Title = "Druga knjiga", Author = "Autor", Description = "Opis", Price = 1200m, Stock = 4, ImageUrl = "/images/book2.jpg" },
            new Book { Title = "Tre?a knjiga", Author = "Autor 3", Description = "Opis 3", Price = 700m, Stock = 6 }
        );
        db.SaveChanges();
    }
}

app.Run();