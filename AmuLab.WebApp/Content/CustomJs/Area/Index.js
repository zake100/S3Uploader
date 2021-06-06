$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('category');
    AntData.BBVP.CommonAction.SetActiveMenu('area-list');

    $("#companyForCreate").select2({
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
                    Offset: (params.page || 0)*30,
                    Limit: 30,
                    SortQueryParam: "name"
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 0;
                return {
                    results: data.data,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
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

    $("#companyForUpdate").select2({
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
                    Offset: (params.page || 0) * 30,
                    Limit: 30,
                    SortQueryParam: "name"
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 0;
                return {
                    results: data.data,
                    pagination: {
                        more: (params.page * 30) < data.total_count
                    }
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

RootApp.controller('AreController', function ($scope, $http) {
    $scope.listArea = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'name';
    $scope.area = {};
    $scope.area2 = {};
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
        angular.forEach($scope.listArea, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $scope.resetField = function () {
        $scope.area.name = "";
        $scope.area.note = "";
        $scope.area.status = 0;
        $scope.area.companyId = null;
        $('#companyForCreate').val(null).trigger('change');
        $('#companyForUpdate').val(null).trigger('change');
    };

    $scope.formatDate = function (stDate) {
        if (stDate == undefined)
            return "";

        var date = new Date(stDate);
        return formatToDate(date);
    }

    $scope.getCheckedIds = function () {
        var ids = [];
        for (var obj in $scope.listArea) {
            var area = $scope.listArea[obj];
            if (area.checked) {
                ids.push(area.id);
            }
        }
        return ids;
    }

    $scope.activeById = function (id, isActive) {
        sendRequest('/api/user/' + id + '/status/' + isActive, 'POST', {}, $http).success(
            function (responseData) {
                $scope.getData($scope.currentPage);
            }).error(errorHandlerNotPermission);
    };

    $scope.enableAllChecked = function () {
        $scope.changeStatusAllChecked(1);
    };

    $scope.disableAllChecked = function () {
        $scope.changeStatusAllChecked(0);
    };

    $scope.showInfoById = function (area) {
        $scope.area2.id = area.id;
        $scope.area2.name = area.name;
        $scope.area2.note = area.note;
        $scope.area2.archivedStatus = area.archivedStatus;
        $scope.area2.companyId = area.companyId;

        if (area.companyId) {
            var newOption = new Option(area.companyName, area.companyId, true, true);
            $('#companyForUpdate').append(newOption).trigger('change');
        }
    };

    $('#companyForCreate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.area.companyId = data.id;
    });
    $('#companyForCreate').on('select2:unselect', function (e) {
        $scope.area.companyId = null;
    });

    $('#companyForUpdate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.area2.companyId = data.id;
    });
    $('#companyForUpdate').on('select2:unselect', function (e) {
        $scope.area2.companyId = null;
    });

    $scope.create = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Tên khu vực", $scope.area.name)) {
            return false;
        }

        sendRequest('/api/area',
            'POST',
            {
                Name: $scope.area.name,
                Note: $scope.area.note,
                ArchivedStatus: $scope.area.archivedStatus,
                CompanyId: $scope.area.companyId
            },
            $http).success(function (responseData) {
                $('.close').click();
                $scope.getData(1);
                $scope.resetField();
            }).error(errorHandlerNotPermission);
    };

    $scope.update = function (id) {
        if (!AntData.BBVP.Validation.ValidateRequireField("Tên khu vực", $scope.area2.name)) {
            return false;
        }

        sendRequest('/api/area/update/' + id,
            'POST',
            {
                Id: $scope.area2.id,
                Name: $scope.area2.name,
                Note: $scope.area2.note,
                ArchivedStatus: $scope.area2.archivedStatus,
                CompanyId: $scope.area2.companyId
            },
            $http).success(function (responseData) {
                $('.close').click();
                $scope.getData($scope.currentPage);
            }).error(errorHandlerNotPermission);
    };

    $scope.deleteAllChecked = function () {
        var ids = $scope.getCheckedIds();

        if (ids.length == 0) {
            bootbox.alert('Bạn phải chọn ít nhất một khu vực');
            return false;
        }

        bootbox.confirm('Bạn có chắc bạn muốn xóa những khu vực này?',
            function (result) {
                if (result) {
                    var countRequest = 0;
                    for (var index in ids) {
                        var id = ids[index];
                        sendRequest('/api/area/delete/' + id, 'POST', {}, $http).success(
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
        bootbox.confirm('Bạn có chắc bạn muốn xóa khu vực này?',
            function (result) {
                if (result) {
                    sendRequest('/api/area/delete/' + id, 'POST', {}, $http).success(function (responseData) {
                        //bootbox.alert('Xóa thành công');
                        $scope.getData($scope.currentPage);
                    }).error(errorHandlerNotPermission);
                }
            });
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
        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Tên khu vực", $scope.search.name)) {
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

        var url = '/api/area?sort=' +
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

        if ($scope.search.note != undefined) {
            var note = $.trim($scope.search.note);
            if (note != '') url += "&note=" + note;
        }

        get(url, {}, $http).success(function (responseData) {
            $scope.listArea = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.name = '';
        $scope.search.note = '';
        $scope.getData(1);
    }

    $scope.resetField();
    $scope.getData(1);
});