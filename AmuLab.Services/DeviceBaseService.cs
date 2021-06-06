using TKV.DMS.Business.Entities;
using TKV.DMS.Repository;
using System.Collections.Generic;
using System.Linq;
using TKV.DMS.Business.Models.Search;
using TKV.DMS.Business.Repository;
using TKV.DMS.Business.Service;

namespace TKV.DMS.Services
{
    public class DeviceBaseService : ServiceBase, IDeviceBaseService
    {
        private readonly IDeviceBaseRepository _deviceBaseRepo;

        public DeviceBaseService(IDeviceBaseRepository deviceBaseRepository, IAuthItemGroupRepository authItemGroupRepository) : base(authItemGroupRepository)
        {
            _deviceBaseRepo = deviceBaseRepository;
        }

        public long Add(DeviceBaseEntity model)
        {
            var entity = new DeviceBaseEntity
            {
                Name = model.Name,
                HashCode = model.Name.GetHashCode()
            };
            var result = _deviceBaseRepo.Add(entity);
            return result;
        }

        public bool Update(DeviceBaseEntity entity)
        {
            return _deviceBaseRepo.Update(entity);
        }

        public DeviceBaseEntity GetById(long id)
        {
            return _deviceBaseRepo.GetById(id);
        }

        public List<DeviceBaseEntity> GetAll()
        {
            return _deviceBaseRepo.GetAll().ToList();
        }

        public DeviceBaseEntity GetByName(string name)
        {
            var sql = $"Select * from [DeviceBase] with(nolock) Where LTRIM(RTRIM(Name)) = N'{name}'";
            return _deviceBaseRepo.GetBySql(sql).FirstOrDefault();
        }

        public List<DeviceBaseEntity> GetsByName(string name, int offset = 0, int limit = 10)
        {
            var sql = $"Select * from [DeviceBase] with(nolock) Where Name like N'%{name}%' order by [Name];";
            //var sql = $"Select * from [DeviceBase] with(nolock) Where Name like N'%{name}%' order by [Name] OFFSET {offset} ROWS FETCH NEXT {limit} ROWS ONLY;";
            return _deviceBaseRepo.GetBySql(sql);
        }

        public IEnumerable<DeviceBaseEntity> GetDataForSelect2(string pattern, int pageSize, int offset)
        {
            return _deviceBaseRepo.GetDataForSelect2(pattern, pageSize, offset);
        }

        public IEnumerable<DeviceBaseEntity> Search(DeviceBaseSearchModel searchModel)
        {
            return _deviceBaseRepo.Search(searchModel);
        }
    }
}
