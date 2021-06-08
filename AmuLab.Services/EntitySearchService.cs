using AmuLab.Core.Models.Search;
using AmuLab.Core.Repository;
using AmuLab.Core.Service;
using AmuLab.WebAPI.Models;
using System.Linq;

namespace AmuLab.Services
{
    public class EntitySearchService : ServiceBase, IEntitySearchService
    {
        private readonly IEntitySearchRepository _searchRepository;

        public EntitySearchService(IEntitySearchRepository searchRepository)
        {
            _searchRepository = searchRepository;
        }

        public SearchModel<EntitySearch> Search(EntitySearchModel searchModel)
        {
            var searchResults = new SearchModel<EntitySearch>();
            var allEntities = _searchRepository.Get();

            if(searchModel != null && !string.IsNullOrWhiteSpace(searchModel.UserName))
            {
                allEntities = allEntities.Where(e => e.ENTY_NM.Contains(searchModel.UserName)).ToList();
            }

            searchResults.List = allEntities;
            searchResults.Total = allEntities.Count;

            return searchResults;
        }
    }
}
