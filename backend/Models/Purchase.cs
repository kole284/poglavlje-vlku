using System;
using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Purchase
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string? BuyerName { get; set; }
        public string? BuyerEmail { get; set; }
        [JsonPropertyName("address")]
        public string? BuyerAdress { get; set; }

        [JsonPropertyName("street")]
        public string? Street { get; set; }

        [JsonPropertyName("houseNumber")]
        public string? HouseNumber { get; set; }

        [JsonPropertyName("apartment")]
        public string? Apartment { get; set; }

        [JsonPropertyName("municipality")]
        public string? Municipality { get; set; }

        [JsonPropertyName("city")]
        public string? City { get; set; }

        [JsonPropertyName("zip")]
        public string? Zip { get; set; }

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }

        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;

        // navigation
        public Book? Book { get; set; }
    }
}
