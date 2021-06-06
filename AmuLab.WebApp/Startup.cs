using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AmuLab.WebApp.Startup))]
namespace AmuLab.WebApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
