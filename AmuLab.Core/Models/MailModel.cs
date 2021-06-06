using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmuLab.Core.Models
{
    public class MailModel
    {
        public string FromAddress { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public int SmtpPort { get; set; }
        public string Host { get; set; }
        public bool EnableSsl { get; set; }
    }
}
