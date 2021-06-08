using AmuLab.Core.Models.Search;
using AmuLab.Core.Service;
using System.Linq;
using System.Web.Http;

namespace AmuLab.WebAPI.Controllers
{
    [RoutePrefix("api/account")]
    public class AccountController : BaseController
    {
        private readonly IEntitySearchService _entitySearchService;

        public AccountController(IEntitySearchService entitySearchService)
        {
            _entitySearchService = entitySearchService;
        }

        [Route("searchProfile")]
        [HttpGet]
        public IHttpActionResult SearchProfile(string userName)
        {
            var searchResuls = _entitySearchService.Search(new EntitySearchModel { UserName = userName });

            return Ok(searchResuls.List.Select(s => new
            {
                id = s.ENTY_URL_ID,
                name = s.ENTY_USR_NM
            }).ToList());
        }
    }
}
