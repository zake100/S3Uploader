using AmuLab.Core.Models;

namespace AmuLab.Utility
{
    public class TokenHelper
    {
        private readonly RedisCacheClient CacheClient;

        public TokenHelper()
        {
            CacheClient = new RedisCacheClient();
        }

        //public string GetToken(int id)
        //{
        //    string cacheKey = CacheHelper.BuildCacheKeyForTokenLogin(id);
        //    var results = CacheClient.Get<TokenModel>(cacheKey);
        //    if (results == null)
        //    {
        //        return null;
        //    }
        //    return results.Token;
        //}

        //public void SetToken(int id, string token)
        //{
        //    string cacheKey = CacheHelper.BuildCacheKeyForTokenLogin(id);
        //    CacheClient.Remove(cacheKey);
        //    var tokenKey = new TokenModel
        //    {
        //        UserId = id,
        //        Token = token
        //    };
        //    CacheClient.Set(cacheKey, tokenKey);
        //}
    }
}
