namespace backend.Services
{
    public class SmtpOptions
    {
        public string? Host { get; set; }
        public int Port { get; set; } = 25;
        public bool EnableSsl { get; set; } = false;
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? From { get; set; }
        public string? To { get; set; }
    }
}
