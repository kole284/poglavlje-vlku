using System;

if (args.Length == 0)
{
    Console.WriteLine("Usage: dotnet run --project tools/HashPassword -- <password>");
    return;
}

var password = args[0];
// Work factor 11
var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);
Console.WriteLine($"HASHED:{hash}");
