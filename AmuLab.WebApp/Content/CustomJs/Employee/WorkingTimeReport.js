$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('explorer');
    AntData.BBVP.CommonAction.SetActiveMenu('workingtime-list');

    $("#companyForSearch").select2({
        minimumInputLength: 0,
        allowClear: true,
        multiple: false,
        ajax: {
            url: '/api/company/searchforinfor',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    Name: params.term,
                    Offset: 0,
                    Limit: 30,
                    SortQueryParam: "name"
                };
            },
            processResults: function (data, params) {
                return {
                    results: data
                };
            }
        },
        placeholder: 'Tất cả',
        escapeMarkup: function (markup) { return markup; },
        templateResult: function (results) {
            if (results) {
                var rs = JSON.stringify(results);
                var json = JSON.parse(rs);
                return "<div title='" + json["text"] + "' id='" + json["id"] + "'>" + json["text"] + "</div>";
            }
            return "<div title='' id=''></div>";
        },
        templateSelection: function (results) {
            return "<div style='float:left;' id='" + results.id + "'>" + results.text + "</div>";
        }
    });
});

RootApp.controller('HRMEmployeeController', function ($scope, $http) {
    $scope.listtimesheetworking = [];
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'employeeCode';

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $('#companyForSearch').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.companyId = data.id;
    });
    $('#companyForSearch').on('select2:unselect', function (e) {
        $scope.search.companyId = null;
    });

    $scope.formatDate = function (stDate) {
        if (stDate == undefined)
            return "";

        var date = new Date(stDate);
        return formatToDate(date);
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
        sendRequest('/api/employee/timekeepingreport',
            'POST',
            {
                CompanyId: $scope.search.companyId
            },
            $http).success(function (responseData) {
                $scope.listtimesheetworking = responseData.data;
                $scope.currentPage = page;
                $scope.pageSize = responseData.paging.limit;
                $scope.total = responseData.paging.total;
                $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $('#companyForSearch').val(null).trigger('change');
        $scope.getData(1);
    }

    $scope.getData(1);
});