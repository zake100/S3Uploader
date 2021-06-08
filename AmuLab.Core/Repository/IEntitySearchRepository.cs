using System.Collections.Generic;
using AmuLab.Core.Entities;

namespace AmuLab.Core.Repository
{
    public interface IEntitySearchRepository: IBaseRepository<EntitySearch>
    {
        List<EntitySearch> Get();
    }
}
