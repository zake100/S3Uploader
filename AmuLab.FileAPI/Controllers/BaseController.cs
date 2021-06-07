using System.Web.Http;
using System.Web.Http.Cors;

namespace AmuLab.FileAPI.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BaseController : ApiController
    {
        protected int CallerUserId { get; set; }
    }
}
