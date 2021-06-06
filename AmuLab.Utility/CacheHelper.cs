using System;
using System.Linq;

namespace AmuLab.Utility
{
    public class CacheHelper
    {
        public const string CACHE_KEY_COUNT_PRODUCT = "CountProduct";

        public static string BuildCacheKeySingle(Type type, object id)
        {
            return type.FullName + "." + id.ToString();
        }
        
        public static string BuildCacheKeySingle<T>(object id)
        {
            return BuildCacheKeySingle(typeof(T), id);
        }

        public static string BuildCacheKeyAllIds(Type type)
        {
            return type.FullName + "." + "AllIds";
        }

        public static string BuildCacheKeyAllIds<T>()
        {
            return BuildCacheKeyAllIds(typeof(T));
        }

        public static string BuildCacheKeyGetBy<T>(string key, object value)
        {
            return typeof(T).FullName + "GetBy" + key + "." + value;
        }

        public static string BuildCacheKeyGetBy<T>(string key)
        {
            return typeof(T).FullName + "." + key;
        }

        public static string BuildImageCacheKeyByUrl(string url)
        {
            var key = string.Empty;
            var keyComponents = url.Replace("http://", string.Empty).Replace("//", "/").Split('/');

            return keyComponents.Aggregate(key, (current, component) => current + string.Format("_{0}", component));
        }

        public static string BuildCacheKeyForTokenLogin(int id)
        {
            return "TokenLoginForUserId." + id;
        }
    }
}
