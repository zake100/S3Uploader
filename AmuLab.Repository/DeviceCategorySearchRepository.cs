using TKV.DMS.Business.Models;
using TKV.DMS.Business.Utility;

namespace TKV.DMS.Repository
{
    public class DeviceCategorySearchRepository : BaseRepository<DeviceCategorySearchResponse>
    {
        public DeviceCategorySearchRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
