using AmuLab.Core.Repository;
using AmuLab.Repository;

namespace AmuLab.DependencyResolution
{
    public class RepositoryModule : Ninject.Modules.NinjectModule
    {
        public override void Load()
        {
            Bind<ITMediaRepository>().To<TMediaRepository>();
            Bind<IEntitySearchRepository>().To<EntitySearchRepository>();
        }
    }
}