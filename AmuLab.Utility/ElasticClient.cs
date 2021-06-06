using System;
using System.Configuration;

namespace AmuLab.Utility
{
    public class ElasticClient : IElasticClient
    {
        public string GetUrl(string uri = "/")
        {
            return ConfigurationManager.AppSettings["ElasticSearch_Hosts"] + "/" + ConfigurationManager.AppSettings["MQIndex"] + uri;
        }

        public string GetNameUrl()
        {
            return ConfigurationManager.AppSettings["ElasticSearch_Hosts"];
        }

        public string GetNameIndex()
        {
            return ConfigurationManager.AppSettings["MQIndex"];
        }

        public string Search(string type, string parameters)
        {
            return HttpSingle(type + "/_search", parameters, "POST");
        }

        public string HttpSingle(string uri, string parameters, string method)
        {
            var req = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(GetUrl() + uri);
            req.ContentType = "application/x-www-form-urlencoded";
            req.Accept = "application/json";
            req.Method = method;
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(parameters);
            req.ContentLength = bytes.Length;
            try
            {
                System.IO.Stream os = req.GetRequestStream();
                os.Write(bytes, 0, bytes.Length);
                os.Close();
                System.Net.WebResponse resp = req.GetResponse();
                if (resp == null) return "{\"hits\": {\"total\": 0,\"hits\": [ ]}}";
                System.IO.StreamReader sr = new System.IO.StreamReader(resp.GetResponseStream());
                return sr.ReadToEnd().Trim();
            }
            catch (Exception)
            {
                return "{\"hits\": {\"total\": 0,\"hits\": [ ]}}";
            }
        }
    }
}
