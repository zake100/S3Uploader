$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('userprofile');
});

RootApp.controller('UserProfileController', function ($scope, $http) {
    $scope.changePass = {
        id: 0,
        loginName: "",
        passwordOld: "",
        password: "",
        passwordRe: ""
    };
    $scope.accountProfile = {};

    $scope.getAccountProfile = function () {
        sendRequest('/api/user/getcurrentuser', 'GET', {
        }, $http).success(function (responseData) {
            $scope.accountProfile = responseData.data;
            $scope.changePass.id = responseData.data.id;
            $scope.changePass.loginName = responseData.data.userName;
        }).error(errorHandlerNotPermission);
    };

    $scope.changePassword = function () {
        if (!$scope.changePass.passwordRe || !$scope.changePass.password || !$scope.changePass.passwordOld) {
            bootbox.alert("Mật khẩu không được bỏ trống!");
            return;
        }

        if ($scope.changePass.passwordRe != $scope.changePass.password) {
            bootbox.alert("Xin nhập lại đúng mật khẩu!");
            return;
        }

        var url = "/api/account/change-pass";

        sendRequest(url, 'POST', {
            OldPass: $scope.changePass.passwordOld,
            NewPass: $scope.changePass.password,
            ConfirmPass: $scope.changePass.passwordRe
        }, $http).success(function (responseData) {
            if (responseData == true) {
                bootbox.alert("Thay đổi mật khẩu thành công");
            }
            else {
                bootbox.alert("Thay đổi mật khẩu không thành công");
            }

            $scope.changePass.password = "";
            $scope.changePass.passwordRe = "";
            $scope.changePass.passwordOld = "";
        }).error(function (errorHandlerNotPermission) {
            bootbox.alert(errorHandlerNotPermission);
        });
    }

    $scope.getAccountProfile();
});