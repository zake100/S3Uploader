using AmuLab.Core.Entities;
using AmuLab.Core.Repository;
using AmuLab.Core.Utility;

namespace AmuLab.Repository
{
    public class TMediaRepository : BaseRepository<TMEDIAEntity>, ITMediaRepository
    {
        public TMediaRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }
    }
}
