$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('explorer');
    AntData.BBVP.CommonAction.SetActiveMenu('sync-list');

    $('.date').datepicker({
    });
});

RootApp.controller('HRMEmployeeController', function ($scope, $http) {
    $scope.listsyncmodel = [];
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.checkAllCheckbox = false;
    $scope.sortAscending = false;
    $scope.sortName = 'employeeCode';

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listsyncmodel, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $scope.getCheckedIds = function () {
        var ids = [];
        for (var obj in $scope.listsyncmodel) {
            var area = $scope.listsyncmodel[obj];
            if (area.checked) {
                ids.push(area.id);
            }
        }
        return ids;
    }

    $scope.sync = function() {
        var ids = $scope.getCheckedIds();

        if (ids.length === 0) {
            bootbox.alert('Bạn phải chọn ít nhất một bản ghi để đồng bộ');
            return false;
        }

        bootbox.confirm('Bạn có chắc bạn muốn đồng bộ những bản ghi này?',
            function (result) {
                if (result) {
                    //Starting sync here
                    sendRequest('/api/employee/sync',
                        'POST',
                        {
                            selectedIds: ids,
                        },$http).success(function (responseData) {
                             $scope.getData(1);
                    }).error(errorHandlerNotPermission);
                }
            });
    }

    $scope.formatToDateTime = function (stDate) {
        if (stDate == undefined)
            return "";

        var date = new Date(stDate);
        return formatToDateTime(date);
    }

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

    $scope.getData = function (page) {
        sendRequest('/api/employee/GetSyncSap',
            'POST',
            {
                SyncType: $scope.search.syncType,
                LimitedDateRange: $scope.search.limitedDateRange,
            },
            $http).success(function (responseData) {
                $scope.listsyncmodel = responseData.data;
                $scope.currentPage = page;
                $scope.pageSize = responseData.paging.limit;
                $scope.total = responseData.paging.total;
                $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.getData(1);
    }
});