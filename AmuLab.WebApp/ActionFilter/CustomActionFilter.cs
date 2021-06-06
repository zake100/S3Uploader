using AmuLab.Services;
using System.Web.Mvc;

namespace AmuLab.WebApp.ActionFilter
{
    public class CustomActionFilter : ActionFilterAttribute, IActionFilter
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {

        }
    }
}