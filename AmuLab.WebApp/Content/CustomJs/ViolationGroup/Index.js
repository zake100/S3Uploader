$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('category');
    AntData.BBVP.CommonAction.SetActiveMenu('violationgroup-list');

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

    $("#searchCompanyBox").select2({
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

RootApp.controller('ViolationGroupController', function ($scope, $http) {
    $scope.listViolationGroup = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'code';
    $scope.violationGroup = {};
    $scope.violationGroup2 = {};

    $scope.treeProduct = [];
    $scope.treeProduct2 = [];

    $scope.limit = 10;
    $scope.search.pageSize = '10';

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listUser, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $('#companyForCreate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.violationGroup.companyId = data.id;
    });
    $('#companyForCreate').on('select2:unselect', function (e) {
        $scope.violationGroup.companyId = null;
    });

    $('#companyForUpdate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.violationGroup2.companyId = data.id;
    });
    $('#companyForUpdate').on('select2:unselect', function (e) {
        $scope.violationGroup2.companyId = null;
    });

    $('#searchCompanyBox').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.companyId = data.id;
    });
    $('#searchCompanyBox').on('select2:unselect', function (e) {
        $scope.search.companyId = null;
    });

    $scope.resetField = function () {
        $scope.violationGroup.name = "";
        $scope.violationGroup.note = "";
        $scope.violationGroup.code = "";
        $scope.violationGroup.status = 0;
        $scope.violationGroup.companyId = null;

        $('#companyForCreate').val(null).trigger('change');
        $('#companyForUpdate').val(null).trigger('change');
    };


    $scope.expandedParent = function (parentId, tree) {
        if (parentId > 0) {
            var dataParent = $scope.nodeSearch(tree, parentId);
            if (dataParent) {
                dataParent.expanded = true;
                $scope.expandedParent(dataParent.parentId, tree);
            }
        }
    }

    $scope.expandedTree = function (tree) {
        if (tree != undefined) {
            tree[0].expanded = true;
            angular.forEach(tree[0].children, function (elements) {
                elements.expanded = false;
                $scope.setDataDisabled(elements, false);
            });
        }
    }

    $scope.expandedTreeProduct = function (tree) {
        if (tree != undefined) {
            angular.forEach(tree, function (elements) {
                elements.expanded = false;
            });
        }
    }

    $scope.setDataDisabled = function (elements, isDisabled) {
        $('#chkTree_2' + elements.id).prop('disabled', isDisabled);
        angular.forEach(elements.children, function (child) {
            $scope.setDataDisabled(child, isDisabled);
        });
    }

    $scope.setCategoryParent = function (parentId) {
        $scope.category.parentId = parentId;
    }

    $scope.setCategoryParent2 = function (parentId) {
        $scope.category2.parentId = parentId;
    }


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
    
    $scope.enableAllChecked = function () {
        $scope.changeStatusAllChecked(1);
    };

    $scope.disableAllChecked = function () {
        $scope.changeStatusAllChecked(0);
    };

    $scope.showInfoById = function (violationGroup) {
        $scope.violationGroup2.id = violationGroup.id;
        $scope.violationGroup2.name = violationGroup.name;
        $scope.violationGroup2.note = violationGroup.note;
        $scope.violationGroup2.code = violationGroup.code;
        $scope.violationGroup2.companyId = violationGroup.companyId;
        $scope.violationGroup2.status = violationGroup.status;

        if (violationGroup.companyId) {
            var newOption = new Option(violationGroup.companyName, violationGroup.companyId, true, true);
            $('#companyForUpdate').append(newOption).trigger('change');
        }
    };

    $scope.create= function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Mã nhóm vi phạm", $scope.violationGroup.name)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Tên nhóm vi phạm", $scope.violationGroup.code)) {
            return false;
        }
        sendRequest('/api/violationgroup',
            'POST',
            {
                Name: $scope.violationGroup.name,
                Note: $scope.violationGroup.note,
                Code: $scope.violationGroup.code,
                Status: $scope.violationGroup.status,
                CompanyId: $scope.violationGroup.companyId,
            },
            $http).success(function (responseData) {
            $('.close').click();
            $scope.getData(1);
            $scope.resetField();
        }).error(errorHandlerNotPermission);
    };

    $scope.update = function (id) {
        if (!AntData.BBVP.Validation.ValidateRequireField("Mã nhóm vi phạm", $scope.violationGroup2.name)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Tên nhóm vi phạm", $scope.violationGroup2.code)) {
            return false;
        }
        sendRequest('/api/violationgroup/update/' + id,
            'POST',
            {
                Id: $scope.violationGroup2.id,
                Name: $scope.violationGroup2.name,
                Note: $scope.violationGroup2.note,
                Code: $scope.violationGroup2.code,
                Status: $scope.violationGroup2.status,
                CompanyId: $scope.violationGroup2.companyId,
            },
            $http).success(function (responseData) {
            $('.close').click();
            $scope.getData($scope.currentPage);
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

        var url = '/api/violationgroup?sort=' +
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

        if ($scope.search.note != undefined) {
            var note = $.trim($scope.search.note);
            if (note != '') url += "&note=" + note;
        }

        if ($scope.search.companyId) {
            url += "&companyId=" + $scope.search.companyId;
        }

        get(url, {}, $http).success(function (responseData) {
            $scope.listViolationGroup = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.name = '';
        $scope.search.code = '';
        $scope.search.note = '';
        $scope.search.companyId = null;
        $('#searchCompanyBox').val(null).trigger('change');
        $scope.getData(1);
    }

   
    $scope.getData(1);
    $scope.resetField();
});