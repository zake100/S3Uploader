using AmuLab.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AmuLab.Core.Service
{
    public interface ITmediaService: IServiceBase
    {
        TMEDIAEntity Add(TMEDIAEntity tMedia);
        bool Update(TMEDIAEntity tMedia);
        bool Delete(long mediaId);
        IEnumerable<TMEDIAEntity> GetAll();
        TMEDIAEntity GetById(long id);
    }
}
