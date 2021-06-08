namespace AmuLab.Core.Service
{
    public interface IServiceBase
    {
        long CallerUserId { get; set; }
        // void CheckPermission(Permission permission);
    }
}
