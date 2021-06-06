$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('explorer');
    AntData.BBVP.CommonAction.SetActiveMenu('employee-list');
});

RootApp.controller('HRMEmployeeController', function ($scope, $http) {
    $scope.listArea = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'employeeCode';
    $scope.user = {};
    $scope.user2 = {};
    $scope.limit = 10;
    $scope.listStatus = [];
    $scope.currentUser = {};
    $scope.permissionGroupList = [];
    $scope.permissionListProcessed = [];
    $scope.hasRolePermission = true;
    $scope.search.pageSize = '10';

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listUser, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $scope.resetField = function () {
        $scope.user.userName = "";
        $scope.user.email = "";
        $scope.user.status = 0;
        $scope.user.password = "";
    };

    $scope.formatDate = function (stDate) {
        if (stDate == undefined)
            return "";

        var date = new Date(stDate);
        return formatToDate(date);
    }

    $scope.getCheckedIds = function () {
        var ids = [];
        for (var obj in $scope.listUser) {
            var user = $scope.listUser[obj];
            if (user.checked) {
                ids.push(user.id);
            }
        }
        return ids;
    }

    $scope.deleteAllChecked = function () {
        var ids = $scope.getCheckedIds();

        if (ids.length == 0) {
            bootbox.alert('@string.Format(Resources.m_select_at_least_one, Resources.t_user)');
            return false;
        }

        bootbox.confirm('@string.Format(Resources.m_confirm_action_multi, Resources.bt_delete.ToLower() ,Resources.t_user)',
            function (result) {
                if (result) {
                    var countRequest = 0;
                    for (var index in ids) {
                        var id = ids[index];
                        sendRequest('/api/user/delete/' + id, 'POST', {}, $http).success(
                            function (responseData) {
                                countRequest += 1;
                                if (countRequest == ids.length) {
                                    $scope.getData($scope.currentPage);
                                }
                            }).error(errorHandlerNotPermission);
                    }
                }
            });
    };

    $scope.deleteById = function (id) {
        bootbox.confirm('@string.Format(Resources.m_confirm_action_one, Resources.bt_delete.ToLower(), Resources.t_user)',
            function (result) {
                if (result) {
                    sendRequest('/api/user/delete/' + id, 'POST', {}, $http).success(function (responseData) {
                        //bootbox.alert('Xóa thành công');
                        $scope.getData($scope.currentPage);
                    }).error(errorHandlerNotPermission);
                }
            });
    };

    $scope.activeById = function (id, isActive) {
        sendRequest('/api/user/' + id + '/status/' + isActive, 'POST', {}, $http).success(
            function (responseData) {
                //bootbox.alert(isActive == 1 ? 'bỏ' : '' + 'kích hoạt thành công');
                $scope.getData($scope.currentPage);
            }).error(errorHandlerNotPermission);
    };

    $scope.changeStatusAllChecked = function (status) {
        var ids = $scope.getCheckedIds();

        if (ids.length == 0) {
            bootbox.alert('@string.Format(Resources.m_select_at_least_one, Resources.t_user)');
            return false;
        }
        var message;
        if (status == 0) {
            message = '@string.Format(Resources.m_confirm_action_multi, Resources.bt_active.ToLower(), Resources.t_user)';
        } else {
            message = '@string.Format(Resources.m_confirm_action_multi, Resources.bt_inactive.ToLower(), Resources.t_user)';
        }
        bootbox.confirm(message,
            function (result) {
                if (result) {
                    var action = 'status';
                    var countRequest = 0;
                    for (var index in ids) {
                        var id = ids[index];
                        sendRequest('/api/user/' + id + '/' + action + '/' + status, 'POST', {}, $http).success(
                            function (responseData) {
                                countRequest += 1;
                                if (countRequest == ids.length) {
                                    //bootbox.alert('Thay đổi thành công');
                                    $scope.getData($scope.currentPage);
                                }
                            }).error(errorHandlerNotPermission);
                    }
                }
            });
    };

    $scope.enableAllChecked = function () {
        $scope.changeStatusAllChecked(1);
    };

    $scope.disableAllChecked = function () {
        $scope.changeStatusAllChecked(0);
    };

    $scope.showInfoById = function (user) {
        $scope.user2.id = user.id;
        $scope.user2.userName = user.userName;
        $scope.user2.fullName = user.fullName;
        $scope.user2.email = user.email;
        $scope.user2.status = user.status;
        $scope.user2.allowNotifycation = user.allowNotifycation;
        $scope.user2.allowNotifycationRight = user.allowNotifycationRight;
        $scope.user2.jobPosition = user.jobPosition;
        $scope.user2.departmentId = user.departmentId;
    };

    $scope.createUser = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("@Resources.P_Username", $scope.user.userName)) {
            return false;
        }

        sendRequest('/api/user/validateduplicate', 'POST',
            {
                Name: $scope.user.userName,
                Email: $scope.user.email,
                Id: 0
            }, $http).success(function (responseData) {
                if (responseData.data) {
                    bootbox.alert('Tên đăng nhập hoặc email đã tồn tại.');
                } else {
                    sendRequest('/api/user',
                        'POST',
                        {
                            UserName: $scope.user.userName,
                            FullName: $scope.user.fullName,
                            Email: $scope.user.email,
                            Password: $scope.user.password,
                            JobPosition: $scope.user.jobPosition,
                            AllowNotifycation: $scope.user.allowNotifycation,
                            AllowNotifycationRight: $scope.user.allowNotifycationRight,
                            DepartmentId: $scope.user.departmentId,
                        },
                        $http).success(function (responseData) {
                            $('.close').click();
                            //bootbox.alert('Tạo mới người dùng thành công');
                            $scope.getData(1);
                            $scope.resetField();
                        }).error(errorHandlerNotPermission);
                }
            }).error(errorHandlerNotPermission);
    };

    $scope.updateUser = function (id) {
        if (!AntData.BBVP.Validation.ValidateRequireField("Tên đăng nhập", $scope.user2.userName)) {
            return false;
        }

        sendRequest('/api/user/validateduplicate', 'POST',
            {
                Name: $scope.user2.userName,
                Email: $scope.user2.email,
                Id: $scope.user2.id
            }, $http).success(function (responseData) {
                if (responseData.data) {
                    bootbox.alert('Tên đăng nhập hoặc email đã tồn tại.');
                } else {
                    sendRequest('/api/user/update/' + id,
                        'POST',
                        {
                            Id: $scope.user2.id,
                            UserName: $scope.user2.userName,
                            FullName: $scope.user2.fullName,
                            Email: $scope.user2.email,
                            Status: $scope.user2.status,
                            JobPosition: $scope.user2.jobPosition,
                            AllowNotifycation: $scope.user2.allowNotifycation,
                            AllowNotifycationRight: $scope.user2.allowNotifycationRight,
                            DepartmentId: $scope.user2.departmentId,
                        },
                        $http).success(function (responseData) {
                            $('.close').click();
                            $scope.getData($scope.currentPage);
                        }).error(errorHandlerNotPermission);
                }

            }).error(errorHandlerNotPermission);
    };

    $scope.sort = function (name) {
        if ($scope.sortName == name)
            $scope.sortAscending = !$scope.sortAscending;
        else $scope.sortAscending = true;
        $scope.sortName = name;
        $scope.getData($scope.currentPage);
    }

    $scope.doSearch = function (keyEvent) {
        if (keyEvent.which === 13)
            $scope.getData(1);
    }

    $scope.changePageSize = function () {
        var pageSize = $scope.search.pageSize;

        if (pageSize == undefined || pageSize === '') {
            $scope.limit = 10;
        } else {
            $scope.limit = parseInt($scope.search.pageSize);
        }

        $scope.getData($scope.currentPage);
    }

    $scope.getData = function (page) {
        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Từ khóa", $scope.search.keySearch)) {
            return false;
        }

        var pageSize = $scope.search.pageSize;

        if (pageSize == undefined || pageSize === '') {
            $scope.limit = 10;
        } else {
            $scope.limit = parseInt($scope.search.pageSize);
        }

        var limit = $scope.limit;
        if (!page)
            page = 1;

        $scope.currentPage = page;

        var sortAscending = "-";
        if ($scope.sortAscending) sortAscending = "";

        var url = '/api/employee?offset=' +
            ((page - 1) * limit) +
            '&limit=' +
            limit;
        if ($scope.search.name != undefined) {
            var username = $.trim($scope.search.userName);
            if (username != '') url += "&code=" + username;
        }

        if ($scope.search.address != undefined) {
            var address = $.trim($scope.search.address);
            if (address != '') url += "&name=" + address;
        }

        if ($scope.search.isActive != undefined && $scope.search.isActive != null && $scope.search.isActive != "") {
            var status = $.trim($scope.search.isActive);
            if (status != '') url += "&isActive=" + status;
        }

        get(url, {}, $http).success(function (responseData) {
            $scope.listhrmemployee = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.userName = '';
        $scope.search.email = '';
        $scope.search.status = '';
        $scope.search.createdDateFrom = '';
        $scope.search.createdDateTo = '';
        $scope.getData(1);
    }

    $scope.getData(1);
    $scope.resetField();
});