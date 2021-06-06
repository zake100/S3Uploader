using System.Web.Mvc;

namespace AmuLab.WebApp.Controllers
{
    public class HomeController : BaseController
    {

        public HomeController()
        {
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        private string CurrentControllerName()
        {
            return $"{this.ControllerContext.RouteData.Values["controller"].ToString()}-{this.ControllerContext.RouteData.Values["action"].ToString()}".ToLower();
        }

        public ActionResult Welcome()
        {
            return View();
        }

        public ActionResult AccessDenied()
        {
            return View();
        }
    }
}