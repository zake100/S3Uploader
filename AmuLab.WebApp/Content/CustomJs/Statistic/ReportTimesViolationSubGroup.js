$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu('report');
    AntData.BBVP.CommonAction.SetActiveMenu('reporttimesviolationsubgroup');

});

RootApp.controller('ReportTimesViolationSubGroup', function ($scope, $http) {
    angular.element(document).ready(function () {
        //load cboArea
        $("#cboArea").select2({
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
            dropdownParent: $('#cboArea').parent(),
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

        //load cboViolationType
        $("#cboViolationType").select2({
            minimumInputLength: 0,
            allowClear: true,
            multiple: false,
            ajax: {
                url: '/api/violationtype/searchviolationtype',
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
            dropdownParent: $('#cboViolationType').parent(),
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