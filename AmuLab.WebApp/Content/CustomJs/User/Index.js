$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('Permission');
    AntData.BBVP.CommonAction.SetActiveMenu('User');
    AntData.BBVP.CommonAction.ResgistSearchDateControls('.date-from', '.date-to');
    //UserValidate.init();
    $("#departmentForCreate").select2({
        minimumInputLength: 1,
        allowClear: true,
        multiple: false,
        ajax: {
            url: '/api/department/searchdepartmentforuser',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    Name: params.term,
                    Offset: params.page || 0,
                    Limit: 20,
                    SortQueryParam: "-createdDate"
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
        placeholder: '',
        dropdownParent: $('#departmentForCreate').parent(),
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

    $("#departmentForUpdate").select2({
        minimumInputLength: 1,
        allowClear: true,
        multiple: false,
        ajax: {
            url: '/api/department/searchdepartmentforuser',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    Name: params.term,
                    Offset: params.page || 0,
                    Limit: 20,
                    SortQueryParam: "-createdDate"
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
        placeholder: '',
        dropdownParent: $('#departmentForUpdate').parent(),
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

    $("#searchDepartment").select2({
        minimumInputLength: 0,
        allowClear: true,
        multiple: false,
        ajax: {
            url: '/api/department/searchdepartmentforuser',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    Name: params.term,
                    Offset: params.page || 0,
                    Limit: 20,
                    SortQueryParam: "-createdDate"
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
        placeholder: '',
        dropdownParent: $('#searchDepartment').parent(),
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

    $("#rightDepartmentForCreate").select2({
        minimumInputLength: 0,
        allowClear: true,
        multiple: true,
        ajax: {
            url: '/api/department/searchdepartmentforuser',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    Name: params.term,
                    Offset: params.page || 0,
                    Limit: 20,
                    SortQueryParam: "-createdDate"
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
        placeholder: '',
        dropdownParent: $('#rightDepartmentForCreate').parent(),
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

    $("#rightDepartmentForUpdate").select2({
        minimumInputLength: 0,
        allowClear: true,
        multiple: true,
        ajax: {
            url: '/api/department/searchdepartmentforuser',
            dataType: 'json',
            type: "POST",
            data: function (params) {
                return {
                    Name: params.term,
                    Offset: params.page || 0,
                    Limit: 20,
                    SortQueryParam: "-createdDate"
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
        placeholder: '',
        dropdownParent: $('#rightDepartmentForUpdate').parent(),
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

var UserValidate = function () {
    var handleValidate = function () {
        $('#createUserForm').validate({
            errorElement: 'div', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input

            invalidHandler: function () { //display error alert on form submit
                $('.alert-danger', $('#createUserForm')).show();
            },

            highlight: function (element) { // hightlight error inputs
                debugger;
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                if (element.is('input[type=radio]') || element.is('input[type=checkbox]')) {
                    element.closest('.form-group').append(error);
                } else {
                    error.insertAfter(element.closest('.input-icon'));
                }
            }
        });

        $('#updateUserForm').validate({
            errorElement: 'div', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input

            invalidHandler: function () { //display error alert on form submit
                $('.alert-danger', $('#updateUserForm')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                if (element.is('input[type=radio]') || element.is('input[type=checkbox]')) {
                    element.closest('.form-group').append(error);
                } else {
                    error.insertAfter(element.closest('.input-icon'));
                }
            }
        });

        $("#userNameForCreate").rules("add", {
            required: true,
            maxlength: 20,
            messages: {
                required: 'Bạn phải điền thông tin tên đăng nhập hệ thống'
                , maxlength: 'Tối đã 20 kí tự cho phép'
            }
        });
    };

    return {
        init: function () {
            handleValidate();
        }
    };
}();

RootApp.controller('UserController', function ($scope, $http) {
    $scope.listUser = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'createdDate';
    $scope.user = {};
    $scope.user2 = {};
    $scope.limit = 10;
    $scope.listStatus = [];
    $scope.currentUser = {};
    $scope.permissionGroupList = [];
    $scope.permissionListProcessed = [];
    $scope.hasRolePermission = true;
    $scope.search.pageSize = '10';
    $scope.user.userTypeId = 1;

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listUser, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $('#departmentForCreate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.user.departmentId = data.id;
    });

    $('#departmentForCreate').on('select2:unselect', function (e) {
        $scope.user.departmentId = null;
    });

    $('#departmentForUpdate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.user2.departmentId = data.id;
    });

    $('#departmentForUpdate').on('select2:unselect', function (e) {
        $scope.user2.departmentId = null;
    });

    $('#searchDepartment').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.departmentId = data.id;
    });

    $('#searchDepartment').on('select2:unselect', function (e) {
        $scope.search.departmentId = null;
    });

    $scope.resetField = function () {
        $scope.user.userName = "";
        $scope.user.email = "";
        $scope.user.status = 1;
        $scope.user.password = "";
        $scope.user.jobPosition = "";
        $scope.user.departmentId = "";
        $('#departmentForCreate').val(null).trigger('change');
        $scope.user.fullName = "";
        $scope.user.confirmPassword = "";
        $scope.user2.userTypeId = 1;
        $("#rightDepartmentForCreate").val(null).trigger('change');
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
            bootbox.alert('Bạn phải chọn ít nhất một người dùng');
            return false;
        }

        bootbox.confirm('Bạn có chắc bạn muốn xóa những người dùng này?',
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
        bootbox.confirm('Bạn có chắc bạn muốn xóa user này?',
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
        $scope.user2.departmentName = user.departmentName;
        $scope.user2.userTypeId = user.userTypeId;
        if (user.departmentId) {
            var newOption = new Option(user.departmentName, user.departmentId, true, true);
            $('#departmentForUpdate').append(newOption).trigger('change');
        }
        $scope.user2.password = null;
        $scope.user2.confirmPassword = null;
    };

    $scope.createUser = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Tên đăng nhập", $scope.user.userName)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Mật khẩu", $scope.user.password)) {
            return false;
        }

        if ($scope.user.password !== $scope.user.confirmPassword) {
            bootbox.alert('Mật khẩu mới và mật khẩu xác nhận không trùng nhau');
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
                        UserTypeId: $scope.user.userTypeId,
                        RightDepartment: $('#rightDepartmentForCreate').val()
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

        if ($scope.user2.password !== $scope.user2.confirmPassword) {
            bootbox.alert('Mật khẩu mới và mật khẩu xác nhận không trùng nhau');
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
                            Password: $scope.user2.password,
                            Status: $scope.user2.status,
                            JobPosition: $scope.user2.jobPosition,
                            AllowNotifycation: $scope.user2.allowNotifycation,
                            AllowNotifycationRight: $scope.user2.allowNotifycationRight,
                            DepartmentId: $scope.user2.departmentId,
                            UserTypeId: $scope.user2.userTypeId,
                            RightDepartment: $('#rightDepartmentForUpdate').val()
                        },
                        $http).success(function (responseData) {
                            $('.close').click();
                            //bootbox.alert('Cập nhật thông tin người dùng thành công');
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

        var url = '/api/user/search';

        sendRequest(url,'POST',
            {
                Offset: ((page - 1) * limit),
                Limit: limit,
                UserName: $scope.search.userName,
                FullName: $scope.search.fullName,
                DepartmentId: $scope.search.departmentId,
                Status: $scope.search.status,
                SortQueryParam: sortAscending + $scope.sortName,
                DepartmentName: $scope.search.departmentName
            }, $http).success(function (responseData) {
            $scope.listUser = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.viewGroup = function (user) {
        $scope.currentUser = user;
        for (var i = 0; i < $scope.permissionGroupList.length; i++) {
            $scope.permissionGroupList[i].checked = false;
        }
        get("/api/role/" + user.id + "/authassignment", {}, $http).success(function (responseData) {
            $scope.permissionListProcessed = responseData.data;
            for (var i = 0; i < $scope.permissionGroupList.length; i++) {
                for (var j = 0; j < $scope.permissionListProcessed.length; j++) {
                    if ($scope.permissionListProcessed[j].groupId == $scope.permissionGroupList[i].id) {
                        $scope.permissionGroupList[i].checked = true;
                        break;
                    }
                }
            }
        }).error(errorHandlerNotPermission);
        //$('#myModalPermission').modal('show');
    };

    $scope.getAllGroupPermission = function () {
        get('/api/role', {}, $http).success(function (responseData) {
            $scope.permissionGroupList = responseData.data;
            //$scope.getData(1);
        }).error(function () {
            $scope.hasRolePermission = false;
        });
    };

    $scope.assignPermissionGroupToUser = function () {
        var sendData = [];
        for (var i = 0; i < $scope.permissionGroupList.length; i++) {
            if ($scope.permissionGroupList[i].checked)
                sendData.push({ Id: $scope.permissionGroupList[i].id });
        }
        sendRequest('/api/role/' + $scope.currentUser.id + '/authassignment', 'POST', sendData, $http).success(function (responseData) {
            $scope.getData($scope.currentPage);
            $('.close').click();
            //bootbox.alert('Cập nhật nhóm quyền cho người dùng ' + $scope.currentUser.userName + ' thành công');
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.search.userName = '';
        $scope.search.fullName = '';
        $scope.search.status = '';
        $scope.search.departmentId = '';
        $('#searchDepartment').val(null).trigger('change');
        $scope.getData(1);
    }

    $scope.getUserStatus = function () {
        get('/api/user/getUserStatus', {}, $http).success(function (responseData) {
            $scope.listStatus = responseData.data;
        }).error(errorHandler);
    }

    $scope.getUserType = function () {
        get('/api/user/getUserTypes', {}, $http).success(function (responseData) {
            $scope.listUserType = responseData.data;
        }).error(errorHandler);
    }

    $scope.getData(1);
    $scope.resetField();
    $scope.getAllGroupPermission();
    $scope.getUserStatus();
    $scope.getUserType();
});