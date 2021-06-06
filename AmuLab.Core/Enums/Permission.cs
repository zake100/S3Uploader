using System.ComponentModel;

namespace AmuLab.Core.Enums
{
    public enum Permission
    {
        ApiPermission = 1,

        //[Description("Xem bảng điều khiển")]
        //[Category("Dashboard")]
        //DashboardPermission_View,

        ////Device
        //[Category("Device")]
        //[Description("Xem danh sách thiết bị")]
        //DevicePermission_GetAll,
        //[Category("Device")]
        //[Description("Thêm mới thiết bị")]
        //DevicePermission_Add,
        //[Category("Device")]
        //[Description("Cập nhật thiết bị")]
        //DevicePermission_Update,
        //[Category("Device")]
        //[Description("Thanh lý thiết bị")]
        //DevicePermission_Liquid,
        //[Category("Device")]
        //[Description("Xem chi tiết thiết bị")]
        //DevicePermission_GetById,
        //[Category("Device")]
        //[Description("Xuất excel")]
        //DevicePermission_ExportExcel,
        //[Category("Device")]
        //[Description("Nhập excel")]
        //DevicePermission_ImportExcel,
        //[Category("Device")]
        //[Description("Xóa thiết bị")]
        //DevicePermission_Delete,

        ////Device note
        //[Category("DeviceNote")]
        //[Description("Danh sách nhật ký thiết bị")]
        //DeviceNotePermission_GetAll,
        //[Category("DeviceNote")]
        //[Description("Tạo ghi chú/nhật ký thiết bị")]
        //DeviceNotePermission_Create,
        //[Category("DeviceNote")]
        //[Description("Xóa ghi chú/nhật ký thiết bị")]
        //DeviceNotePermission_Delete,
        //[Category("DeviceNote")]
        //[Description("Sửa ghi chú/nhật ký thiết bị")]
        //DeviceNotePermission_Update,

        ////User
        //[Category("User")]
        //[Description("Xem chi tiết thông tin người dùng")]
        //UserPermission_GetById,
        //[Category("User")]
        //[Description("Xem danh sách người dùng")]
        //UserPermission_GetAll,
        //[Category("User")]
        //[Description("Thêm mới người dùng")]
        //UserPermission_Add,
        //[Category("User")]
        //[Description("Cập nhật thông tin người dùng")]
        //UserPermission_Update,
        //[Category("User")]
        //[Description("Xóa người dùng")]
        //UserPermission_Delete,
        //[Category("User")]
        //[Description("Bỏ xóa người dùng")]
        //UserPermission_Undelete,
        //[Category("User")]
        //[Description("Kích hoạt người dùng")]
        //UserPermission_Activate,
        //[Category("User")]
        //[Description("Bỏ kích hoạt người dùng")]
        //UserPermission_Deactivate,
        //[Category("User")]
        //[Description("Phân quyền người dùng")]
        //UserPermission_AssignToGroup,
        //[Category("User")]
        //[Description("Đổi mật khẩu người dùng")]
        //UserPermission_ChangePass,
        //[Category("User")]
        //[Description("Gán người dùng vào đơn vị")]
        //UserPermission_AssignToFactory,

        //// Notification
        //[Category("Notification")]
        //[Description("Xem danh sách thông báo")]
        //NotificationPermission_GetAll,

        //// Role group
        //[Category("Role")]
        //[Description("Xem chi tiết nhóm quyền")]
        //RolePermission_GetById,
        //[Category("Role")]
        //[Description("Xem danh sách nhóm quyền")]
        //RolePermission_GetAll,
        //[Category("Role")]
        //[Description("Thêm mới nhóm quyền")]
        //RolePermission_Add,
        //[Category("Role")]
        //[Description("Sửa nhóm quyền")]
        //RolePermission_Update,
        //[Category("Role")]
        //[Description("Phân quyền cho nhóm")]
        //RolePermission_Assign,
        //[Category("Role")]
        //[Description("Xóa nhóm quyền")]
        //RolePermission_Delete,

        ////Device Transfer
        //[Category("DeviceTransfer")]
        //[Description("Xem danh sách điều chuyển")]
        //DeviceTransferPermission_GetAll,
        //[Category("DeviceTransfer")]
        //[Description("Nhận thiết bị về đơn vị")]
        //DeviceTransferPermission_Approve,
        //[Category("DeviceTransfer")]
        //[Description("Tạo mới điều chuyển thiết bị")]
        //DeviceTransferPermission_Add,
        //[Category("DeviceTransfer")]
        //[Description("Sửa điều chuyển thiết bị")]
        //DeviceTransferPermission_Update,
        //[Category("DeviceTransfer")]
        //[Description("Hủy điều chuyển thiết bị")]
        //DeviceTransferPermission_Cancel,

        ////Maintenance
        //[Category("Maintenance")]
        //[Description("Xem danh sách BD/BH/KĐ")]
        //MaintenancePermission_GetAll,
        //[Category("Maintenance")]
        //[Description("Đặt lịch BD/BH/KĐ")]
        //MaintenancePermission_Add,
        //[Category("Maintenance")]
        //[Description("Sửa lịch BD/BH/KĐ")]
        //MaintenancePermission_Update,
        //[Category("Maintenance")]
        //[Description("Chi tiết BD/BH/KĐ")]
        //MaintenancePermission_GetById,
        //[Category("Maintenance")]
        //[Description("Xóa lịch BD/BH/KĐ")]
        //MaintenancePermission_Delete,

        ////Device Category
        //[Category("DeviceCategory")]
        //[Description("Xem chi tiết chủng loại thiết bị")]
        //DeviceCategoryPermission_GetById,
        //[Category("DeviceCategory")]
        //[Description("Xem danh sách chủng loại thiết bị")]
        //DeviceCategoryPermission_GetAll,
        //[Category("DeviceCategory")]
        //[Description("Thêm mới chủng loại thiết bị")]
        //DeviceCategoryPermission_Add,
        //[Category("DeviceCategory")]
        //[Description("Cập nhật thông tin chủng loại thiết bị")]
        //DeviceCategoryPermission_Update,
        //[Description("Xóa danh mục thiết bị")]
        //DeviceCategoryPermission_Delete,


        ////Unit
        //[Category("Unit")]
        //[Description("Xem chi tiết đơn vị tính")]
        //UnitPermission_GetById,
        //[Category("Unit")]
        //[Description("Xem danh sách đơn vị tính")]
        //UnitPermission_GetAll,
        //[Category("Unit")]
        //[Description("Thêm mới đơn vị tính")]
        //UnitPermission_Add,
        //[Category("Unit")]
        //[Description("Cập nhật thông tin đơn vị tính")]
        //UnitPermission_Update,
        //[Category("Unit")]
        //[Description("Xóa đơn vị tính")]
        //UnitPermission_Delete,

        ////Factory
        ////Unit
        //[Category("Factory")]
        //[Description("Xem chi tiết đơn vị sử dụng")]
        //FactoryPermission_GetById,
        //[Category("Factory")]
        //[Description("Xem danh sách đơn vị sử dụng")]
        //FactoryPermission_GetAll,
        //[Category("Factory")]
        //[Description("Thêm mới đơn vị sử dụng")]
        //FactoryPermission_Add,
        //[Category("Factory")]
        //[Description("Cập nhật thông tin đơn vị sử dụng")]
        //FactoryPermission_Update,
        //[Category("Factory")]
        //[Description("Xóa đơn vị sử dụng")]
        //FactoryPermission_Delete,

        ////Feedback
        //[Category("Feedback")]
        //[Description("Xem danh sách phản hồi")]
        //FeedbackPermission_GetAll,
        //[Category("Feedback")]
        //[Description("Thêm mới phản hồi")]
        //FeedbackPermission_Add,
        //[Category("Feedback")]
        //[Description("Cập nhật thông tin phản hồi")]
        //FeedbackPermission_Update,

        //// SystemConfig
        //[Category("SystemConfig")]
        //[Description("Cấu hình hệ thống")]
        //SystemConfigPermission_Update,

        //[Category("DeviceGroup")]
        //[Description("Xem danh sách công trình/hệ thống")]
        //DeviceGroupPermission_GetAll,
        //[Category("DeviceGroup")]
        //[Description("Thêm mới công trình/hệ thống")]
        //DeviceGroupPermission_Add,
        //[Category("DeviceGroup")]
        //[Description("Cập nhật công trình/hệ thống")]
        //DeviceGroupPermission_Update,
        //[Category("DeviceGroup")]
        //[Description("Thanh lý công trình/hệ thống")]
        //DeviceGroupPermission_Liquid,
        //[Category("DeviceGroup")]
        //[Description("Xem chi tiết công trình/hệ thống")]
        //DeviceGroupPermission_GetById,
        //[Category("DeviceGroup")]
        //[Description("Xuất excel")]
        //DeviceGroupPermission_ExportExcel,
        //[Category("DeviceGroup")]
        //[Description("Nhập excel")]
        //DeviceGroupPermission_ImportExcel,
        //[Category("DeviceGroup")]
        //[Description("Xóa công trình hệ thống")]
        //DeviceGroupPermission_Delete,


        ////Bổ sung cho thao tác ban hành quyết định
        //[Category("DeviceTransfer")]
        //[Description("Ban hành quyết định Điều chuyển")]
        //DeviceTransferPermission_Issues,

        //// Device Domain - Lĩnh vực thiết bị
        //[Category("DeviceDomain")]
        //[Description("Xem chi tiết Lĩnh vực thiết bị")]
        //DeviceDomainPermission_GetById,
        //[Category("DeviceDomain")]
        //[Description("Xem danh sách Lĩnh vực thiết bị")]
        //DeviceDomainPermission_GetAll,
        //[Category("DeviceDomain")]
        //[Description("Thêm mới Lĩnh vực thiết bị")]
        //DeviceDomainPermission_Add,
        //[Category("DeviceDomain")]
        //[Description("Cập nhật Lĩnh vực thiết bị")]
        //DeviceDomainPermission_Update,
        //[Category("DeviceDomain")]
        //[Description("Xóa Lĩnh vực thiết bị")]
        //DeviceDomainPermission_Delete,
    }
}