$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('task');
    AntData.BBVP.CommonAction.ResgistSearchDateControls('.date-from', '.date-to');
    AntData.BBVP.CommonAction.ResgistSearchDateControls('.working-date-from', '.working-date-to');
});

RootApp.controller('InforController', function ($scope, $http) {
    $scope.listInfor = [];
    $scope.checkAllCheckbox = false;
    $scope.search = {};
    $scope.paging = { total: 0 }
    $scope.sortAscending = false;
    $scope.sortName = 'createdDate';
    $scope.infor = {};
    $scope.limit = 10;
    $scope.listStatus = [];
    $scope.inforViolationLog = {};
    $scope.inforViolationForm = {};
    $scope.permissionGroupList = [];
    $scope.permissionListProcessed = [];
    $scope.hasRolePermission = true;
    $scope.search.pageSize = '10';
    $scope.inforViolation = {};
    $scope.currentDate = new Date();
    $scope.listViolationLog = [];
    $scope.inforFiles = [];
    $scope.searchEmp = {};
    $scope.listEmployee = [];
    $scope.listPositionLevel = [];
    $scope.searchEmp.pageSize = 10;
    $scope.listStatusLv3 = [];
    angular.element(document).ready(function () {
        $('.date-picker1').datetimepicker({
            format: 'DD-MM-YYYY HH:mm'
        });
        $('.date-picker2').datetimepicker({
            format: 'DD-MM-YYYY'
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
                        Offset: (params.page || 0)*20,
                        Limit: 20,
                        SortQueryParam: "name"
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

        $("#searchCompany").select2({
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
                            more: (params.page * 30) < data.total_count && data.total_count > 30
                        }
                    };
                }
            },
            placeholder: 'Tất cả',
            dropdownParent: $('#searchCompany').parent(),
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

        $("#searchArea").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/area/searchareaforinfor',
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
                            more: (params.page * 30) < data.total_count && data.total_count > 30
                        }
                    };
                }
            },
            placeholder: 'Tất cả',
            dropdownParent: $('#searchArea').parent(),
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
                        RightDepartmentId: $scope.search.toDepartmentId,
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

        $("#inforSubGroupForCreate").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/inforviolation/searchViolationSubGroupForSelect2',
                dataType: 'json',
                type: "POST",
                data: function (params) {
                    return {
                        Name: params.term,
                        Offset: (params.page || 0)*20,
                        Limit: 20,
                        SortQueryParam: "name",
                        ArchivedStatus: 0
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
            dropdownParent: $('#inforSubGroupForCreate').parent(),
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

        $("#empCheckDepartmentForCreate").select2({
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
                        Offset: (params.page || 0)*20,
                        Limit: 20,
                        SortQueryParam: "-createdDate"
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
            dropdownParent: $('#empCheckDepartmentForCreate').parent(),
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

        $("#empCheckForCreate").select2({
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
                        SortQueryParam: "-createdDate",
                        DepartmentId: $scope.inforViolation.empCheckDepartmentId || 0
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
            dropdownParent: $('#empCheckForCreate').parent(),
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

        $("#ivf_empCompanyId").select2({
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
                            more: (params.page * 30) < data.total_count && data.total_count > 30
                        }
                    };
                }
            },
            placeholder: 'Tất cả',
            dropdownParent: $('#ivf_empCompanyId').parent(),
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

        $("#inforGroupForForm").select2({
            minimumInputLength: 0,
            allowClear: false,
            multiple: false,
            ajax: {
                url: '/api/inforviolationform/searchViolationGroupForSelect2',
                dataType: 'json',
                type: "POST",
                data: function (params) {
                    return {
                        Name: params.term,
                        Offset: (params.page || 0) * 20,
                        Limit: 20,
                        SortQueryParam: "name",
                        //ArchivedStatus: 0
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
            dropdownParent: $('#inforGroupForForm').parent(),
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

        $("#inforSubGroupForForm").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/inforviolation/searchViolationSubGroupForSelect2',
                dataType: 'json',
                type: "POST",
                data: function (params) {
                    return {
                        Name: params.term,
                        Offset: (params.page || 0) * 20,
                        Limit: 20,
                        SortQueryParam: "name",
                        ViolationGroupId: $scope.inforViolationForm.violationGroupId,
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
            dropdownParent: $('#inforSubGroupForForm').parent(),
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

        $("#ivf_violationTypeId").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/inforviolationform/searchViolationTypeForSelect2',
                dataType: 'json',
                type: "POST",
                data: function (params) {
                    return {
                        Name: params.term,
                        Offset: (params.page || 0) * 20,
                        Limit: 20,
                        SortQueryParam: "id"
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
            dropdownParent: $('#ivf_violationTypeId').parent(),
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
                debugger;
                return "<div style='float:left;' id='" + results.id + "'>" + results.text + "</div>";
            }
        });

        $("#releaseDepartmentId").select2({
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
                        Offset: (params.page || 0) * 20,
                        Limit: 20,
                        SortQueryParam: "name"
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
            dropdownParent: $('#releaseDepartmentId').parent(),
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

        $("#empReleaseId").select2({
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
                        SortQueryParam: "-createdDate",
                        DepartmentId: $scope.inforViolationForm.releaseDepartmentId || 0
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
            dropdownParent: $('#empReleaseId').parent(),
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

    $scope.getMonday = function (d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    $scope.DoCtrlPagingAct = function (text, page, pageSize, total) {
        $scope.getData(page);
    }

    $scope.checkAll = function () {
        angular.forEach($scope.listUser, function (item) {
            item.checked = $scope.checkAllCheckbox;
        });
    };

    $scope.timeIsLessThanCurrent = function (datetime) {
        return moment(datetime)._d < new Date;
    }

    $scope.dateIsGreaterOrEqualCurrent = function (date) {
        return moment(date).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD');
    }

    $scope.deleteFile = function (item) {
        var index = $scope.inforViolationForm.files.indexOf(item);
        $scope.inforViolationForm.files.splice(index, 1);
    };

    $('#searchDepartment').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.toDepartmentId = data.id;
    });

    $('#searchDepartment').on('select2:unselect', function (e) {
        $scope.search.toDepartmentId = null;
    });

    $('#searchArea').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.areaId = data.id;
    });

    $('#searchArea').on('select2:unselect', function (e) {
        $scope.search.areaId = null;
    });

    $('#searchCompany').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.companyId = data.id;
    });

    $('#releaseDepartmentId').on('select2:unselect', function (e) {
        $scope.inforViolationForm.releaseDepartmentId = null;
        $scope.inforViolationForm.empReleaseId = null;
        $('#empReleaseId').empty().trigger('change');
    });

    $('#releaseDepartmentId').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolationForm.releaseDepartmentId = data.id;
    });


    $('#empReleaseId').on('select2:unselect', function (e) {
        $scope.inforViolationForm.empReleaseId = null;
    });

    $('#empReleaseId').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolationForm.empReleaseId = data.id;
    });

    $('#searchCompany').on('select2:unselect', function (e) {
        $scope.search.companyId = null;
    });

    $('#ivf_empCompanyId').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolationForm.empCompanyId = data.id;
    });

    $('#ivf_empCompanyId').on('select2:unselect', function (e) {
        $scope.inforViolationForm.empCompanyId = null;
    });

    $('#inforGroupForForm').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolationForm.violationGroupId = data.id;
    });

    $('#inforGroupForForm').on('select2:unselect', function (e) {
        $scope.inforViolationForm.violationGroupId = null;
        $scope.inforViolationForm.violationSubgroupId = null;
        $('#inforSubGroupForForm').empty().trigger('change');
    });

    $('#searchUser').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.search.toEmpId = data.id;
    });

    $('#searchUser').on('select2:unselect', function (e) {
        $scope.search.toEmpId = null;
    });

    $('#inforSubGroupForCreate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolation.violationSubGroupId = data.id;
    });

    $('#inforSubGroupForCreate').on('select2:unselect', function (e) {
        $scope.inforViolation.violationSubGroupId = null;
    });

    $('#inforSubGroupForForm').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolationForm.violationSubgroupId = data.id;
    });

    $('#inforSubGroupForForm').on('select2:unselect', function (e) {
        $scope.inforViolationForm.violationSubgroupId = null;
    });

    $('#empCheckForCreate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolation.empCheckId = data.id;
    });

    $('#empCheckForCreate').on('select2:unselect', function (e) {
        $scope.inforViolation.empCheckId = null;
    });

    $('#empCheckDepartmentForCreate').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.inforViolation.empCheckDepartmentId = data.id;
    });

    $('#empCheckDepartmentForCreate').on('select2:unselect', function (e) {
        $scope.inforViolation.empCheckDepartmentId = null;
    });

    $("#logDate").on("dp.change", function (e) {
        $scope.inforViolationLog.logDate = $scope.formatDateTime(e.date._d);
    });

    $("#inforViolationStartTime").on("dp.change", function (e) {
        $scope.inforViolation.startTime = $scope.formatDateTime(e.date._d);
    });

    $("#inforViolationExpiredTime").on("dp.change", function (e) {
        $scope.inforViolation.expiredTime = $scope.formatDateTime(e.date._d);
    });

    $("#releaseDate").on("dp.change", function (e) {
        $scope.inforViolationForm.releaseDate = $scope.formatDate(e.date._d);
    });

    $("#execDate").on("dp.change", function (e) {
        $scope.inforViolationForm.execDate = $scope.formatDateTime(e.date._d);
    });

    $("#showDate").on("dp.change", function (e) {
        $scope.inforViolationForm.showDate = $scope.formatDateTime(e.date._d);
    });

    $("#approveDate").on("dp.change", function (e) {
        $scope.inforViolationForm.approveDate = $scope.formatDate(e.date._d);
    });

    $scope.resetField = function () {
        $scope.infor.description = "";
        $('#searchCompany').val(null).trigger('change');
        $('#searchArea').val(null).trigger('change');
        $('#searchDepartment').val(null).trigger('change');
        $('#searchUser').val(null).trigger('change');
    };

    $scope.getCheckedIds = function () {
        var ids = [];
        for (var obj in $scope.listInfor) {
            var user = $scope.listInfor[obj];
            if (user.checked) {
                ids.push(user.id);
            }
        }
        return ids;
    }

    $scope.deleteAllChecked = function () {
        var ids = $scope.getCheckedIds();

        if (ids.length == 0) {
            bootbox.alert('Bạn phải chọn ít nhất một công việc');
            return false;
        }

        bootbox.confirm('Bạn có chắc bạn muốn xóa những công việc này?',
            function (result) {
                if (result) {
                    var countRequest = 0;
                    for (var index in ids) {
                        var id = ids[index];
                        sendRequest('/api/infor/delete/' + id, 'POST', {}, $http).success(
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
        bootbox.confirm('Bạn có chắc bạn muốn xóa công việc này?',
            function (result) {
                if (result) {
                    sendRequest('/api/infor/delete/' + id, 'POST', {}, $http).success(function (responseData) {
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

        var url = '/api/infor/search';

        sendRequest(url, 'POST', {
            Offset: ((page - 1) * limit),
            Limit: limit,
            Description: $scope.search.description,
            StartDate: format_Date_ddMMyyyy($scope.search.startDate),
            StartWorkingDate: format_Date_ddMMyyyy($scope.search.startWorkingDate),
            EndDate: format_Date_ddMMyyyy($scope.search.endDate),
            EndWorkingDate: format_Date_ddMMyyyy($scope.search.endWorkingDate),
            InforStatusList: $scope.search.status,
            SortQueryParam: sortAscending + $scope.sortName,
            ToDepartmentId: $scope.search.toDepartmentId,
            ToEmpId: $scope.search.toEmpId
        }, $http).success(function (responseData) {
            $scope.listInfor = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    };

    $scope.clearFilter = function () {
        $scope.infor.description = "";
        $scope.infor.startDate = "";
        $scope.infor.endDate = "";
        $scope.infor.startWorkingDate = "";
        $scope.infor.endWorkingDate = "";
        $('#searchCompany').val(null).trigger('change');
        $('#searchArea').val(null).trigger('change');
        $('#searchDepartment').val(null).trigger('change');
        $('#searchArea').val(null).trigger('change');
        var arr = [];
        for (var i = 0; i < $scope.listStatus.length; i++) {
            var item = $scope.listStatus[i];
            arr.push(item.id);
        }
        $scope.search.status = arr;
        $scope.getData(1);
    }

    $scope.getInforStatus = function () {
        get('/api/infor/getinfostatusesbylevel/1', {}, $http).success(function (responseData) {
            $scope.listStatus = responseData.data;
            var arr = [];
            for (var i = 0; i < responseData.data.length; i++) {
                var item = responseData.data[i];
                arr.push(item.id);
            }
            $scope.search.status = arr;
        }).error(errorHandler);
    }

    $scope.getInforViolationStatus = function () {
        get('/api/infor/getinfostatusesbylevel/2', {}, $http).success(function (responseData) {
            $scope.listInforViolationStatus = responseData.data;
        }).error(errorHandler);
    }

    $scope.init = function () {
        $scope.search.toDepartmentId = currentDepartmentId;
    }

    $scope.resetInforViolation = function (obj) {
        $scope.inforViolation.inforStatusId = 6;
        $scope.inforViolation.startTime = $scope.formatDateTime(obj.startTime);
        $scope.inforViolation.oldStartTime = obj.startTime;
        $scope.inforViolation.expiredTime = $scope.formatDateTime(obj.expiredTime);
        $scope.inforViolation.oldExpiredTime = obj.expiredTime;
        $scope.inforViolation.inforId = obj.id;
        $scope.inforViolation.empCheckDepartmentId = obj.toDepartment;
        $scope.inforViolation.description = '';
        $scope.inforViolation.note = '';
        $scope.inforViolation.id = 0;
        $('#inforSubGroupForCreate').val(null).trigger('change');
        $('#empCheckForCreate').val(null).trigger('change');
        $scope.inforViolation.violationSubGroupId = null;
        $scope.inforViolation.empCheckId = null;
        var newOption = new Option(obj.inspectDepartment.name, obj.inspectDepartment.id, true, true);
        $('#empCheckDepartmentForCreate').empty().append(newOption).trigger('change');
        
        //$('#inforViolationStartTime').datepicker("setDate", moment(obj.startTime)._d);
        //$('#inforViolationExpiredTime').datepicker("setDate", moment(obj.expiredTime)._d);
    }

    $scope.createInforViolation = function() {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập nội dung thông tin chi tiết thanh tra", $scope.inforViolation.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn người thanh tra", $scope.inforViolation.empCheckId)) {
            return false;
        }
       
        if (moment($scope.inforViolation.startTime,'DD_MM-YYYY')._d < moment($scope.inforViolation.oldStartTime)._d) {
            bootbox.alert('Thời điểm nhận việc thanh tra phải sau thời điểm nhận thông tin ban đầu');
            return false;
        }

        if (moment($scope.inforViolation.expiredTime, 'DD_MM-YYYY')._d > moment($scope.inforViolation.oldExpiredTime)._d) {
            bootbox.alert('Hạn hoàn thành phải trước hạn hoàn thành của toàn bộ công việc');
            return false;
        }
        sendRequest('/api/inforviolation', 'POST', {
            InforId: $scope.inforViolation.inforId, Description: $scope.inforViolation.description, Note: $scope.inforViolation.note
            , ExecDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolation.startTime), ViolationSubgroupId: $scope.inforViolation.violationSubGroupId, EmpCheckId: $scope.inforViolation.empCheckId
            , EmpCheckDepartmentId: $scope.inforViolation.empCheckDepartmentId, StartTime: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolation.startTime), ExpiredTime: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolation.expiredTime)
            , InforStatusId: $scope.inforViolation.inforStatusId, EmployeeId: 0
        }, $http).success(function (responseData) {
            $scope.getData(1);
            $('#addInforViolation').modal('hide');
        }).error(errorHandlerNotPermission);
    }

    $scope.formatDate = function (stDate) {
        return moment(stDate).format('DD-MM-YYYY');
    }

    $scope.formatDateTime = function (stDate) {
        return moment(stDate).format('DD-MM-YYYY HH:mm');
    }

    $scope.showInforViolation = function (obj, infor) {
        $scope.inforViolation.inforStatusId = obj.inforStatusId;
        $scope.inforViolation.startTime = $scope.formatDateTime(obj.startTime);
        $scope.inforViolation.oldStartTime = infor.startTime;
        $scope.inforViolation.expiredTime = $scope.formatDateTime(obj.expiredTime);
        $scope.inforViolation.oldExpiredTime = infor.expiredTime;
        $scope.inforViolation.inforId = infor.id;
        $scope.inforViolation.empCheckDepartmentId = obj.empCheckDepartmentId;
        $scope.inforViolation.description = obj.description;
        $scope.inforViolation.note = obj.note;
        $scope.inforViolation.id = obj.id;
        $scope.inforViolation.violationSubGroupId = obj.violationSubGroupId;
        if (obj.violationSubgroup) {
            var violationSubGroup = new Option(obj.violationSubgroup.name, obj.violationSubgroup.id, true, true);
            $('#inforSubGroupForCreate').append(violationSubGroup).trigger('change');
        }

        $scope.inforViolation.empCheckId = obj.empCheckId;
        var emCheck = new Option(obj.empCheckName, obj.empCheckId, true, true);
        $('#empCheckForCreate').append(emCheck).trigger('change');
        if (obj.empCheckDepartment) {
            var newOption = new Option(obj.empCheckDepartment.name, obj.empCheckDepartment.id, true, true);
            $('#empCheckDepartmentForCreate').append(newOption).trigger('change');
        }
        $('#violationStatus').trigger('change')
        //$('#inforViolationStartTime').datepicker("setDate", moment(obj.startTime)._d);
        //$('#inforViolationExpiredTime').datepicker("setDate", moment(obj.expiredTime)._d);
    }

    $scope.updateInforViolation = function() {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập nội dung thông tin chi tiết thanh tra", $scope.inforViolation.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn người thanh tra", $scope.inforViolation.empCheckId)) {
            return false;
        }

        if (moment($scope.inforViolation.startTime, 'DD_MM-YYYY')._d < moment($scope.inforViolation.oldStartTime)._d) {
            bootbox.alert('Thời điểm nhận việc thanh tra phải sau thời điểm nhận thông tin ban đầu');
            return false;
        }

        if (moment($scope.inforViolation.expiredTime, 'DD_MM-YYYY')._d > moment($scope.inforViolation.oldExpiredTime)._d) {
            bootbox.alert('Hạn hoàn thành phải trước hạn hoàn thành của toàn bộ công việc');
            return false;
        }
        
        sendRequest('/api/inforviolation/update/' + $scope.inforViolation.id, 'POST', {
            InforId: $scope.inforViolation.inforId, Description: $scope.inforViolation.description, Note: $scope.inforViolation.note
            , ExecDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolation.startTime), ViolationSubgroupId: $scope.inforViolation.violationSubGroupId, EmpCheckId: $scope.inforViolation.empCheckId
            , EmpCheckDepartmentId: $scope.inforViolation.empCheckDepartmentId, StartTime: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolation.startTime), ExpiredTime: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolation.expiredTime)
            , InforStatusId: $scope.inforViolation.inforStatusId, EmployeeId: 0, Id: $scope.inforViolation.id
        }, $http).success(function (responseData) {
            $scope.getData(1);
            $('#addInforViolation').modal('hide');
        }).error(errorHandlerNotPermission);
    }

    $scope.deleteInforViolation = function(id) {
        sendRequest('/api/inforviolation/delete/' + id, 'POST', {}, $http).success(function (responseData) {
            $scope.getData(1);
            $('#addInforViolation').modal('hide');
        }).error(errorHandlerNotPermission);
    }

    $scope.stopInforViolation = function(id) {
        sendRequest('/api/inforviolation/stop/' + id, 'POST', {}, $http).success(function (responseData) {
            $scope.getData(1);
            $('#addInforViolation').modal('hide');
        }).error(errorHandlerNotPermission);
    }

    $scope.showInforViolationLog = function (obj) {
        $scope.inforViolationLog.inforViolationId = obj.id;
        $scope.inforViolationLog.description = '';
        $scope.inforViolationLog.violationDescription = obj.description;
        $scope.inforViolationLog.logDate = $scope.formatDateTime(new Date());
        $scope.getDataLog(1, obj.id);
    }

    $scope.getDataLog = function(page) {
        get('/api/inforviolationlog/getbyinforviolationid/' + $scope.inforViolationLog.inforViolationId, {}, $http).success(function (responseData) {
            $scope.listViolationLog = responseData.data;
            //$scope.currentPage = page;
            //$scope.pageSize = responseData.paging.limit;
            //$scope.total = responseData.paging.total;
            //$scope.paging = responseData.paging;
        }).error(errorHandler);
    }

    $scope.addInforViolationLog = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập nội dung thông tin", $scope.inforViolationLog.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập ngày tạo", $scope.inforViolationLog.logDate)) {
            return false;
        }
        
        sendRequest('/api/inforviolationlog', 'POST', {
            LogDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolationLog.logDate), Description: $scope.inforViolationLog.description,
            LogType: 0, InforViolationId: $scope.inforViolationLog.inforViolationId,
            Id: 0
        }, $http).success(function (responseData) {
            $scope.getDataLog(1);
        }).error(errorHandlerNotPermission);
    }

    $scope.format_Date_ddMMyyyyHHmm = function(date) {
        return moment(date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
    }

    //$scope.DoCtrlPagingActViolationLog = function (text, page, pageSize, total) {
    //    $scope.getDataLog(page);
    //}

    $scope.editInforViolationLog = function(obj) {
        $scope.inforViolationLog.logDate = moment(obj.logDate).format('DD-MM-YYYY HH:mm');
        $scope.inforViolationLog.description = obj.description;
        $scope.inforViolationLog.id = obj.id;
    }

    $scope.updateViolationLog = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập nội dung thông tin", $scope.inforViolationLog.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập ngày tạo", $scope.inforViolationLog.logDate)) {
            return false;
        }
        sendRequest('/api/inforviolationlog/update/' + $scope.inforViolationLog.id, 'POST', {
            LogDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolationLog.logDate), Description: $scope.inforViolationLog.description,
            LogType: 0, InforViolationId: $scope.inforViolationLog.inforViolationId,
            Id: $scope.inforViolationLog.id
        }, $http).success(function (responseData) {
            $scope.getDataLog(1);
        }).error(errorHandlerNotPermission);
    }

    $scope.deleteInforViolationLog = function (id) {
        sendRequest('/api/inforviolationlog/delete/' + id, 'POST', {}, $http).success(function (responseData) {
            $scope.getDataLog(1);
        }).error(errorHandlerNotPermission);
    }

    $scope.showMedia = function(lst) {
        $scope.inforFiles = lst;
    }

    $scope.showImage = function (imgUrl) {
        return urlHostImage +  '/image' + imgUrl;
    }

    $scope.searchEmployee = function (page) {
        var pageSize = $scope.searchEmp.pageSize;

        if (pageSize == undefined || pageSize === '') {
            $scope.limit = 10;
        } else {
            $scope.limit = parseInt($scope.searchEmp.pageSize);
        }
        var sortAscending = "-";
        if ($scope.sortAscending) sortAscending = "";

        var limit = $scope.limit;
        sendRequest('/api/employee/search', 'POST', {
            Offset: ((page - 1) * limit),
            Limit: limit,
            EmployeeCode: $scope.searchEmp.employeeCode,
            FullName: $scope.searchEmp.employeeName,
            Email: $scope.searchEmp.email,
            SortQueryParam: sortAscending + 'employeeCode'
        }, $http).success(function (responseData) {
            $scope.listEmployee = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    }

    $scope.DoCtrlPagingActEmp = function (text, page, pageSize, total) {
        $scope.searchEmployee(page);
    }

    $scope.DrapImageUpload = function () {
        var area = $('.uploadArea');
        area.each(function () {
            var $this = $(this);
            var dropbox = $this.find('.dropbox').first();
            var message = $('.message', dropbox).first();
            var fileUpload = $this.find('.fuImageUpload').first();

            fileUpload.fileupload({
                url: uploadImageUrl,
                dataType: 'json',
                autoUpload: true,
                add: function (e, data) {
                    if (!AntData.BBVP.Validation.ValidateImageFile(data.files[0].name, data.files[0], maxsizeUploadInMb))
                        return;
                    data.submit();
                },
                done: function (e, data) {
                    if (data.result.filePath != undefined) {
                        if (fileUpload.prop('multiple')) {
                            $scope.image = data.result.filePath || '';
                            $scope.infor.files.push({
                                id: 0,
                                file: $scope.image,
                                inforId: $('#inforId').val() || 0
                            });
                            $scope.$apply();
                        }
                    } else if (data.result.Message != undefined) {
                        bootbox.alert(data.result.Message);
                    }
                },
                fail: function (e, data) {
                    debugger;
                }
            });

            dropbox.filedrop({
                paramname: 'pic',
                maxfiles: 1,
                maxfilesize: maxsizeUploadInMb,
                url: uploadImageUrl,
                uploadFinished: function (i, file, response) {
                    if (response.filePath != undefined) {
                        if (fileUpload.prop('multiple')) {
                            $scope.infor.files.push({
                                id: 0,
                                file: response.filePath,
                                inforId: $('#inforId').val() || 0
                            });
                            $scope.$apply();
                        }
                    }
                },
                error: function (err, file) {
                    switch (err) {
                        case 'BrowserNotSupported':
                            message.html('Trình duyệt không hỗ trợ');
                            break;
                        case 'FileTooLarge':
                            bootbox.alert(file.name + ' có kích thước quá lớn (>' + maxsizeUploadInMb + 'MB.');
                            break;
                        default:
                            break;
                    }
                },
                beforeEach: function (file) {
                    //if (!file.type.match(/^image\//)) {
                    //    bootbox.alert('@Resources.m_upload_image_type_allow');
                    //    return false;
                    //}
                }
            });
        });
    };

    $scope.showInforViolationForm = function (obj, infor) {
        $scope.inforViolation.inforStatusId = obj.inforStatusId;
        $scope.inforViolation.startTime = $scope.formatDateTime(obj.startTime);
        $scope.inforViolation.oldStartTime = infor.startTime;
        $scope.inforViolation.expiredTime = $scope.formatDateTime(obj.expiredTime);
        $scope.inforViolation.oldExpiredTime = infor.expiredTime;
        $scope.inforViolation.inforId = infor.id;
        $scope.inforViolation.empCheckDepartmentId = obj.empCheckDepartmentId;
        $scope.inforViolation.description = obj.description;
        $scope.inforViolation.note = obj.note;
        $scope.inforViolation.id = obj.id;
        $scope.inforViolation.violationSubGroupId = obj.violationSubGroupId;
        if (obj.violationSubgroup) {
            var violationSubGroup = new Option(obj.violationSubgroup.name, obj.violationSubgroup.id, true, true);
            $('#inforSubGroupForCreate').append(violationSubGroup).trigger('change');
        }

        $scope.inforViolation.empCheckId = obj.empCheckId;
        var emCheck = new Option(obj.empCheckName, obj.empCheckId, true, true);
        $('#empCheckForCreate').append(emCheck).trigger('change');
        if (obj.empCheckDepartment) {
            var newOption = new Option(obj.empCheckDepartment.name, obj.empCheckDepartment.id, true, true);
            $('#empCheckDepartmentForCreate').append(newOption).trigger('change');
        }
        $('#violationStatus').trigger('change')
        //$('#inforViolationStartTime').datepicker("setDate", moment(obj.startTime)._d);
        //$('#inforViolationExpiredTime').datepicker("setDate", moment(obj.expiredTime)._d);
    }

    $scope.resetInforViolationForm = function(obj) {
        $scope.inforViolationForm.releaseDate = $scope.formatDate(new Date());
        $scope.inforViolationForm.execDate = $scope.formatDateTime(new Date());
        $scope.inforViolationForm.showDate = $scope.formatDateTime(new Date());
        $scope.inforViolationForm.approveDate = $scope.formatDate(new Date());
        $scope.inforViolationForm.inforId = obj.id;
    }

    $scope.updateInforViolationForm = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập nội dung thông tin chi tiết thanh tra", $scope.inforViolation.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn người thanh tra", $scope.inforViolation.empCheckId)) {
            return false;
        }

        if (moment($scope.inforViolation.startTime, 'DD_MM-YYYY')._d < moment($scope.inforViolation.oldStartTime)._d) {
            bootbox.alert('Thời điểm nhận việc thanh tra phải sau thời điểm nhận thông tin ban đầu');
            return false;
        }

        if (moment($scope.inforViolation.expiredTime, 'DD_MM-YYYY')._d > moment($scope.inforViolation.oldExpiredTime)._d) {
            bootbox.alert('Hạn hoàn thành phải trước hạn hoàn thành của toàn bộ công việc');
            return false;
        }

        sendRequest('/api/inforviolation/update/' + $scope.inforViolationForm.id, 'POST', {
            InforId: $scope.inforViolationForm.inforId, Description: $scope.inforViolationForm.description, Note: $scope.inforViolationForm.note
            , ExecDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolationForm.execDate), EmpId: $scope.inforViolationForm.empId, EmpName: $scope.inforViolationForm.empName, EmpMasterCode: $scope.inforViolationForm.empMasterCode, EmpIdentNo: $scope.inforViolationForm.empIdentNo,
            EmpPositionLevel: $scope.inforViolationForm.empPositionLevel, EmpPosition: $scope.inforViolationForm.empPosition, EmpDepartmentId: $scope.inforViolationForm.empDepartmentId,
            EmpDepartment: $scope.inforViolationForm.empDepartment, EmpSubDepartment: $scope.inforViolationForm.empSubDepartment, EmpCompanyId: $scope.inforViolationForm.empCompanyId,
            EmpIdea: $scope.inforViolationForm.empIdea, EmpManagerId: $scope.inforViolationForm.empManagerId, EmpManagerName: $scope.inforViolationForm.empManagerName,
            EmpManagerIdentNo: $scope.inforViolationForm.empManagerIdentNo, EmpManagerPosition: $scope.inforViolationForm.empManagerPosition, EmpManagerDepartmentId: $scope.inforViolationForm.empManagerDepartmentId, EmpManagerIdea: $scope.inforViolationForm.empManagerIdea, ReleaseDate: format_Date_ddMMyyyy($scope.inforViolationForm.releaseDate),
            ViolationNo: $scope.inforViolationForm.violationNo, ViolationSubgroupId: $scope.inforViolationForm.violationSubgroupId, ShowDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolationForm.showDate),
            ViolationTypeId: $scope.inforViolationForm.violationTypeId, PenPoint: $scope.inforViolationForm.penPoint, MoneyPenalty: $scope.inforViolationForm.moneyPenalty, MoneyCompensation: $scope.inforViolationForm.moneyCompensation, FromDepartId: $scope.inforViolationForm.fromDepartId, FromDepartName: $scope.inforViolationForm.fromDepartName, ReleaseDepartmentId: $scope.inforViolationForm.releaseDepartmentId, EmpReleaseId: $scope.inforViolationForm.empReleaseId, InforStatus: $scope.inforViolationForm.inforStatus, TotalIdea: $scope.inforViolationForm.totalIdea, ApproveBy: $scope.inforViolationForm.approveBy, ApproveDate: format_Date_ddMMyyyy($scope.inforViolationForm.approveDate),
            Files: $scope.inforViolationForm.files, Id: $scope.inforViolationForm.id
        }, $http).success(function (responseData) {
            $scope.getData(1);
            $('#addInforViolation').modal('hide');
        }).error(errorHandlerNotPermission);
    }

    $scope.createInforViolationForm = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải nhập nội dung thông tin chi tiết thanh tra", $scope.inforViolation.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn người thanh tra", $scope.inforViolation.empCheckId)) {
            return false;
        }

        if (moment($scope.inforViolation.startTime, 'DD_MM-YYYY')._d < moment($scope.inforViolation.oldStartTime)._d) {
            bootbox.alert('Thời điểm nhận việc thanh tra phải sau thời điểm nhận thông tin ban đầu');
            return false;
        }

        if (moment($scope.inforViolation.expiredTime, 'DD_MM-YYYY')._d > moment($scope.inforViolation.oldExpiredTime)._d) {
            bootbox.alert('Hạn hoàn thành phải trước hạn hoàn thành của toàn bộ công việc');
            return false;
        }

        sendRequest('/api/inforviolationform', 'POST', {
            InforId: $scope.inforViolationForm.inforId, Description: $scope.inforViolationForm.description, Note: $scope.inforViolationForm.note
            , ExecDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolationForm.execDate), EmpId: $scope.inforViolationForm.empId, EmpName: $scope.inforViolationForm.empName, EmpMasterCode: $scope.inforViolationForm.empMasterCode, EmpIdentNo: $scope.inforViolationForm.empIdentNo,
            EmpPositionLevel: $scope.inforViolationForm.empPositionLevel, EmpPosition: $scope.inforViolationForm.empPosition, EmpDepartmentId: $scope.inforViolationForm.empDepartmentId, 
            EmpDepartment: $scope.inforViolationForm.empDepartment, EmpSubDepartment: $scope.inforViolationForm.empSubDepartment, EmpCompanyId: $scope.inforViolationForm.empCompanyId,
            EmpIdea: $scope.inforViolationForm.empIdea, EmpManagerId: $scope.inforViolationForm.empManagerId, EmpManagerName: $scope.inforViolationForm.empManagerName,
            EmpManagerIdentNo: $scope.inforViolationForm.empManagerIdentNo, EmpManagerPosition: $scope.inforViolationForm.empManagerPosition, EmpManagerDepartmentId: $scope.inforViolationForm.empManagerDepartmentId, EmpManagerIdea: $scope.inforViolationForm.empManagerIdea, ReleaseDate: format_Date_ddMMyyyy($scope.inforViolationForm.releaseDate),
            ViolationNo: $scope.inforViolationForm.violationNo, ViolationSubgroupId: $scope.inforViolationForm.violationSubgroupId, ShowDate: $scope.format_Date_ddMMyyyyHHmm($scope.inforViolationForm.showDate),
            ViolationTypeId: $scope.inforViolationForm.violationTypeId, PenPoint: $scope.inforViolationForm.penPoint, MoneyPenalty: $scope.inforViolationForm.moneyPenalty, MoneyCompensation: $scope.inforViolationForm.moneyCompensation, FromDepartId: $scope.inforViolationForm.fromDepartId, FromDepartName: $scope.inforViolationForm.fromDepartName, ReleaseDepartmentId: $scope.inforViolationForm.releaseDepartmentId, EmpReleaseId: $scope.inforViolationForm.empReleaseId, InforStatus: $scope.inforViolationForm.inforStatus, TotalIdea: $scope.inforViolationForm.totalIdea, ApproveBy: $scope.inforViolationForm.approveBy, ApproveDate: format_Date_ddMMyyyy($scope.inforViolationForm.approveDate),
            Files: $scope.inforViolationForm.files, Id: 0
        }, $http).success(function (responseData) {
            $scope.getData(1);
            $('#addInforViolation').modal('hide');
        }).error(errorHandlerNotPermission);
    }

    $scope.getPositionLevel = function () {
        get('/api/employeepositionlevel/getall', {}, $http).success(function (responseData) {
            $scope.listPositionLevel = responseData.data;
        }).error(errorHandler);
    }

    $scope.getInforStatusLvl3 = function () {
        get('/api/infor/getinfostatusesbylevel/3', {}, $http).success(function (responseData) {
            $scope.listStatusLv3 = responseData.data;
        }).error(errorHandler);
    }

    $scope.init();
    $scope.getData(1);
    $scope.resetField();
    $scope.getInforStatus();
    $scope.getInforViolationStatus();
    $scope.DrapImageUpload();
    $scope.getPositionLevel();
    $scope.getInforStatusLvl3();
});