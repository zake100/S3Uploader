using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using AmuLab.Core.Entities;

namespace AmuLab.Core.Repository
{
    public interface IBaseRepository<TE> where TE : BaseEntity
    {
        IEnumerable<TE> GetAll();
        TE GetById(long id);
        IList<TE> GetById(IList<long> id);
        bool Update(TE entity);
        long Add(TE entity);
        long Add(TE entity, SqlConnection sqlConnection, IDbTransaction transaction);
        bool Update(TE entity, SqlConnection sqlConnection, IDbTransaction transaction);
        bool Delete(TE entity);
        void Query(string sql);
        void FlushCache();
        IEnumerable<T> QueryStoreProcedure<T>(string storedProcedure, dynamic param = null,
            dynamic outParam = null, SqlTransaction transaction = null,
            bool buffered = true, int? commandTimeout = null,
            string connectionString = null);
        int ExecuteStoredProcedure(string storedName, object param);
        IEnumerable<T> QueryStore<T>(string storedProcedure, object param = null);
        void ClearCacheSingle(long entityId);
        void SetRedisCache(bool isUse);
        void ClearCacheKeyAllId();
        List<TE> GetBySql(string sql);
        List<T> GetBySql<T>(string sql);
        bool Delete(TE entity, SqlConnection sqlConnection, IDbTransaction transaction);
    }
}
