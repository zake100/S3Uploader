using System.Net.Mail;
using AmuLab.Core.Models;

namespace AmuLab.Utility
{
    public static class MailHelper
    {
        public static void SendEmail(string email, string subject, string body, MailModel mail)
        {
            var client = new SmtpClient
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = mail.EnableSsl,
                Host = mail.Host,
                Port = mail.SmtpPort
            };
            var credentials = new System.Net.NetworkCredential(mail.UserId, mail.Password);
            client.UseDefaultCredentials = false;
            client.Credentials = credentials;
            var msg = new MailMessage { From = new MailAddress(mail.FromAddress) };
            msg.To.Add(new MailAddress(email));

            msg.Subject = subject;
            msg.IsBodyHtml = true;
            msg.Body = body;

            client.Send(msg);
        }
    }
}
