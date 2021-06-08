using AmuLab.Core.Models.Search;
using AmuLab.WebAPI.Models;
using System.Collections.Generic;

namespace AmuLab.Core.Repository
{
    public interface IEntitySearchRepository: IBaseRepository<EntitySearch>
    {
        List<EntitySearch> Get();
    }
}
