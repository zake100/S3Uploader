//var urlHostImage = '@System.Configuration.ConfigurationManager.AppSettings["ShowImageCdnHost"]';
//var maxsizeUploadInMb = parseInt('@ViewBag.FileMaxSizeInMb');
var vanilla;
var viewportWidth = 570;
var viewportHeight = 360;

$(document).ready(function () {
    AntData.BBVP.CommonAction.SetActiveMenu("post");
    AntData.BBVP.CommonAction.SetActiveMenu("create-post");
});

//var PostIndexApp = angular.module('PostIndexApp', ["brantwills.paging"]);
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

RootApp.filter("rawHtml", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

RootApp.controller('CreateOrUpdateInforController', function ($scope, $http) {
    angular.element(document).ready(function () {
        $('.date-picker1').datetimepicker({
            format: 'DD-MM-YYYY HH:mm'
        });
        $("#companySel").select2({
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
                        Offset: ((params.page || 0) * 30),
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
            dropdownParent: $('#companySel').parent(),
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

        $("#areaSel").select2({
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
                        Offset: ((params.page || 0) * 30),
                        Limit: 30,
                        SortQueryParam: "name",
                        CompanyId: $scope.infor.companyId || 0
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
            dropdownParent: $('#areaSel').parent(),
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

        $("#toDepartmentSel").select2({
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
                        Offset: (params.page || 0)*30,
                        Limit: 20,
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
            dropdownParent: $('#toDepartmentSel').parent(),
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

    $scope.infor = {};
    $scope.listInforSubGroup = [];
    $scope.limit = 10;
    $scope.searchEmp = {};
    $scope.searchEmp.pageSize = '10';
    $scope.sortName = 'fullName';
    $scope.sortAscending = false;
    $scope.infor.fromEmp = $('#currentUserName').val();
    $scope.infor.fromEmpDepartment = $('#currentDepartment').val();
    $scope.infor.fromEmpPosition = $('#currentPosition').val();
    $scope.infor.files = [];
    $scope.customConfig = function (editor) {
        CKEDITOR.replace(editor, {
            height: 338,
            toolbarGroups: [
                { "name": "basicstyles", "groups": ["basicstyles"] },
                { "name": "links", "groups": ["links"] },
                { "name": "paragraph", "groups": ["list", "align"] },
                { "name": "document", "groups": ["mode"] },
                { "name": "insert", "groups": ["insert"] },
                { "name": "styles", "groups": ["styles"] },
                { "name": "tools" }
            ],
            removeButtons: 'Anchor,Styles,Specialchar,Save,ShowBlocks'
        });
    }

    $("#inforDate").on("dp.change", function (e) {
        $scope.infor.inforDate = $scope.formatDate(e.date._d);
    });

    $("#startTime").on("dp.change", function (e) {
        $scope.infor.startTime = $scope.formatDate(e.date._d);
    });

    $("#expiredTime").on("dp.change", function (e) {
        $scope.infor.expiredTime = $scope.formatDate(e.date._d);
    });

    $scope.DoCtrlPagingActEmp = function (text, page, pageSize, total) {
        $scope.searchEmployee(page);
    }

    $('#companySel').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.infor.companyId = data.id;
        $("#areaSel").val(null).trigger('change');
    });

    $('#companySel').on('select2:unselect', function (e) {
        $scope.infor.companyId = null;
        $("#areaSel").val(null).trigger('change');
    });

    $('#areaSel').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.infor.areaId = data.id;
    });

    $('#areaSel').on('select2:unselect', function (e) {
        $scope.infor.areaId = null;
    });

    $('#inforSubGroup').on('select2:unselect', function (e) {
        $scope.infor.inforSubGroupId = null;
    });

    $('#inforSubGroup').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.infor.inforSubGroupId = data.id;
    });

    $('#toDepartmentSel').on('select2:unselect', function (e) {
        $scope.infor.toDepartment = null;
        $scope.infor.toEmp = null;
        $('#toEmpSel').empty().trigger('change');
    });

    $('#toDepartmentSel').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.infor.toDepartment = data.id;
        $scope.loadLstToEmp(data.id);
    });

    $scope.formatDate = function (stDate) {
        return moment(stDate).format('DD-MM-YYYY HH:mm');;
    }

    $scope.loadLstToEmp = function (id) {
        var inforTypeId = $scope.infor.inforTypeId || 0;
        get('/api/infor/getImplementPersionByDepartment/' + id + '/' + inforTypeId, {}, $http).success(function (responseData) {
            $('#toEmpSel').empty();
            for (var i = 0; i < responseData.data.length; i++) {
                var item = responseData.data[i];
                var newOption = {};
                if ($scope.infor.toEmp) {
                    if (item.userId === $scope.infor.toEmp) {
                        newOption = new Option(item.userName + ' - ' + item.departmentName, item.userId, false, true);
                    } else {
                        newOption = new Option(item.userName + ' - ' + item.departmentName, item.userId, false, false);
                    }
                } else if (i === 0) {
                    $scope.infor.toEmp = item.userId;
                    newOption = new Option(item.userName + ' - ' + item.departmentName, item.userId, false, true);
                }
                $('#toEmpSel').append(newOption);
            }
            $('#toEmpSel').trigger('change');
        }).error(errorHandler);
    }

    $('#toEmpSel').on('select2:unselect', function (e) {
        $scope.infor.toEmp = null;
    });

    $('#toEmpSel').on('select2:select', function (e) {
        var data = e.params.data;
        $scope.infor.toEmp = data.id;
    });

    $scope.changePageSize = function () {
        var pageSize = $scope.searchEmp.pageSize;

        if (pageSize == undefined || pageSize === '') {
            $scope.limit = 10;
        } else {
            $scope.limit = parseInt($scope.searchEmp.pageSize);
        }

        $scope.getData($scope.currentPage);
    }

    $scope.loadSubGroup = function () {
        if ($scope.infor.inforGroupId) {
            get('/api/infor/getinforsubgroupbygroupid/' + $scope.infor.inforGroupId, {}, $http).success(function (responseData) {
                $('#inforSubGroup').empty();
                for (var i = 0; i < responseData.data.length; i++) {
                    var item = responseData.data[i];
                    var newOption = {};
                    if ($scope.infor.inforSubGroupId) {
                        if (item.id === $scope.infor.inforSubGroupId) {
                            newOption = new Option(item.name, item.id, false, true);
                        } else {
                            newOption = new Option(item.name, item.id, false, false);
                        }
                    } else if (i === 0) {
                        $scope.infor.inforSubGroupId = item.id;
                        newOption = new Option(item.name, item.id, false, true);
                    }

                    $('#inforSubGroup').append(newOption);
                }
            }).error(errorHandler);
        }
    }

    $scope.showImage = function (imgUrl) {
        return urlHostImage + '/image' + imgUrl;
    };

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

    $scope.deleteFile = function (item) {
        var index = $scope.infor.files.indexOf(item);
        $scope.infor.files.splice(index, 1);   
    };

    $scope.create = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn công ty/Pnls", $scope.infor.companyId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn chi nhánh", $scope.infor.areaId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn nội dung phản ánh", $scope.infor.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Bạn phải chọn kênh tiếp nhận sự việc", $scope.infor.inforTypeId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn bộ phận tiếp nhận", $scope.infor.toDepartment)) {
            return false;
        }

        //if (!MQ.Validation.ValidateInputNotAllowHtmlTags("MetaTitle", $scope.post.metaTitle)) {
        //    return false;
        //}

        //if (!MQ.Validation.ValidateRequireField("MetaDescription", $scope.post.metaDescription)) {
        //    return false;
        //}

        //if (!MQ.Validation.ValidateInputNotAllowHtmlTags("MetaDescription", $scope.post.metaDescription)) {
        //    return false;
        //}

        //if ($(".metaKeyword").val() == null) {
        //    bootbox.alert('@string.Format(Resources.MV_field_not_empty, "Metakeyword")');
        //    return false;
        //}

        //if ($scope.post.avatarImage == null || $scope.post.avatarImage == "") {
        //    bootbox.alert("@Resources.m_post_not_select_avartar");
        //    return false;
        //}

        //if (!MQ.Validation.ValidateInputNotAllowHtmlTags("@Resources.m_post_author", $scope.post.author)) {
        //    return false;
        //}

        //var publishDateTime;
        //var publishTime = "12:00 AM";

        sendRequest('/api/infor', 'POST', {
            CompanyId: $scope.infor.companyId, AreaId: $scope.infor.areaId, Address: $scope.infor.address
            , Description: $scope.infor.description, Note: $scope.infor.note
            , InforGroupId: $scope.infor.inforGroupId, InforSubGroupId: $scope.infor.inforSubGroupId, InforStatusId: $scope.infor.inforStatusId
            , InforTypeId: $scope.infor.inforTypeId, ToDepartment: $scope.infor.toDepartment, ToEmp: $scope.infor.toEmp
            , ToEmp2: $scope.infor.toEmp2, InforDate: $scope.format_Date_ddMMyyyyHHmm($scope.infor.inforDate), StartTime: $scope.format_Date_ddMMyyyyHHmm($scope.infor.startTime), ExpiredTime: $scope.format_Date_ddMMyyyyHHmm($scope.infor.expiredTime),
            FromEmp: $scope.infor.fromEmp, FromEmpDepartment: $scope.infor.fromEmpDepartment, FromEmpPosition: $scope.infor.fromEmpPosition, Files: $scope.infor.files
        }, $http).success(function (responseData) {
            location.href = '/infor/index';
        }).error(errorHandlerNotPermission);
    }

    $scope.update = function () {
        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn công ty/Pnls", $scope.infor.companyId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn chi nhánh", $scope.infor.areaId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn nội dung phản ánh", $scope.infor.description)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateInputNotAllowHtmlTags("Bạn phải chọn kênh tiếp nhận sự việc", $scope.infor.inforTypeId)) {
            return false;
        }

        if (!AntData.BBVP.Validation.ValidateRequireField("Bạn phải chọn bộ phận tiếp nhận", $scope.infor.toDepartment)) {
            return false;
        }

        sendRequest('/api/infor/update/' + $scope.infor.id, 'POST', {
            Id: $scope.infor.id, CompanyId: $scope.infor.companyId, AreaId: $scope.infor.areaId, Address: $scope.infor.address
            , Description: $scope.infor.description, Note: $scope.infor.note
            , InforGroupId: $scope.infor.inforGroupId, InforSubGroupId: $scope.infor.inforSubGroupId, InforStatusId: $scope.infor.inforStatusId
            , InforTypeId: $scope.infor.inforTypeId, ToDepartment: $scope.infor.toDepartment, ToEmp: $scope.infor.toEmp
            , ToEmp2: $scope.infor.toEmp2, InforDate: $scope.format_Date_ddMMyyyyHHmm($scope.infor.inforDate), StartTime: $scope.format_Date_ddMMyyyyHHmm($scope.infor.startTime), ExpiredTime: $scope.format_Date_ddMMyyyyHHmm($scope.infor.expiredTime),
            FromEmp: $scope.infor.fromEmp, FromEmpDepartment: $scope.infor.fromEmpDepartment, FromEmpPosition: $scope.infor.fromEmpPosition, Files: $scope.infor.files
        }, $http).success(function (responseData) {
            bootbox.alert('Cập nhật thành công');
        }).error(errorHandlerNotPermission);
    }

    $scope.getById = function () {
        var id = $('#inforId').val();
        if (id === '') {
            $scope.infor.inforStatusId = 1;
            $scope.infor.startTime = $scope.formatDate(new Date());
            $scope.infor.inforDate = $scope.formatDate(new Date());
            $scope.infor.expiredTime = $scope.formatDate((new Date()).addDays(7));
            return;
        }

        var url = '/api/infor/' + id;
        get(url, {}, $http).success(function (responseData) {
            if (responseData.length == 0) return false;
            $scope.infor = responseData.data;
            if (responseData.data.company) {
                var newOption = new Option(responseData.data.company.name, responseData.data.companyId, false, false);
                $('#companySel').append(newOption).trigger('change');
            }
            if (responseData.data.area) {
                var newOption1 = new Option(responseData.data.area.name, responseData.data.areaId, false, false);
                $('#areaSel').append(newOption1).trigger('change');
            }
            $scope.loadSubGroup();
            $scope.infor.startTime = $scope.formatDate($scope.infor.startTime);
            $scope.infor.inforDate = $scope.formatDate($scope.infor.inforDate);
            $scope.infor.expiredTime = $scope.formatDate($scope.infor.expiredTime);
            if ($scope.infor.doneTime) {
                $scope.infor.doneTime = $scope.formatDate($scope.infor.doneTime);
            }

            if (responseData.data.inspectDepartment) {
                var newOption3 = new Option(responseData.data.inspectDepartment.name, responseData.data.toDepartment, false, false);
                $('#toDepartmentSel').append(newOption3).trigger('change');
            }
            $scope.loadLstToEmp(responseData.data.toDepartment);
            if (responseData.data.toEmpName) {
                //var newOption3 = new Option(responseData.data.toEmpName, responseData.data.toEmp, false, false);
                $('#toEmpSel').val(responseData.data.toEmp).trigger('change');
            }
        }).error(errorHandlerNotPermission);
    }

    $scope.getInforStatus = function () {
        get('/api/infor/getinfostatusesbylevel/1', {}, $http).success(function (responseData) {
            $scope.listStatus = responseData.data;
        }).error(errorHandler);
    }

    $scope.getInforGroup = function () {
        get('/api/infor/getinforgroup', {}, $http).success(function (responseData) {
            $scope.listInforGroup = responseData.data;
        }).error(errorHandler);
    }

    $scope.getInforType = function () {
        get('/api/infor/getinfortype', {}, $http).success(function (responseData) {
            $scope.listInforType = responseData.data;
        }).error(errorHandler);
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
            SortQueryParam: sortAscending + $scope.sortName
        }, $http).success(function (responseData) {
            $scope.listEmployee = responseData.data;
            $scope.currentPage = page;
            $scope.pageSize = responseData.paging.limit;
            $scope.total = responseData.paging.total;
            $scope.paging = responseData.paging;
        }).error(errorHandlerNotPermission);
    }

    $scope.setToEmp2 = function (name) {
        $scope.infor.toEmp2 = name;
        $('#searchEmployee').modal('hide');
    }

    $scope.format_Date_ddMMyyyyHHmm = function (date) {
        return moment(date, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
    }


    $scope.DrapImageUpload();
    $scope.getById();
    $scope.getInforStatus();
    $scope.getInforGroup();
    $scope.getInforType();
    //$scope.customConfig('note');
});