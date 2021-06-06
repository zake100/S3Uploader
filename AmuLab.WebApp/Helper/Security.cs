using AmuLab.Core.Entities;
using Newtonsoft.Json;
using System;
using System.Web;
using System.Web.Security;
using AmuLab.Core.Constants;

namespace AmuLab.WebApp.Helper
{
    public class Security
    {
        public void SetAuthCookie(HttpContext httpContext, FormsAuthenticationTicket authenticationTicket, string CookieName)
        {
            var encryptedTicket = FormsAuthentication.Encrypt(authenticationTicket);
            var cookie = new HttpCookie(CookieName, encryptedTicket);
            cookie.HttpOnly = true;
            cookie.Expires = authenticationTicket.Expiration;
            httpContext.Response.Cookies.Add(cookie);
        }

        //public void UserSignIn(Users accountInfo, HttpContext _curentHttpContext)
        //{
        //    var loginToken = new FormsAuthenticationTicket(1, Configuration.ConstKey.SignInUser, DateTime.Now, DateTime.Now.AddHours(1),
        //        true, JsonConvert.SerializeObject(accountInfo));
        //    SetAuthCookie(_curentHttpContext, loginToken, Configuration.ConstKey.SignInUser);
        //}
        public void SignOutLocal(HttpContext httpContext)
        {
            var cookie = new HttpCookie(Configuration.ConstKey.SignInUser);
            DateTime nowDateTime = DateTime.Now;
            cookie.Expires = nowDateTime.AddDays(-1);
            httpContext.Response.Cookies.Add(cookie);

            var cookieToken = new HttpCookie(Configuration.ConstKey.SignInToken);
            DateTime nowDateTimeToken = DateTime.Now;
            cookie.Expires = nowDateTime.AddDays(-1);
            httpContext.Response.Cookies.Add(cookieToken);

            FormsAuthentication.SignOut();
        }

        //public Users CurrentUser(HttpContext _curentHttpContext)
        //{
        //    Users userApp = null;
        //    var LoginTokenCookie = _curentHttpContext.Request.Cookies[Configuration.ConstKey.SignInUser];
        //    if (LoginTokenCookie != null)
        //    {
        //        try
        //        {
        //            var token = FormsAuthentication.Decrypt(LoginTokenCookie.Value);
        //            userApp = JsonConvert.DeserializeObject<Users>(token.UserData);
        //        }
        //        catch
        //        {
        //            return null;
        //        }
        //    }
        //    return userApp;
        //}

        public void SignOutLocal()
        {
            FormsAuthentication.SignOut();
        }        
    }
}