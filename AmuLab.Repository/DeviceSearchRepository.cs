using TKV.DMS.Business.Models;
using TKV.DMS.Business.Utility;

namespace TKV.DMS.Repository
{
    public class DeviceSearchRepository : BaseRepository<DeviceSearchResponse>
    {
        public DeviceSearchRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
