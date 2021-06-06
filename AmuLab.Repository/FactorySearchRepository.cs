using TKV.DMS.Business.Models;
using TKV.DMS.Business.Utility;

namespace TKV.DMS.Repository
{
    public class FactorySearchRepository : BaseRepository<FactorySearchResponse>
    {
        public FactorySearchRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
