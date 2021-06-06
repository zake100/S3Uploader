namespace AmuLab.Utility
{
    public interface IElasticClient
    {
        string GetUrl(string uri = "/");
        string GetNameUrl();
        string GetNameIndex();
        string Search(string type, string parameters);
        string HttpSingle(string uri, string parameters, string method);
    }
}
