using System.Web.Http;

namespace AmuLab.FileAPI.Controllers
{
    public class BaseController : ApiController
    {
        protected int CallerUserId { get; set; }
    }
}
