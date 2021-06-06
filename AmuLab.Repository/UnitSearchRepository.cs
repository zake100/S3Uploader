using TKV.DMS.Business.Models;
using TKV.DMS.Business.Utility;

namespace TKV.DMS.Repository
{
    public class UnitSearchRepository : BaseRepository<UnitSearchResponse>
    {
        public UnitSearchRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
