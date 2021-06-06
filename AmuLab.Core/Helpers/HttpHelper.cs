using System;
using System.IO;

namespace AmuLab.Core.Helper
{
    public class HttpHelper
    {
        public static string SendRequest(string url, string parameters, string method)
        {
            try
            {
                var req = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
                req.ContentType = "application/x-www-form-urlencoded";
                req.Accept = "application/json";
                req.Method = method;
                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(parameters);
                req.ContentLength = bytes.Length;
                Stream os = req.GetRequestStream();
                os.Write(bytes, 0, bytes.Length);
                os.Close();

                using (var response = req.GetResponse())
                {
                    if (response == null)
                        return string.Empty;
                    var reader = new StreamReader(response.GetResponseStream());
                    var results = reader.ReadToEnd();

                    response.Close();
                    response.Dispose();

                    return results;
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        
        public static string Post(string url, string parameters)
        {
            return SendRequest(url, parameters, "POST");
        }
    }
}
