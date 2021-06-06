
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace AmuLab.Core.Helpers
{
    public static class MailHelper
    {
        public static void SendEmail(string toEmail, string subject, string body, List<Attachment> attachments = null)
        {
            var senderEmail = ConfigurationManager.AppSettings.Get("ServerMailUserName");
            var senderName = ConfigurationManager.AppSettings.Get("EmailSenderName");
            var replyTo = ConfigurationManager.AppSettings.Get("EmailReplyTo");
            var returnPath = ConfigurationManager.AppSettings.Get("EmailReturnPath");

            var mail = new MailModel
            {
                FromAddress = senderEmail,
                FromName = senderName,
                ReturnPath = returnPath,
                ReplyTo = replyTo,
                EnableSsl = ConfigurationManager.AppSettings.Get("ServerMailSSL").ToUpper() == "TRUE",
                Host = ConfigurationManager.AppSettings.Get("ServerMailHost"),
                Password = ConfigurationManager.AppSettings.Get("ServerMailPassword"),
                SmtpPort = int.Parse(ConfigurationManager.AppSettings.Get("ServerMailPort")),
                UserId = ConfigurationManager.AppSettings.Get("ServerMailUserName")
            };

            MailAddressCollection repliesTo = new MailAddressCollection();
            if (!string.IsNullOrEmpty(mail.ReplyTo))
            {
                repliesTo.Add(new MailAddress(mail.ReplyTo));
            }

            SendEmail(toEmail, subject, body, mail, attachments, repliesTo);
        }

        public static void SendEmail(string email, string subject, string body, MailModel mail, List<Attachment> attachments = null, MailAddressCollection repliesTo = null)
        {
            var client = new SmtpClient
            {
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = mail.EnableSsl,
                Host = mail.Host,
                Port = mail.SmtpPort,
                UseDefaultCredentials = mail.UseDefaultCredentials,
                //TargetName = 
            };

            if (!string.IsNullOrWhiteSpace(mail.UserId) && !string.IsNullOrWhiteSpace(mail.Password))
            {
                var credentials = new System.Net.NetworkCredential(mail.UserId, mail.Password);
                client.UseDefaultCredentials = false;
                client.Credentials = credentials;
            }

            var fromMailAddress = new MailAddress(mail.FromAddress, mail.FromName);
            var msg = new MailMessage { From = fromMailAddress };
            msg.To.Add(new MailAddress(email));

            if (!string.IsNullOrEmpty(mail.ReplyTo))
            {
                msg.ReplyToList.Add(new MailAddress(mail.ReplyTo));
            }

            if (!string.IsNullOrEmpty(mail.ReturnPath))
            {
                msg.Headers.Add("Return-Path", mail.ReturnPath);
            }

            msg.Subject = subject;
            msg.IsBodyHtml = true;
            msg.Body = body;
            if (repliesTo != null && repliesTo.Count > 0)
            {
                foreach (var reply in repliesTo)
                {
                    msg.ReplyToList.Add(reply);
                }
            }
            if (attachments != null && attachments.Count > 0)
            {
                foreach (var item in attachments)
                {
                    msg.Attachments.Add(item);
                }
            }

            client.Send(msg);
        }
    }
}
