using System;
using AmuLab.Core.Enums;
using AmuLab.Core.Repository;
using AmuLab.Core.Service;

namespace AmuLab.Services
{
    public class ServiceBase : IServiceBase
    {
        public virtual long CallerUserId
        {
            get; set;
        }
    }
}
