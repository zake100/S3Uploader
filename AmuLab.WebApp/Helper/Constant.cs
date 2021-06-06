namespace AntData.TKV.Helper
{
    public class ConstantMessage
    {
        public const string MessageAddOK = "Thêm mới thành công";
        public const string MessageUpdateOK = "Cập nhật thành công";
        public const string MessageError = "Có lỗi xảy ra. Vui lòng kiểm tra thông tin";
        public const string MessageDelOK = "Xóa bản ghi thành công";
        public const string MessageDelError = "Xóa bản ghi không thành công";
        public const string MessageNotRecord = "Không tìm thấy bản ghi";
        public const string MessageHasExist = "Đã tồn tại bản ghi trong hệ thống";

        public const string MessageLoginError = "Thông tin đăng nhập không chính xác";

        public const string MessageChangePassOK = "Thay đổi mật khẩu thành công";
        public const string MessageChangePassNotOK = "Thay đổi mật khẩu không thành công";
        public const string MessageChangePassNotSame = "Mật khẩu nhập lại không chính xác";

        public const string MessageDeviceCategoryEmpty = "Bạn chưa chọn danh mục thiết bị";
        public const string MessageDeviceUnitEmpty = "Bạn chưa chọn đơn vị tính";
        public const string MessageDeviceStatus = "Bạn chưa chọn trạng thái thiết bị";
        public const string MessageDeviceQuantity = "Bạn chưa nhập số lượng thiết bị";
        public const string MessageDeviceFactory = "Bạn chưa chọn tên đơn vị";
        public const string MessageDateInvalid = "Thời gian đưa vào sử dụng chưa đúng định dạng.";
        public const string MessageNumberOfManagement = "Bạn chưa nhập số quản lý";
        public const string MessageAssetNumber = "Bạn chưa nhập số tài sản";
    }

    public class Configuration
    {
        public struct ConstKey
        {
            public const string SignInToken = "SignInTokenTKV";
            public const string SignInUser = "SignInTokenTKV";
            public const string FunctionKey = "FunctionKeyTKV";
            public const string SaltKey = "Pa$$w0rd$altNEverkn0w";
        }
    }
}