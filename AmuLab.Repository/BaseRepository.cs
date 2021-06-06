using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using DapperExtensions;
using AmuLab.Core.Entities;
using AmuLab.Core.Repository;
using AmuLab.Core.Utility;

namespace AmuLab.Repository
{
    public class BaseRepository<TE> : IBaseRepository<TE> where TE : BaseEntity
    {
        protected readonly ICacheClient cacheClient;
        private static bool dapperLoaded = false;

        public BaseRepository(ICacheClient cacheClient)
        {

            if (!dapperLoaded)
            {
                DapperExtensions.DapperExtensions.SetMappingAssemblies(new[] { GetType().Assembly });
                // DapperExtensions.DapperExtensions.SqlDialect = new MySqlDialect();
                dapperLoaded = true;
            }

            this.cacheClient = cacheClient;
        }

        private string connectionString = "";

        public string ConnectionString
        {
            get
            {
                if (connectionString == "" && ConfigurationManager.ConnectionStrings["MainConnectionString"] != null)
                {
                    connectionString = ConfigurationManager.ConnectionStrings["MainConnectionString"].ConnectionString;
                }
                return connectionString;
            }
            set
            {
                connectionString = value;
            }
        }

        public void SetRedisCache(bool isUse)
        {
            cacheClient.SetIsUseRedis(isUse);
        }

        protected string BuildCacheKey(long id)
        {
            return typeof(TE).FullName + "." + id;
        }

        protected string BuildCacheKey(string key)
        {
            return typeof(TE).FullName + "." + key;
        }

        protected string BuidCacheKeyAllId()
        {
            return typeof(TE).FullName + ".AllIds";
        }

        protected virtual void AfterAdd(TE entity)
        {
            ClearCacheSingle(entity.Id);
            ClearCacheKeyAllId();
        }

        public void ClearCacheSingle(long id)
        {
            cacheClient.Remove(BuildCacheKey(id));
        }

        protected virtual bool BeforeAdd(TE entity)
        {
            return true;
        }

        protected virtual void AfterUpdate(TE entity)
        {
            ClearCacheSingle(entity.Id);
        }

        protected virtual bool BeforeUpdate(TE entity)
        {
            return true;
        }

        protected virtual void AfterDelete(TE entity)
        {
            ClearCacheSingle(entity.Id);
            ClearCacheKeyAllId();
        }

        protected virtual bool BeforeDelete(TE entity)
        {
            return true;
        }

        public virtual long Add(TE entity)
        {
            if (!BeforeAdd(entity))
                return 0;
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                var insertedId = sqlConnection.Insert(entity);

                if (entity.Id == 0)
                    entity.Id = (int)insertedId;
                AfterAdd(entity);
                return entity.Id;
            }
        }

        public virtual long Add(TE entity, SqlConnection sqlConnection, IDbTransaction transaction)
        {
            if (!BeforeAdd(entity))
                return 0;
            var insertedId = sqlConnection.Insert(entity, transaction);

            if (entity.Id == 0)
                entity.Id = (int)insertedId;
            AfterAdd(entity);
            return entity.Id;
        }

        public virtual bool Update(TE entity, SqlConnection sqlConnection, IDbTransaction transaction)
        {
            if (!BeforeUpdate(entity))
                return false;

            var result = sqlConnection.Update(entity, transaction);
            AfterUpdate(entity);
            return result;
        }

        public virtual bool Delete(TE entity, SqlConnection sqlConnection, IDbTransaction transaction)
        {
            if (!BeforeDelete(entity))
                return false;

            var result = sqlConnection.Delete(entity, transaction);
            AfterDelete(entity);
            return result;
        }

        public virtual bool Delete(TE entity)
        {
            if (!BeforeDelete(entity))
                return false;

            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                AfterDelete(entity);
                return sqlConnection.Delete(entity);
            }
        }

        public virtual TE GetById(long id)
        {
            var cacheKey = BuildCacheKey(id);

            if (cacheClient.Exists(cacheKey))
            {
                return cacheClient.Get<TE>(cacheKey);
            }
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Get<TE>(id);
                cacheClient.Set(cacheKey, result);
                return result;
            }
        }

        public IList<TE> GetById(IList<long> id)
        {
            if (id == null || !id.Any()) return new List<TE>();
            id = id.Distinct().ToList();
            return id.Select(GetById).Where(p => p != null).ToList();
        }

        protected object DefaultValue(Type t)
        {
            if (t.IsValueType)
                return Activator.CreateInstance(t);
            return null;
        }

        public virtual bool Update(TE entity)
        {
            if (!BeforeUpdate(entity))
                return false;

            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Update(entity);
                AfterUpdate(entity);
                return result;
            }
        }

        public virtual void Query(string sql)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var command = new SqlCommand(sql, sqlConnection);
                command.ExecuteNonQuery();
            }
        }

        public void FlushCache()
        {
            cacheClient.FlushDb();
        }

        public IEnumerable<TE> GetAll()
        {
            //var allIds = GetAllIds();
            //return GetById(allIds);
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Query<TE>($"SELECT * FROM dbo.[{typeof(TE).Name.Replace("Entity", string.Empty)}]").ToList();
                return result;
            }
        }

        public List<long> GetAllIds()
        {
            var cacheKey = BuidCacheKeyAllId();

            if (cacheClient.Exists(cacheKey))
            {
                return cacheClient.Get<List<long>>(cacheKey);
            }

            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Query<long>($"SELECT Id FROM dbo.[{typeof(TE).Name.Replace("Entity", string.Empty)}]").ToList();
                cacheClient.Set(cacheKey, result);
                return result;
            }
        }

        public void ClearCacheKeyAllId()
        {
            var cacheKey = BuidCacheKeyAllId();
            cacheClient.Remove(cacheKey);
        }

        protected void ClearAllCacheKey()
        {
            var keys = GetAllIds();
            if (keys != null && keys.Any())
            {
                var allKeys = keys.Select(n => string.Format("{0}.{1}", typeof(TE).FullName, n));
                cacheClient.RemoveAll(allKeys);
                //ClearCacheKeyAllId();
            }
        }


        public virtual IEnumerable<T> QueryStoreProcedure<T>(string storedProcedure, dynamic param = null,
         dynamic outParam = null, SqlTransaction transaction = null,
         bool buffered = true, int? commandTimeout = null,
         string connectionString = null)
        {
            var dp = new DynamicParameters();
            if (param != null)
            {
                if (IsList(param))
                {

                    foreach (DynamicParameter sp in param)
                        MakeParameter(dp, sp);
                }
                else
                {
                    var obj = (DynamicParameter)param;
                    MakeParameter(dp, obj);
                }
            }
            SqlConnection connection = new SqlConnection(string.IsNullOrEmpty(connectionString) ? ConnectionString : connectionString);
            connection.Open();
            var output = connection.Query<T>(storedProcedure, param: (object)dp,
            transaction: transaction, buffered: buffered, commandTimeout: commandTimeout,
            commandType: CommandType.StoredProcedure);
            return output;
        }
        public void MakeParameter(DynamicParameters dp, DynamicParameter param)
        {
            if (!param.ParameterName.Contains("@"))
                param.ParameterName = string.Format("@{0}", param.ParameterName);
            dp.Add(param.ParameterName, param.ParameterValue);
        }
        public bool IsList(object o)
        {
            if (o == null) return false;
            return o is IList &&
                   o.GetType().IsGenericType &&
                   o.GetType().GetGenericTypeDefinition().IsAssignableFrom(typeof(List<>));
        }

        public int ExecuteStoredProcedure(string storedName, object param)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Execute(storedName, param, commandType: CommandType.StoredProcedure);
                return result;
            }
        }

        public IEnumerable<T> QueryStore<T>(string storedProcedure, object param = null)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                var result = sqlConnection.Query<T>(sql: storedProcedure, param: param, commandType: CommandType.StoredProcedure);
                return result;
            }
        }

        public void ClearCacheSingle(int entityId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<T> QuerySqlCommand<T>(string sqlCommand, object param = null)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                var result = sqlConnection.Query<T>(sql: sqlCommand, param: param, commandType: CommandType.Text);
                return result;
            }
        }

        public int ExecuteSqlCommand(string sqlCommand, object param)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Execute(sqlCommand, param, commandType: CommandType.Text);
                return result;
            }
        }

        public TE GetByCode(string code, int id)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                return sqlConnection.Query<TE>("EXEC dbo._usp_FindItemByCode @tableName, @code, @id",
                    new { tableName = typeof(TE).Name.Replace("Entity", string.Empty), code, id }).FirstOrDefault();
            }
        }

        public List<TE> GetBySql(string sql)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Query<TE>(sql).ToList();

                return result;
            }
        }

        public List<T> GetBySql<T>(string sql)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();

                var result = sqlConnection.Query<T>(sql).ToList();

                return result;
            }
        }
    }
}
