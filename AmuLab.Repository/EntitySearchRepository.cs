using AmuLab.Core.Models.Search;
using AmuLab.Core.Repository;
using AmuLab.Core.Utility;
using AmuLab.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmuLab.Repository
{
    public class EntitySearchRepository : BaseRepository<EntitySearch>, IEntitySearchRepository
    {
        public EntitySearchRepository(ICacheClient cacheClient) : base(cacheClient)
        {
        }

        private readonly List<EntitySearch> MockupDataList = new List<EntitySearch>
        {
            new EntitySearch
            {
                CRTIF_IND = 0,
                ENTY_NM = "pourquoi test",
                ENTY_URL_ID = "1000000102346",
                ENTY_USR_NM = "pourquoi.test"
            },
            new EntitySearch
            {
                CRTIF_IND = 0,
                ENTY_NM = "Kori test1",
                ENTY_URL_ID = "1000000102382",
                ENTY_USR_NM = "kori.test1"
            },
             new EntitySearch
            {
                CRTIF_IND = 0,
                ENTY_NM = "test 99%Force",
                ENTY_URL_ID = "1000000102421",
                ENTY_USR_NM = "test.99force"
            },
                new EntitySearch
            {
                CRTIF_IND = 0,
                ENTY_NM = "test_kori kori",
                ENTY_URL_ID = "1000000102435",
                ENTY_USR_NM = "testkori.kori"
            },
                     new EntitySearch
            {
                CRTIF_IND = 0,
                ENTY_NM = "test2 test2",
                ENTY_URL_ID = "1000000105419",
                ENTY_USR_NM = "test2.test2"
            },
            new EntitySearch
            {
                CRTIF_IND = 0,
                ENTY_NM = "henry test",
                ENTY_URL_ID = "1000000111295",
                ENTY_USR_NM = "henry.test"
            }
        };


        public List<EntitySearch> Get()
        {
            return MockupDataList;
        }
    }
}
