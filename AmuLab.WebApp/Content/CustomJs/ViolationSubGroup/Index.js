$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('category');
    AntData.BBVP.CommonAction.SetActiveMenu('violation-list');

    $("#searchViolationGroup, #searchDepartmentUpdate").each(function() {
        $(this).select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/ViolationGroup/searchforinfor',
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

    $("#searchCompany, #searchCompanyUpdate").each(function() {
        $(this).select2({
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
});

RootApp.controller('ViolationSubGroupController', function ($scope, $http) {
    $scope.listViolationSubGroup = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'code';
    $scope.violationSubGroup = {};
    $scope.violationSubGroup2 = {};
    $scope.limit = 10;
    $scope.listStatus = [];
    $scope.currentUser = {};
    $scope.permissionGroupList = [];
    $scope.permissionListProcessed = [];
    $scope.hasRolePermission = true;
    $scope.search.pageSize = '10';

    $scope.tree = [];
    $scope.tree2 = [];
    $scope.checkedCats = [];

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listUser, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $scope.resetField = function () {
        $scope.violationSubGroup.code = "";
        $scope.violationSubGroup.name = "";
        $scope.violationSubGroup.note = "";
        //$scope.user.password = "";

        $('#searchViolationGroup').val(null).trigger('change');
        $('#searchCompany').val(null).trigger('change');


        $('#searchViolationGroupUpdate').val(null).trigger('change');
        $('#searchCompanyUpdate').val(null).trigger('change');
    };

    $('#searchViolationGroup').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.violationSubGroup.violationGroupId = data.id;
    });

    $('#searchCompany').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.violationSubGroup.companyId = data.id;
    });

    $('#searchViolationGroup').on('select2:unselect', function (e) {
        $scope.violationSubGroup.violationGroupId = null;
    });

    $('#searchCompany').on('select2:unselect', function (e) {
        $scope.violationSubGroup.companyId = null;
    });

    $('#searchViolationGroupUpdate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.violationSubGroup2.violationGroupId = data.id;
    });

    $('#searchCompanyUpdate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.violationSubGroup2.companyId = data.id;
    });

    $('#searchViolationGroupUpdate').on('select2:unselect', function (e) {
        $scope.violationSubGroup2.violationGroupId = null;
    });

    $('#searchCompanyUpdate').on('select2:unselect', function (e) {
        $scope.violationSubGroup2.companyId = null;
    });

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

    $scope.showInfoById = function (violationSubGroup) {
        $scope.violationSubGroup2.id = violationSubGroup.id;
        $scope.violationSubGroup2.code = violationSubGroup.code;
        $scope.violationSubGroup2.name = violationSubGroup.name;
        $scope.violationSubGroup2.companyId = violationSubGroup.companyId;
        $scope.violationSubGroup2.violationGroupId = violationSubGroup.violationGroupId;
        $scope.violationSubGroup2.note = violationSubGroup.note;

        if (violationSubGroup.companyId) {
            var newOption = new Option(violationSubGroup.companyName, violationSubGroup.companyId, true, true);
            $('#searchCompanyUpdate').append(newOption).trigger('change');
        }

        if (violationSubGroup.violationGroupId) {
            var newOptionGroupId = new Option(violationSubGroup.groupName, violationSubGroup.violationGroupId, true, true);
            $('#searchViolationGroupUpdate').append(newOptionGroupId).trigger('change');
        }

        get('/api/ViolationSubGroup/GetMappingBySubGroupId/' + violationSubGroup.id, {}, $http).success(function (responseData) {
            $scope.violationSubGroup2.violationTypeMapping = responseData.data;

            setTimeout(function () {
                $scope.unCheckTree($scope.tree2[0]);
                $scope.checkTree($scope.tree2[0]);
                $scope.$applyAsync();
            }, 300);
        }).error(errorHandler);
    };

    $scope.create = function () {
        //Validataion Stuffs
        if (!AntData.BBVP.Validation.ValidateRequireField("Mã lỗi vi phạm", $scope.violationSubGroup.code)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Nhóm vi phạm", $scope.violationSubGroup.violationGroupId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Công ty/PnLs", $scope.violationSubGroup.companyId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Tên lỗi vi phạm", $scope.violationSubGroup.name)) {
            return false;
        }

        $scope.checkedCats = [];
        $scope.getCheckedCategories($scope.tree);

        var violationTypeMapping = [];

        for (var i = 0; i < $scope.checkedCats.length; i++) {
            violationTypeMapping.push($scope.checkedCats[i]);
        }

        sendRequest('/api/violationsubgroup',
                'POST',
                {
                    Code: $scope.violationSubGroup.code,
                    Name: $scope.violationSubGroup.name,
                    CompanyId: $scope.violationSubGroup.companyId,
                    ViolationGroupId: $scope.violationSubGroup.violationGroupId,
                    Note: $scope.violationSubGroup.note,
                    ViolationTypeMapping: violationTypeMapping
                },
                $http).success(function (responseData) {
                    $('.close').click();
                    $scope.getData(1);
                    $scope.resetField();
        }).error(errorHandlerNotPermission);
    };

    $scope.update = function (id) {
        //Validataion Stuffs
        if (!AntData.BBVP.Validation.ValidateRequireField("Mã lỗi vi phạm", $scope.violationSubGroup2.code)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Nhóm vi phạm", $scope.violationSubGroup2.violationGroupId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Công ty/PnLs", $scope.violationSubGroup2.companyId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Tên lỗi vi phạm", $scope.violationSubGroup2.name)) {
            return false;
        }

        $scope.checkedCats = [];
        $scope.getCheckedCategories($scope.tree2);

        var violationTypeMapping = [];

        for (var i = 0; i < $scope.checkedCats.length; i++) {
            violationTypeMapping.push($scope.checkedCats[i]);
        }

        sendRequest('/api/violationsubgroup/update/' + id,
            'POST',
            {
                Code: $scope.violationSubGroup2.code,
                Name: $scope.violationSubGroup2.name,
                CompanyId: $scope.violationSubGroup2.companyId,
                ViolationGroupId: $scope.violationSubGroup2.violationGroupId,
                Note: $scope.violationSubGroup2.note,
                ViolationTypeMapping: violationTypeMapping
            },
            $http).success(function (responseData) {
            $('.close').click();
            $scope.getData(1);
            $scope.resetField();
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

        var url = '/api/violationsubgroup?sort=' +
            sortAscending +
            $scope.sortName +
            '&offset=' +
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

        if ($scope.search.emailAddress != undefined) {
            var emailAddress = $.trim($scope.search.emailAddress);
            if (emailAddress != '') url += "&emailAddress=" + emailAddress;
        }

        if ($scope.search.isActive != undefined && $scope.search.isActive != null && $scope.search.isActive != "") {
            var status = $.trim($scope.search.isActive);
            if (status != '') url += "&isActive=" + status;
        }

        get(url, {}, $http).success(function (responseData) {
            $scope.listViolationSubGroup = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.code = '';
        $scope.search.groupName = '';
        $scope.search.code = '';
        $scope.getData(1);
    }

    $scope.checkTree = function (node) {
        if (!node.children)
            return false;
        for (var i = 0; i < $scope.violationSubGroup2.violationTypeMapping.length; i++) {
            var nodeResult = $scope.nodeSearch(node.children, $scope.violationSubGroup2.violationTypeMapping[i]);

            if (nodeResult) {
                nodeResult.chk = true;
            }
        }
    }

    $scope.unCheckTree = function (node) {
        if (!node.children)
            return false;
        for (var i = 0; i < node.children.length; i++) {
            var nodeResult = node.children[i];
            nodeResult.chk = false;
        }
    }

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

    $scope.setData = function (data) {
    };

    $scope.getCheckedCategories = function (data) {
        for (var index in data) {
            if (data[index].chk == true) {
                $scope.checkedCats.push(data[index].id);
            }
            $scope.getCheckedCategories(data[index].children);
        }
    }

    $scope.nodeSearch = function (treeNodes, searchID) {
        for (var nodeIdx = 0; nodeIdx <= treeNodes.length - 1; nodeIdx++) {
            var currentNode = treeNodes[nodeIdx];
            if (currentNode.id == searchID) {
                return currentNode;
            }
        }
        return false;
    };

    $scope.showParentSign = function (parentId) {
        if (parentId == 0) return "";
        var data = $scope.nodeSearch($scope.tree, parentId);
        if (!data) return "";
        return "-- " + $scope.showParentSign(data.parentId);
    }

    $scope.init = function () {
        get('/api/ViolationType?offset=0&limit=200&sort=name', {}, $http).success(function (responseData) {
            var tree = [{
                id: 0,
                name: "Tất cả",
                children: []
            }];
            tree[0].children = responseData.data;
            $scope.tree = tree;
            $scope.tree2 = tree;

            $scope.expandedTree($scope.tree);
            setTimeout(function () {
                $scope.resetField();
            }, 0);
        }).error(errorHandler);
    }

    $scope.resetField();
    $scope.getData(1);
    $scope.init();
});