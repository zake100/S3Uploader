using AmuLab.Core.Entities;

namespace AmuLab.Core.Repository
{
    public interface ITMediaRepository: IBaseRepository<TMEDIAEntity>
    {
        bool Delete(long id);
    }
}
