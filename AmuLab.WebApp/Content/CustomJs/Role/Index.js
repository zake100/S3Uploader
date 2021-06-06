$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('Permission');
    AntData.BBVP.CommonAction.SetActiveMenu('Role');
});
RootApp.controller('RoleController', function ($scope, $http) {
    $scope.currentParentId = 0;
    $scope.permissionGroupList = [];
    $scope.permissionItemList = [];
    $scope.permissionGroupItemList = [];
    $scope.group = { name: "" };
    $scope.search = {};
    $scope.currentGroup = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'name';
    $scope.limit = 10;
    $scope.search.pageSize = '10';

    $scope.getDataGroup = function (page) {
        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Tên", $scope.search.keySearch)) {
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

        var url = '/api/role?sort=' +
            sortAscending +
            $scope.sortName +
            '&offset=' +
            ((page - 1) * limit) +
            '&limit=' +
            limit;

        if ($scope.search.keySearch != undefined) {
            var keySearch = $.trim($scope.search.keySearch);
            if (keySearch != '') url += "?name=" + keySearch;
        }

        get(url, {}, $http).success(function (responseData) {
            $scope.permissionGroupList = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandler);
    };

    $scope.resetForm = function () {
        $scope.group.name = '';
        $scope.group.description = '';
    };

    $scope.getGroup = function (group) {
        $scope.currentGroup = group;
    };

    $scope.deleteById = function (id) {
        bootbox.confirm("Bạn có muốn xóa quyền này không?", function (result) {
            if (result) {
                sendRequest('/api/role/delete/' + id, 'POST', {}, $http).success(function (responseData) {
                    $scope.getDataGroup(1);
                    //bootbox.alert('Xóa nhóm quyền thành công');
                }).error(errorHandlerNotPermission);
            }
        });
    };

    $scope.addPermissionGroup = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Tên", $scope.group.name))
            return false;
        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Tên", $scope.group.name))
            return false;

        post('/api/role', { Name: $scope.group.name, Description: $scope.group.description }, $http).success(function () {
            $scope.getDataGroup(1);
            $('#modalCreate').modal('hide');
            //bootbox.alert('Tạo mới nhóm quyền thành công');
        }).error(errorHandler);
    };

    $scope.updatePermissionGroup = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Tên", $scope.currentGroup.name))
            return false;
        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Tên", $scope.currentGroup.name))
            return false;

        sendRequest('/api/role/update', 'POST', { Id: $scope.currentGroup.id, Name: $scope.currentGroup.name, Description: $scope.currentGroup.description }, $http).success(function (responseData) {
            $('#modalUpdate').modal('hide');
            $scope.getDataGroup(1);
            //bootbox.alert('Cập nhật nhóm quyền thành công');
        }).error(errorHandler);
    };

    $scope.getAllPermissionItem = function () {
        get('/api/permission', {}, $http).success(function (responseData) {
            $scope.permissionItemList = responseData.data;
            for (var i = 0; i < $scope.permissionItemList.length; i++) {
                if ($scope.permissionItemList[i].name == 'IgnorePermission') {
                    $scope.permissionItemList.splice(i, 1);
                    break;
                }
            }
            $scope.getDataGroup(1);
        }).error(errorHandler);
    };

    $scope.chunk = function (arr) {
        var newArr = [];
        var namePermission = "";
        var size = 0;
        var pos = 0;

        for (var i = 0; i < arr.length; i++) {
            var name = arr[i].name;
            var index = name.indexOf("_");
            if (index > 0) {
                name = name.substr(0, index);
            }
            if (namePermission == "") namePermission = name;

            if (namePermission != name || i == arr.length - 1) {
                if (i == arr.length - 1)
                    size++;
                namePermission = name;
                newArr.push(arr.slice(pos, pos + size));
                pos = i;
                size = 0;
            }
            size++;
        }
        return newArr;
    };

    $scope.viewGroup = function (group) {
        $scope.currentGroup = group;
        $scope.permissionItemListProcessed = [];
        get('/api/role/' + group.id + '/permission', {}, $http).success(function (responseData) {
            $scope.permissionGroupItemList = responseData.data;
            for (var i = 0; i < $scope.permissionItemList.length; i++) {
                if ($scope.itemInItemGroup($scope.permissionItemList[i])) {
                    $scope.permissionItemList[i].checked = true;
                } else {
                    $scope.permissionItemList[i].checked = false;
                }
            }
            $scope.permissionItemListProcessed = $scope.chunk($scope.permissionItemList);
        }).error(errorHandler);
        $('#PermissionModal').modal('show');
    };

    $scope.itemInItemGroup = function (item) {
        for (var i = 0; i < $scope.permissionGroupItemList.length; i++) {
            var obj = $scope.permissionGroupItemList[i];
            if (item.id == obj.id)
                return true;
        }
        return false;
    };

    $scope.assignPermissionToGroup = function () {
        var sendData = [];
        for (var i in $scope.permissionItemListProcessed) {
            for (var j in $scope.permissionItemListProcessed[i]) {
                var obj = $scope.permissionItemListProcessed[i][j];
                if (obj.checked)
                    sendData.push({ Id: obj.id });
            }
        }
        sendRequest('/api/role/' + $scope.currentGroup.id + '/permission', 'POST', sendData, $http).success(function (responseData) {
            $('.close').click();
            //bootbox.alert("Lưu phân quyền thành công");
        }).error(errorHandler);
    };

    $scope.clearFilter = function () {
        $scope.search.keySearch = '';
        $scope.getDataGroup(1);
    }

    $scope.getAllPermissionItem();
});

RootApp.directive('indeterminateCheckbox', [function () {
    return {
        scope: true,
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var childList = attrs.childList;
            var property = attrs.property;

            // Bind the onChange event to update children
            element.bind('change', function () {
                scope.$apply(function () {
                    var isChecked = element.prop('checked');

                    // Set each child's selected property to the checkbox's checked property
                    angular.forEach(scope.$eval(childList), function (child) {
                        child[property] = isChecked;
                    });
                });
            });

            // Watch the children for changes
            scope.$watch(childList, function (newValue) {
                var hasChecked = false;
                var hasUnchecked = false;

                // Loop through the children
                angular.forEach(newValue, function (child) {
                    if (child[property]) {
                        hasChecked = true;
                    } else {
                        hasUnchecked = true;
                    }
                });

                // Determine which state to put the checkbox in
                if (hasChecked && hasUnchecked) {
                    element.prop('checked', false);
                    element.prop('indeterminate', true);
                    if (modelCtrl) {
                        modelCtrl.$setViewValue(false);
                    }
                } else {
                    element.prop('checked', hasChecked);
                    element.prop('indeterminate', false);
                    if (modelCtrl) {
                        modelCtrl.$setViewValue(hasChecked);
                    }
                }
            }, true);
        }
    };
}]);