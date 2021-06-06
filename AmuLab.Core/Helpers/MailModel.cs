namespace AmuLab.Core.Helpers
{
    public class MailModel
    {
        public string FromName { get; set; }
        public string FromAddress { get; set; }
        public string ReplyTo { get; set; }
        public string ReturnPath { get; set; }
        public string UserId { get; set; }
        public string Password { get; set; }
        public int SmtpPort { get; set; }
        public string Host { get; set; }
        public bool EnableSsl { get; set; }
        public bool UseDefaultCredentials { get; set; } = true;
        public string TargetName { get; set; }
    }
}
