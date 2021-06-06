$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('category');
    AntData.BBVP.CommonAction.SetActiveMenu('violationtype-list');
});

RootApp.controller('ViolationTypeController', function ($scope, $http) {
    $scope.listViolationType = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'name';
    $scope.violationtype = {};
    $scope.violationtype2 = {};
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

    $scope.showInfoById = function (vio) {
        $scope.violationtype2.id = vio.id;
        $scope.violationtype2.name = vio.name;
        $scope.violationtype2.note = vio.note;
        $scope.violationtype2.penPoint = vio.penPoint;
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

        var url = '/api/violationtype?sort=' +
            sortAscending +
            $scope.sortName +
            '&offset=' +
            ((page - 1) * limit) +
            '&limit=' +
            limit;
        //if ($scope.search.id != undefined) {
        //    var id = $.trim($scope.search.id);
        //    if (id != '') url += "&id=" + id;
        //}

        if ($scope.search.name != undefined) {
            var name = $.trim($scope.search.name);
            if (name != '') url += "&name=" + name;
        }

        //if ($scope.search.isActive != undefined && $scope.search.isActive != null && $scope.search.isActive != "") {
        //    var status = $.trim($scope.search.isActive);
        //    if (status != '') url += "&isActive=" + status;
        //}

        get(url, {}, $http).success(function (responseData) {
            $scope.listViolationType = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.id = '';
        $scope.search.name = '';
        $scope.getData(1);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listViolationType, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $scope.resetField = function () {
        $scope.violationtype.name = "";
        $scope.violationtype.note = "";
        $scope.violationtype.penPoint = "";
    };

    $scope.formatToDateTime = function (stDate) {
        if (stDate == undefined)
            return "";

        var date = new Date(stDate);
        return formatToDateTime(date);
    }

    $scope.getCheckedIds = function () {
        var ids = [];
        for (var obj in $scope.listViolationType) {
            var vio = $scope.listViolationType[obj];
            if (vio.checked) {
                ids.push(vio.id);
            }
        }
        return ids;
    }

    $scope.deleteAllChecked = function () {
        var ids = $scope.getCheckedIds();

        if (ids.length == 0) {
            bootbox.alert('Bạn phải chọn ít nhất một hình thức xử lý');
            return false;
        }

        bootbox.confirm('Bạn có chắc bạn muốn xóa những hình thức xử lý này?',
            function (result) {
                if (result) {
                    var countRequest = 0;
                    for (var index in ids) {
                        var id = ids[index];
                        sendRequest('/api/violationtype/delete/' + id, 'POST', {}, $http).success(
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
        bootbox.confirm('Bạn có chắc bạn muốn xóa hình thức xử lý này?',
            function (result) {
                if (result) {
                    sendRequest('/api/violationtype/delete/' + id, 'POST', {}, $http).success(function (responseData) {
                        //bootbox.alert('Xóa thành công');
                        $scope.getData($scope.currentPage);
                    }).error(errorHandlerNotPermission);
                }
            });
    };

    $scope.activeById = function (id, isActive) {
        sendRequest('/api/violationtype/' + id + '/status/' + isActive, 'POST', {}, $http).success(
            function (responseData) {
                //bootbox.alert(isActive == 1 ? 'bỏ' : '' + 'kích hoạt thành công');
                $scope.getData($scope.currentPage);
            }).error(errorHandlerNotPermission);
    };

    //$scope.changeStatusAllChecked = function (status) {
    //    var ids = $scope.getCheckedIds();

    //    if (ids.length == 0) {
    //        bootbox.alert('@string.Format(Resources.m_select_at_least_one, Resources.t_user)');
    //        return false;
    //    }
    //    var message;
    //    if (status == 0) {
    //        message = '@string.Format(Resources.m_confirm_action_multi, Resources.bt_active.ToLower(), Resources.t_user)';
    //    } else {
    //        message = '@string.Format(Resources.m_confirm_action_multi, Resources.bt_inactive.ToLower(), Resources.t_user)';
    //    }
    //    bootbox.confirm(message,
    //        function (result) {
    //            if (result) {
    //                var action = 'status';
    //                var countRequest = 0;
    //                for (var index in ids) {
    //                    var id = ids[index];
    //                    sendRequest('/api/violationtype/' + id + '/' + action + '/' + status, 'POST', {}, $http).success(
    //                        function (responseData) {
    //                            countRequest += 1;
    //                            if (countRequest == ids.length) {
    //                                //bootbox.alert('Thay đổi thành công');
    //                                $scope.getData($scope.currentPage);
    //                            }
    //                        }).error(errorHandlerNotPermission);
    //                }
    //            }
    //        });
    //};

    $scope.enableAllChecked = function () {
        $scope.changeStatusAllChecked(1);
    };

    $scope.disableAllChecked = function () {
        $scope.changeStatusAllChecked(0);
    };

    $scope.create = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Nội dung xử lý", $scope.violationtype.name)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Ghi chú", $scope.violationtype.note)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Điểm trừ", $scope.violationtype.penPoint)) {
            return false;
        }

        sendRequest('/api/violationtype',
            'POST',
            {
                Name: $scope.violationtype.name,
                Note: $scope.violationtype.note,
                PenPoint: $scope.violationtype.penPoint
            },
            $http).success(function (responseData) {
                $('.close').click();
                $scope.getData(1);
                $scope.resetField();
            }).error(errorHandlerNotPermission);
    };

    $scope.update = function (id) {
        if (!AntData.BBVP.Validation.ValidateRequireField("Nội dung xử lý", $scope.violationtype2.name)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Ghi chú", $scope.violationtype2.note)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Điểm trừ", $scope.violationtype2.penPoint)) {
            return false;
        }

        sendRequest('/api/violationtype/update/' + id,
            'POST',
            {
                Id: $scope.violationtype2.id,
                Name: $scope.violationtype2.name,
                Note: $scope.violationtype2.note,
                PenPoint: $scope.violationtype2.penPoint
            },
            $http).success(function (responseData) {
                $('.close').click();
                $scope.getData($scope.currentPage);
            }).error(errorHandlerNotPermission);
    };

    $scope.getData(1);
    $scope.resetField();
});