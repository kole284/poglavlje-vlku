using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using backend.Models;

namespace backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly SmtpOptions _opts;

        public EmailService(IOptions<SmtpOptions> opts)
        {
            _opts = opts.Value;
        }

        public async Task SendPurchaseNotificationAsync(Purchase purchase)
        {
            if (string.IsNullOrEmpty(_opts?.To)) return;

            var msg = new MimeMessage();
            var from = string.IsNullOrEmpty(_opts.From) ? "no-reply@local" : _opts.From;
            msg.From.Add(MailboxAddress.Parse(from));
            msg.To.Add(MailboxAddress.Parse(_opts.To));
            msg.Subject = $"Nova narudžbina #{purchase.Id}";

            var sb = new StringBuilder();
            sb.AppendLine($"Knjiga ID: {purchase.BookId}");
            sb.AppendLine($"Količina: {purchase.Quantity}");
            sb.AppendLine($"Ime: {purchase.BuyerName}");
            sb.AppendLine($"Email: {purchase.BuyerEmail}");
            sb.AppendLine($"Ulica: {purchase.Street} {purchase.HouseNumber}");
            sb.AppendLine($"Stan: {purchase.Apartment}");
            sb.AppendLine($"Opština: {purchase.Municipality}");
            sb.AppendLine($"Grad: {purchase.City}");
            sb.AppendLine($"Poštanski broj: {purchase.Zip}");
            sb.AppendLine($"Telefon: {purchase.Phone}");
            sb.AppendLine($"Ukupno: {purchase.TotalPrice}");
            sb.AppendLine($"Datum: {purchase.PurchasedAt:u}");

            var body = sb.ToString();

            msg.Body = new TextPart("plain") { Text = body };

            using var client = new SmtpClient();
            try
            {
                var secure = _opts.EnableSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.Auto;
                await client.ConnectAsync(_opts.Host ?? "localhost", _opts.Port, secure);
                if (!string.IsNullOrEmpty(_opts.Username))
                {
                    await client.AuthenticateAsync(_opts.Username, _opts.Password ?? string.Empty);
                }
                await client.SendAsync(msg);
                await client.DisconnectAsync(true);
            }
            catch (System.Exception ex)
            {
                // log details to help diagnose delivery problems (won't break purchase flow)
                try { Console.WriteLine("Email send failed: " + ex.Message); Console.WriteLine(ex.ToString()); } catch { }
            }
        }
    }
}
