using AmuLab.Core.Utility;
using AmuLab.Utility;

namespace AmuLab.DependencyResolution
{
    public class UtilityModule : Ninject.Modules.NinjectModule
    {
        public override void Load()
        {
            //Bind<ICacheClient>().To<RedisCacheClient>().InSingletonScope();
            //Bind<IElasticClient>().To<ElasticClient>().InSingletonScope();
            //Bind(typeof(IElasticNestClient<>)).To(typeof(ElasticNestClient<>));
        }
    }
}