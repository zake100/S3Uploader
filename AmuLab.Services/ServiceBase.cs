using System;
using AmuLab.Core.Enums;
using AmuLab.Core.Repository;
using AmuLab.Core.Service;

namespace AmuLab.Services
{
    public class ServiceBase : IServiceBase
    {
        //private readonly IAuthItemGroupRepository _authItemGroupRepo;

        //public ServiceBase(IAuthItemGroupRepository authItemGroupRepository)
        //{
        //    _authItemGroupRepo = authItemGroupRepository;
        //    //_authItemGroupRepo.SetRedisCache(true);
        //}

        public virtual long CallerUserId
        {
            get; set;
        }

        //public void CheckPermission(Permission permission)
        //{
        //    var result = _authItemGroupRepo.CheckPermissionForUser(CallerUserId, permission);
        //    if (!result)
        //    {
        //        throw new UnauthorizedAccessException("Bạn không có quyền thực hiện thao tác này.");
        //    }
        //}
    }
}
