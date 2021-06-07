using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using AmuLab.Core.Constants;
using AmuLab.WebApp.Models;

namespace AmuLab.WebApp
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        public override void Init()
        {
            this.PostAuthenticateRequest += MvcApplication_PostAuthenticateRequest;
            base.Init();
        }
        void MvcApplication_PostAuthenticateRequest(object sender, EventArgs e)
        {
            var authCookie = HttpContext.Current.Request.Cookies[Configuration.ConstKey.SignInUser];
            if (authCookie != null)
            {
                string encTicket = authCookie.Value;
                if (!String.IsNullOrEmpty(encTicket))
                {
                    try
                    {
                        var ticket = FormsAuthentication.Decrypt(encTicket);
                        var id = new UserIdentity(ticket);
                        //var userRoles = Roles.GetRolesForUser(id.Name);
                        //var userRoles = Roles.GetRolesForUser(id.UserName);
                        //var prin = new GenericPrincipal(id, userRoles);
                        HttpContext.Current.User = id;
                    }
                    catch (Exception)
                    {
                    }                    
                }
            }
        }
    }
}
