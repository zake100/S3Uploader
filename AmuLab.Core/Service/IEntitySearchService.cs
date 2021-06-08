using AmuLab.Core.Entities;
using AmuLab.Core.Models.Search;

namespace AmuLab.Core.Service
{
    public interface IEntitySearchService: IServiceBase
    {
        SearchModel<EntitySearch> Search(EntitySearchModel searchModel);
    }
}