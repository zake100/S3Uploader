$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('category');
    AntData.BBVP.CommonAction.SetActiveMenu('company-list');
});

RootApp.controller('CompanyController', function ($scope, $http) {
    $scope.listCompany = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'name';
    $scope.company = {};
    $scope.limit = 10;
    $scope.search.pageSize = '10';

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.showInfoById = function (com) {
        $scope.company.id = com.id;
        $scope.company.code = com.code;
        $scope.company.name = com.name;
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
        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Từ khóa", $scope.search.name)) {
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

        var url = '/api/company?sort=' +
            sortAscending +
            $scope.sortName +
            '&offset=' +
            ((page - 1) * limit) +
            '&limit=' +
            limit;

        if ($scope.search.name != undefined) {
            var name = $.trim($scope.search.name);
            if (name != '') url += "&name=" + name;
        }

        if ($scope.search.code != undefined) {
            var code = $.trim($scope.search.code);
            if (code != '') url += "&code=" + code;
        }

        get(url, {}, $http).success(function (responseData) {
            $scope.listCompany = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.code = '';
        $scope.search.name = '';
        $scope.getData(1);
    }

    $scope.getData(1);
});