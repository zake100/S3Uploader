$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('System');
    AntData.BBVP.CommonAction.SetActiveMenu('Notification');

    $('.date-picker1').datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
        language: 'pt-BR'
    });

    $("#searchUser").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/user/searchforselect2',
                dataType: 'json',
                type: "POST",
                data: function (params) {
                    return {
                        UserName: params.term,
                        Offset: (params.page || 0)*20,
                        Limit: 20,
                        RightDepartmentId: null,
                        SortQueryParam: "userName"
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 0;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 20) < data.total_count && data.total_count > 20
                        }
                    };
                }
            },
            placeholder: '',
            dropdownParent: $('#searchUser').parent(),
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

    $("#searchParamUserID").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/user/searchforselect2',
                dataType: 'json',
                type: "POST",
                data: function (params) {
                    return {
                        UserName: params.term,
                        Offset: (params.page || 0)*20,
                        Limit: 20,
                        RightDepartmentId: null,
                        SortQueryParam: "userName"
                    };
                },
                processResults: function (data, params) {
                    params.page = params.page || 0;
                    return {
                        results: data.data,
                        pagination: {
                            more: (params.page * 20) < data.total_count && data.total_count > 20
                        }
                    };
                }
            },
            placeholder: '',
            dropdownParent: $('#searchParamUserID').parent(),
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

    $("#createParamUserID").select2({
        minimumInputLength: 0,
        allowClear: true,
        multiple: false,
        ajax: {
            url: '/api/user/searchforselect2',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    UserName: params.term,
                    Offset: (params.page || 0) * 20,
                    Limit: 20,
                    RightDepartmentId: null,
                    SortQueryParam: "userName"
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 0;
                return {
                    results: data.data,
                    pagination: {
                        more: (params.page * 20) < data.total_count && data.total_count > 20
                    }
                };
            }
        },
        placeholder: '',
        dropdownParent: $('#createParamUserID').parent(),
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

RootApp.controller('NotifycationController', function ($scope, $http) {
    $scope.listArea = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = '';
    $scope.notifCreate = {};
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

    //$scope.checkAll = function () {
    //    angular.forEach($scope.listUser, function (item) {
    //        item.checked = $scope.checkAllCheckbox;
    //    });
    //};

    $scope.resetField = function () {
        $scope.notifCreate.timePic = "";
        $scope.notifCreate.typePic = "";
        $scope.notifCreate.paramUserID = "";
        $scope.notifCreate.description = "";
    };

    $scope.formatDate = function (stDate) {
        if (stDate == undefined)
            return "";

        var date = new Date(stDate);
        return formatToDate(date);
    }

    //$scope.getCheckedIds = function () {
    //    var ids = [];
    //    for (var obj in $scope.listUser) {
    //        var user = $scope.listUser[obj];
    //        if (user.checked) {
    //            ids.push(user.id);
    //        }
    //    }
    //    return ids;
    //}

    //$scope.deleteAllChecked = function () {
    //    var ids = $scope.getCheckedIds();

    //    if (ids.length == 0) {
    //        bootbox.alert('@string.Format(Resources.m_select_at_least_one, Resources.t_user)');
    //        return false;
    //    }

    //    bootbox.confirm('@string.Format(Resources.m_confirm_action_multi, Resources.bt_delete.ToLower() ,Resources.t_user)',
    //        function (result) {
    //            if (result) {
    //                var countRequest = 0;
    //                for (var index in ids) {
    //                    var id = ids[index];
    //                    sendRequest('/api/user/delete/' + id, 'POST', {}, $http).success(
    //                        function (responseData) {
    //                            countRequest += 1;
    //                            if (countRequest == ids.length) {
    //                                $scope.getData($scope.currentPage);
    //                            }
    //                        }).error(errorHandlerNotPermission);
    //                }
    //            }
    //        });
    //};

    //$scope.deleteById = function (id) {
    //    bootbox.confirm('@string.Format(Resources.m_confirm_action_one, Resources.bt_delete.ToLower(), Resources.t_user)',
    //        function (result) {
    //            if (result) {
    //                sendRequest('/api/user/delete/' + id, 'POST', {}, $http).success(function (responseData) {
    //                    //bootbox.alert('Xóa thành công');
    //                    $scope.getData($scope.currentPage);
    //                }).error(errorHandlerNotPermission);
    //            }
    //        });
    //};

    //$scope.activeById = function (id, isActive) {
    //    sendRequest('/api/user/' + id + '/status/' + isActive, 'POST', {}, $http).success(
    //        function (responseData) {
    //            //bootbox.alert(isActive == 1 ? 'bỏ' : '' + 'kích hoạt thành công');
    //            $scope.getData($scope.currentPage);
    //        }).error(errorHandlerNotPermission);
    //};

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
    //                    sendRequest('/api/user/' + id + '/' + action + '/' + status, 'POST', {}, $http).success(
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

    //$scope.enableAllChecked = function () {
    //    $scope.changeStatusAllChecked(1);
    //};

    //$scope.disableAllChecked = function () {
    //    $scope.changeStatusAllChecked(0);
    //};

    //$scope.showInfoById = function (user) {
    //    $scope.user2.id = user.id;
    //    $scope.user2.userName = user.userName;
    //    $scope.user2.fullName = user.fullName;
    //    $scope.user2.email = user.email;
    //    $scope.user2.status = user.status;
    //    $scope.user2.allowNotifycation = user.allowNotifycation;
    //    $scope.user2.allowNotifycationRight = user.allowNotifycationRight;
    //    $scope.user2.jobPosition = user.jobPosition;
    //    $scope.user2.departmentId = user.departmentId;
    //};

    $scope.createNotifycation = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Loại", $scope.notifCreate.typePic)) {
            return false;
        }
        if (!AntData.BBVP.Validation.ValidateRequireField("Thời gian", $scope.notifCreate.timePic)) {
            return false;
        }
        if (!AntData.BBVP.Validation.ValidateRequireField("Đối tượng", $scope.notifCreate.paramUserID)) {
            return false;
        }
        if (!AntData.BBVP.Validation.ValidateRequireField("Ghi chú", $scope.notifCreate.description)) {
            return false;
        }
        sendRequest('/api/notifycation/create',
            'POST',
            {
                TimePic: format_Date_ddMMyyyy($scope.notifCreate.timePic),
                TypePic: $scope.notifCreate.typePic,
                Description: $scope.notifCreate.description,
                ParamUserID: $scope.notifCreate.paramUserID
            },
            $http).success(function (responseData) {
                $('.close').click();
                //bootbox.alert('Tạo mới người dùng thành công');
                $scope.getData(1);
                $scope.resetField();
            }).error(errorHandlerNotPermission);
    };

    //$scope.updateNotifycation = function (id) {
    //    //if (!AntData.BBVP.Validation.ValidateRequireField("Tên đăng nhập", $scope.user2.userName)) {
    //    //    return false;
    //    //}

    //    sendRequest('/api/notifycation/update' + id,
    //        'POST',
    //        {
    //            //UserPic: $scope.notifUpdate.userPic,
    //            TimePic: $scope.notifUpdate.timePic,
    //            TypePic: $scope.notifUpdate.typePic,
    //            Description: $scope.notifUpdate.description,
    //            ParamUserID: $scope.notifUpdate.paramUserID
    //        },
    //        $http).success(function (responseData) {
    //            $('.close').click();
    //            $scope.getData($scope.currentPage);
    //        }).error(errorHandlerNotPermission);
    //}

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

    $('#searchUser').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.userPic = data.text;
    });

     $('#searchParamUserID').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.paramUserID = data.text;
    });
     $('#createParamUserID').on('select2:select', function (e) {
         var data = e.params.data;
         $scope.notifCreate.paramUserID = data.text;
     });
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

        var sortAscending = "";
        if ($scope.sortAscending) {
            sortAscending = "";
        };

        var url = '/api/notifycation/search';

        sendRequest(url, 'POST',
            {
                Offset: ((page - 1) * limit),
                Limit: limit,
                UserPic: $scope.search.userPic,
                TimePic: format_Date_ddMMyyyy($scope.search.timePic),
                TypePic: $scope.search.typePic,
                ParamUserID: $scope.search.paramUserID,
                SortQueryParam: null,
                DepartmentName: $scope.search.departmentName
            }, $http).success(function (responseData) {
                $scope.listNotification = responseData.data;
                $scope.currentPage = page;
                $scope.pageSize = responseData.paging.limit;
                $scope.total = responseData.paging.total;
                $scope.paging = responseData.paging;
            }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.userPic = '';
        $scope.search.timePic = '';
        $scope.search.typePic = '';
        $scope.search.paramUserID = '';
        $('#searchParamUserID').val(null).trigger('change');
        $('#searchTypePic').val([]);
        $('#searchUser').val(null).trigger('change');
        $scope.getData(1);       
    }

    $scope.getData(1);
    $scope.resetField();
});