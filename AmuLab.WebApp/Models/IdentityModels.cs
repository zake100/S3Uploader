using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web.Security;

namespace AmuLab.WebApp.Models
{
    public class UserIdentity : IIdentity, IPrincipal
    {
        private readonly FormsAuthenticationTicket _ticket;

        public UserIdentity(FormsAuthenticationTicket ticket)
        {
            _ticket = ticket;
        }

        public string AuthenticationType
        {
            get { return "User"; }
        }

        public bool IsAuthenticated
        {
            get { return true; }
        }

        public string Name
        {
            get { return _ticket.Name; }
        }

        public string UserData
        {
            get { return _ticket.UserData; }
        }      
        

        public bool IsInRole(string role)
        {
            return System.Web.Security.Roles.IsUserInRole(role);
        }

        public IIdentity Identity
        {
            get { return this; }
        }
    }
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("MainConnectionString", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}