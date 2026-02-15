using System.Threading.Tasks;
using backend.Models;

namespace backend.Services
{
    public interface IEmailService
    {
        Task SendPurchaseNotificationAsync(Purchase purchase);
    }
}
