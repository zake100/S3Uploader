using Elasticsearch.Net.ConnectionPool;
using AmuLab.Core.Constants;
using AmuLab.Core.Entities;
using AmuLab.Core.Enums;
using Nest;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Sort = AmuLab.Core.Models.Search.Sort;

namespace AmuLab.Utility
{
    public class ElasticNestClient<T>: IElasticNestClient<T> where T: BaseEntity
    {
        private readonly string _elasticSearchHost = ConfigurationManager.AppSettings["ElasticSearch_Hosts"];
        private readonly string _elasticDefaultIndex = ConfigurationManager.AppSettings["MQIndex"];


        public ElasticNestClient()
        {
            //GetClient();
        }
        private Nest.ElasticClient GetClient()
        {
            if (string.IsNullOrEmpty(_elasticSearchHost))
                throw new ArgumentException("");

            var serverAddresses = _elasticSearchHost.Split(',');

            if (!serverAddresses.Any())
                throw new ArgumentException("");

            var sourceConnectionPool = new SniffingConnectionPool(serverAddresses.Select(p => new Uri(p)));
            var sourceConnectionSetting = new ConnectionSettings(sourceConnectionPool, _elasticDefaultIndex);
            return new Nest.ElasticClient(sourceConnectionSetting);
        }

        public List<int> Search(string rawQuery, out int total, int? offset = 0, int? limit = 10000, List<Sort> sorts = null, double minScore = 0.1d)
        {
            var dynamicSearchConditions = new SearchDescriptor<T>();

            dynamicSearchConditions.Fields(f => f.Id);
            dynamicSearchConditions.QueryRaw(rawQuery);
            dynamicSearchConditions.MinScore(minScore);
            dynamicSearchConditions.From(offset ?? 0);
            dynamicSearchConditions.Size(limit ?? 10000);

            if (sorts != null && sorts.Count > 0)
            {
                foreach (var sort in sorts)
                {
                    switch (sort.SortType)
                    {
                        case SortType.Asc:
                            dynamicSearchConditions.SortAscending(sort.SortOnField);
                            break;
                        case SortType.Desc:
                            dynamicSearchConditions.SortDescending(sort.SortOnField);
                            break;
                        case SortType.Nested:
                            dynamicSearchConditions.Sort(
                                p =>
                                    p.OnField(sort.SortOnField)
                                        .NestedSum()
                                        .NestedFilter(f => f.Term(sort.NestedField, sort.NestedFilterValue)));
                            break;
                        default:
                            break;
                    }
                }
            }

            var matchedResults = GetClient().Search<T>(s => dynamicSearchConditions);
            var machedObjectIds = new List<int>();

            total = (int)matchedResults.Total;
            machedObjectIds.AddRange(matchedResults.Hits.Select(hit => int.Parse(hit.Id)));

            return machedObjectIds;
        }

        public bool Index(int id, string jsonStr, bool refresh = false)
        {
            var statusCode = GetClient().Raw.Index(_elasticDefaultIndex, typeof(T).Name.ToLower(), id.ToString(), jsonStr, r => r.Refresh(refresh));
            return statusCode.Success;
        }

        public bool Update(int id, string jsonStr, bool refresh = false)
        {
            var statusCode = GetClient().Raw.Update(_elasticDefaultIndex, typeof(T).Name.ToLower(), id.ToString(), jsonStr, r => r.Refresh(refresh));
            return statusCode.Success;
        }

        public bool Delete(int id, bool refresh = false)
        {
            var statusCode = GetClient().Delete(_elasticDefaultIndex, typeof(T).Name.ToLower(), id.ToString(), r => r.Refresh(refresh));
            
            return statusCode.Found;
        }
        public bool DeleteIndex(string indexName)
        {

            var statusCode = GetClient().DeleteIndex(indexName);
            return statusCode.Acknowledged;
        }
        
    }
}
