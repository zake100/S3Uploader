using System.Collections.Generic;
using AmuLab.Core.Entities;
using Sort = AmuLab.Core.Models.Search.Sort;

namespace AmuLab.Utility
{
    public interface IElasticNestClient<T> where T: BaseEntity
    {
        List<int> Search(string rawQuery, out int total, int? offset = 0, int? limit = 10000, List<Sort> sorts = null, double minScore = 0.1d);
        bool Index(int id, string jsonStr, bool refresh = false);
        bool Update(int id, string jsonStr, bool refresh = false);
        bool Delete(int id, bool refresh = false);
        bool DeleteIndex(string indexName);
    }
}
