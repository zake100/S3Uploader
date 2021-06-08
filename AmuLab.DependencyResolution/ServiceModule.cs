using AmuLab.Core.Service;
using AmuLab.Services;

namespace AmuLab.DependencyResolution
{
    public class ServiceModule : Ninject.Modules.NinjectModule
    {
        public override void Load()
        {
            Bind<ITmediaService>().To<TmediaService>();
            Bind<IEntitySearchService>().To<EntitySearchService>();
        }
    }
}