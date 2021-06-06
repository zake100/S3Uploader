using TKV.DMS.Business.Entities;
using Dapper;
using Dapper.Contrib.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace TKV.DMS.Repository
{
    public abstract class BaseValueRepository<T> : BaseRepository<T>, IBaseValueRepository<T> where T : BaseEntity, new()
    {
        public List<T> GetBySql(string sql)
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
