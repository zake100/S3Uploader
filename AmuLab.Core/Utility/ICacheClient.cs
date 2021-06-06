using System.Collections.Generic;

namespace AmuLab.Core.Utility
{
    public interface ICacheClient
    {
        T Get<T>(string key);

        bool Set(string key, object o);

        IDictionary<string, T> GetAll<T>(IEnumerable<string> keys);

        bool Exists(string key);

        bool Remove(string key);

        void RemoveAll(IEnumerable<string> keys);
        void FlushDb();
        void SetIsUseRedis(bool isUserRedis);
    }
}
