using System.Collections.Generic;
using System.Data.SqlClient;
using System.Runtime.InteropServices;
using TKV.DMS.Business.Entities;
using Dapper;
using TKV.DMS.Business.Models.Search;
using TKV.DMS.Business.Repository;
using TKV.DMS.Business.Utility;

namespace TKV.DMS.Repository
{
    public class DeviceBaseRepository : BaseRepository<DeviceBaseEntity>, IDeviceBaseRepository
    {
        public IEnumerable<DeviceBaseEntity> GetDataForSelect2(string pattern, int pageSize, int offset)
        {
            var sql = $@"SELECT * FROM dbo.DeviceBase (NOLOCK) WHERE Name LIKE N'%{pattern}%' ORDER BY Name OFFSET {offset} ROWS FETCH NEXT {pageSize} ROWS ONLY; ";

            using (var sqlConn = new SqlConnection(ConnectionString))
            {
                sqlConn.Open();
                var result = sqlConn.Query<DeviceBaseEntity>(sql);
                sqlConn.Close();
                sqlConn.Dispose();
                return result;
            }
        }

        public IEnumerable<DeviceBaseEntity> Search(DeviceBaseSearchModel searchModel)
        {
            using (var sqlConn = new SqlConnection(ConnectionString))
            {
                sqlConn.Open();
                var result = sqlConn.Query<DeviceBaseEntity>("EXEC dbo._usp_SearchDeviceBase @name, @factoryId, @offset, @limit", new
                {
                    name = searchModel.Name,
                    factoryId = searchModel.FactoryId,
                    offset = searchModel.Offset,
                    limit = searchModel.Limit
                });
                sqlConn.Close();
                sqlConn.Dispose();
                return result;
            }
        }

        public DeviceBaseRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
