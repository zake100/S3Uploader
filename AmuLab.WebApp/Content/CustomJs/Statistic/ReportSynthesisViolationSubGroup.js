$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('report');
    AntData.BBVP.CommonAction.SetActiveMenu('reportsynthesisviolationsubgroup');

   
});

RootApp.controller('ReportSynthesisViolationSubGroup', function ($scope, $http) {
    $scope.search = {};
    angular.element(document).ready(function () {
        $('.date-picker1').datepicker({
            format: 'dd-mm-yyyy',
            autoclose: true,
            language: 'pt-BR'
        });

        //load cboViolationGroup
        $("#cboViolationGroup").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/violationgroup/searchforinfor',
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
            placeholder: '',
            dropdownParent: $('#cboViolationGroup').parent(),
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

        //load cboReleaseDepartment
        $("#cboReleaseDepartment").select2({
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
            placeholder: 'Tất cả',
            dropdownParent: $('#cboReleaseDepartment').parent(),
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

        //load cboViolationSubgroup
        $("#cboViolationSubgroup").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/ViolationSubGroup/searchforinfor',
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
            dropdownParent: $('#cboViolationSubgroup').parent(),
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

        $("#cboEmpRelease").select2({
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
            dropdownParent: $('#cboEmpRelease').parent(),
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