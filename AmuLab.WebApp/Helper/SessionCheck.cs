using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AmuLab.WebApp.Helper
{
    public class SessionCheck : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var session = filterContext.HttpContext.Session;
            var security = new Security();
            var isLogin = HttpContext.Current == null;
            if (!isLogin)
            {
                //var temp = security.CurrentUser(System.Web.HttpContext.Current);
                //if (temp == null)
                //{
                //    isLogin = true;
                //}
                isLogin = true;
            }

            if (isLogin)
            {
                filterContext.Result = new RedirectToRouteResult(
                    new RouteValueDictionary {
                        { "Controller", "Login" },
                        { "Action", "Index" }
                    });
            }
        }
    }
}