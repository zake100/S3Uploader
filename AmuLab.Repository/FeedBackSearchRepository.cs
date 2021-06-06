using TKV.DMS.Business.Models;
using TKV.DMS.Business.Utility;

namespace TKV.DMS.Repository
{
    public class FeedBackSearchRepository : BaseRepository<FeedBackSearchResponse>
    {
        public FeedBackSearchRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
