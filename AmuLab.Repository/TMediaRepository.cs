using System.Data;
using System.Data.SqlClient;
using AmuLab.Core.Entities;
using AmuLab.Core.Repository;
using AmuLab.Core.Utility;
using Dapper;

namespace AmuLab.Repository
{
    public class TMediaRepository : BaseRepository<TMEDIAEntity>, ITMediaRepository
    {
        public TMediaRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }

        private long GetMediaId(SqlConnection sqlConnection)
        {
            var dp = new DynamicParameters();
            dp.Add("@ReturnValue", dbType: DbType.Int32, direction: ParameterDirection.Output);
            dp.Add("@MEDIA_ID", dbType: DbType.Int64, direction: ParameterDirection.Output);
            sqlConnection.Execute("dbo.Media_generateMediaID", dp, commandType: CommandType.StoredProcedure);
            return dp.Get<long>("@MEDIA_ID");
        }

        public new long Add(TMEDIAEntity entity)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                var id = GetMediaId(sqlConnection);
                var dp = new DynamicParameters();
                dp.Add("@ReturnValue", dbType: DbType.Int32, direction: ParameterDirection.Output);
                dp.Add("@MEDIA_ID", id);
                dp.Add("@SHRD_KEY", entity.SHRD_KEY);
                dp.Add("@MEDIA_NM", entity.MEDIA_NM);
                dp.Add("@MEDIA_FIL_TY", entity.MEDIA_FIL_TY);
                dp.Add("@MEDIA_EXTN", entity.MEDIA_EXTN);
                dp.Add("@MEDIA_SIZE_NBR", entity.MEDIA_SIZE_NBR);
                dp.Add("@MEDIA_LOC_PATH", entity.MEDIA_LOC_PATH);
                dp.Add("@MEDIA_EXTR_ID", entity.MEDIA_EXTR_ID);
                dp.Add("@MEDIA_THUMB_NM", entity.MEDIA_THUMB_NM);
                dp.Add("@MEDIA_TCD", entity.MEDIA_TCD);
                dp.Add("@MEDIA_SCD", entity.MEDIA_SCD);
                dp.Add("@MEDIA_PVCY_TCD", entity.MEDIA_PVCY_TCD);
                dp.Add("@OWNR_ID", entity.OWNR_ID);
                dp.Add("@ENTY_IP_ADDR", entity.ENTY_IP_ADDR);
                dp.Add("@PBLISH_ON_TCD", entity.PBLISH_ON_TCD);
                dp.Add("@POST_ID", entity.POST_ID);
                sqlConnection.Execute("dbo.Media_createMedia", dp, commandType: CommandType.StoredProcedure);
                return id;
            }
        }
    }
}
