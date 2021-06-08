using AmuLab.Core.Models.Search;
using AmuLab.WebAPI.Models;

namespace AmuLab.Core.Service
{
    public interface IEntitySearchService: IServiceBase
    {
        SearchModel<EntitySearch> Search(EntitySearchModel searchModel);
    }
}