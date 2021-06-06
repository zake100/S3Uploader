var AntData = AntData || {};
AntData.BBVP = AntData.BBVP || {};
var startDate = new Date('01/01/2012');
var FromEndDate = new Date();
var ToEndDate = new Date();

ToEndDate.setDate(ToEndDate.getDate() + 365);

AntData.BBVP.CommonAction = {
    SendRequest: function (url, method, data, http, showLoading) {
        AntData.BBVP.CommonAction.ShowLoading("body", !!showLoading);

        var result = http({
            url: url,
            method: method,
            data: JSON.stringify(data),
            headers: { 'Content-Type': "application/json; charset=UTF-8", 'Accept': "application/json;odata=verbose" }
        });
        result.success(function () { loading("body", false); });
        result.error(function () { loading("body", false); });

        return result;
    },

    SendRequestWithDataOriginal: function (url, method, data, http, showLoading) {
        AntData.BBVP.CommonAction.ShowLoading("body", !!showLoading);

        var result = http({
            url: url,
            method: method,
            data: data,
            headers: { 'Content-Type': "application/json; charset=UTF-8", 'Accept': "application/json;odata=verbose" }
        });
        result.success(function () { loading("body", false); });
        result.error(function () { loading("body", false); });

        return result;
    },

    Post: function (url, data, http, showLoading) {
        return AntData.BBVP.CommonAction.SendRequest(url, "POST", data, http, showLoading);
    },

    Get: function (url, data, http, showLoading) {
        return AntData.BBVP.CommonAction.SendRequest(url, "GET", data, http, showLoading);
    },

    Put: function (url, data, http, showLoading) {
        return AntData.BBVP.CommonAction.SendRequest(url, "PUT", data, http, showLoading);
    },

    SearchInArray: function (obj, arr, attr1, attr2) {
        if (arr == undefined)
            return {};

        for (var i = 0; i < arr.length; i++) {
            if (obj[attr1] === arr[i][attr2])
                return arr[i];
        }
        return {};
    },

    ShowLoading: function ($element, flag) {
        if (flag && flag === true) {
            App.blockUI($element);
        } else {
            App.unblockUI($element);
        }
    },

    ConvertTagToJson: function (nameId) {
        var tagsItems = $("#" + nameId).tagsinput("items");
        var tags = "";
        if (tagsItems.length > 0) {
            for (var i = 0; i < tagsItems.length; i++) {
                tags += ",{\"name\" : \"" + tagsItems[i] + "\"}";
            }
            tags = tags.substr(1);
        }
        tags = "[" + tags + "]";
        return JSON.parse(tags);
    },

    FormatToDate: function (date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1;
        var yyyy = date.getFullYear();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return dd + "-" + mm + "-" + yyyy;
    },

    FormatToTime: function (date) {
        var hh = date.getHours();
        var mm = date.getMinutes();
        var ss = date.getSeconds();

        if (hh < 10) hh = '0' + hh;
        if (mm < 10) mm = '0' + mm;
        if (ss < 10) ss = '0' + ss;

        return hh + ":" + mm + ":" + ss;
    },
    //FormatToDateTime: function (date) {
    //    var date = FormatToDate(date);
    //    var time = FormatToTime(date);
    //    return date + ' ' + time;
    //},

    ValidateFromIsSmallerThanToDate: function (fromDate, toDate) {
        var startDate = format_Date_ddMMyyyy(fromDate);

        if (startDate === "")
            return true;

        var endDate = format_Date_ddMMyyyy(toDate);

        if (endDate === "")
            return true;

        if (startDate > endDate)
            return false;
        return true;
    },

    FormatDateToVnDate: function (date) {
        if (date == undefined || date === "")
            return "";
        var aDate = date.split("-");

        if (aDate.length < 3)
            return "";
        return aDate[2].substr(0, 4) + "-" + aDate[1] + "-" + aDate[0];
    },

    ValidateFileSize: function (fileName, fileInput, maxsizeInMb) {
        var maxSizeInBytes = parseInt(maxsizeInMb) * 1024 * 1024;
        var fileSize = fileInput.size;

        if (fileSize > maxSizeInBytes) {
            bootbox.alert(fileName + " có kích thước không hợp lệ (> " + maxsizeInMb + "MB).");
            return false;
        }
        return true;
    },

    ValidateImageFileName: function (imageName) {
        var validExts = new Array(".bmp", ".gif", ".jpg", ".jpeg", ".png", ".tif", ".tiff");
        var fileExt = imageName;
        fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
        if (validExts.indexOf(fileExt.toLowerCase()) < 0) {
            bootbox.alert(imageName + " không hợp lệ. Chỉ hỗ trợ các file (.bmp, .gif, .jpg, .jpeg, .png).");
            return false;
        }
        return true;
    },

    ValidateImageFile: function (imageName, fileInput, maxsizeinMb) {
        return AntData.BBVP.CommonAction.ValidateImageFileName(imageName) && AntData.BBVP.CommonAction.ValidateFileSize(imageName, fileInput, maxsizeinMb);
    },

    ResgistSearchDateControls: function (startDateControl, toDateControl) {
        //Datepickers for Created Date From, To
        $(startDateControl).datepicker({
            weekStart: 1,
            startDate: '01-01-2012',
            format: "dd-mm-yyyy",
            language: 'pt-BR',
            //endDate: FromEndDate,
            autoclose: true,
        })
            .on('changeDate', function (selected) {
                startDate = new Date(selected.date.valueOf());
                startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
                $(toDateControl).datepicker('setStartDate', startDate);
            });

        $(toDateControl)
            .datepicker({
                format: "dd-mm-yyyy",
                language: 'pt-BR',
                weekStart: 1,
                startDate: startDate,
                //endDate: ToEndDate,
                autoclose: true,
            })
            .on('changeDate', function (selected) {
                FromEndDate = new Date(selected.date.valueOf());
                FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
                $(startDateControl).datepicker('setEndDate', FromEndDate);
            });
    },

    SetActiveMenu: function (menuId) {
        var menu = $("#" + menuId);

        if (menu !== undefined) {
            $(menu).css("color", "#33c8e0");

            var parent = $(menu).closest('ul');
            $(parent).css('display', 'block');
            $(parent).closest('li').addClass("menu-open active");
        }
    },

    BreakWords: function (element, numberOfCharacters) {
        var strlist = $(element).text().split(' ');
        for (var i = 0; i < strlist.length; i++) {
            if (strlist[i].length > numberOfCharacters) {
                $(element).css('white-space', '');
                $(element).css('word-break', 'break-all');
            }
        }
    },

    RemoveParamsFromUrl: function (key, sourceURL) {
        var rtn = sourceURL.split("?")[0],
            param,
            params_arr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
        if (queryString !== "") {
            params_arr = queryString.split("&");
            for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                param = params_arr[i].split("=")[0];
                if (param === key) {
                    params_arr.splice(i, 1);
                }
            }
            rtn = rtn + "?" + params_arr.join("&");
        }
        return rtn;
    },
    getUtcDate: function (date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
}

function sendRequest(url, method, data, http, showLoading) {
    if (showLoading == undefined)
        showLoading = true;
    return AntData.BBVP.CommonAction.SendRequest(url, method, data, http, showLoading);
}

function sendRequestWithOriginalData(url, method, data, http, showLoading) {
    if (showLoading == undefined)
        showLoading = true;
    return AntData.BBVP.CommonAction.SendRequestWithDataOriginal(url, method, data, http, showLoading);
}

function post(url, data, http, showLoading) {
    if (showLoading == undefined)
        showLoading = true;
    return AntData.BBVP.CommonAction.SendRequest(url, 'POST', data, http, showLoading);
}

function get(url, data, http, showLoading) {
    if (showLoading == undefined)
        showLoading = true;
    return AntData.BBVP.CommonAction.SendRequest(url, 'GET', data, http, showLoading);
}

function put(url, data, http, showLoading) {
    if (showLoading == undefined)
        showLoading = true;
    return AntData.BBVP.CommonAction.SendRequest(url, 'PUT', data, http, showLoading);
}

function errorHandler(data, status, headers, config) {
    AntData.BBVP.ErrorHandler.HandleError(data, status, headers, config);
}

function errorComboSaveHandler(data, status, headers, config) {
    AntData.BBVP.ErrorHandler.HandleErrorWhenSavingCombo();
}

function errorHandlerNotPermission(data, status, headers, config) {
    AntData.BBVP.ErrorHandler.HandleErrorNotHavePermission(data, status, headers, config);
}

function searchInArray(obj, arr, attr1, attr2) {
    return AntData.BBVP.CommonAction.SearchInArray(obj, arr, attr1, attr2);
}

function loading($element, flag) {
    AntData.BBVP.CommonAction.ShowLoading($element, flag);
}

function convertTagToJson(nameId) {
    return AntData.BBVP.CommonAction.ConvertTagToJson(nameId);
}

function formatToDate(date) {
    return AntData.BBVP.CommonAction.FormatToDate(date);
}

function formatToTime(date) {
    return AntData.BBVP.CommonAction.FormatToTime(date);
}
function formatToDateTime(date) {
    var sdate = AntData.BBVP.CommonAction.FormatToDate(date);
    var stime = AntData.BBVP.CommonAction.FormatToTime(date);
    return sdate + ' ' + stime;
}
function checkDateFromTo(dateFrom, dateTo) {
    return AntData.BBVP.CommonAction.ValidateFromIsSmallerThanToDate(dateFrom, dateTo);
}

function format_Date_ddMMyyyy(date) {
    return AntData.BBVP.CommonAction.FormatDateToVnDate(date);
}

Number.prototype.format = function (n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


function isValidURL(url) {
    var regExp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

    if (!regExp.test(url)) {
        return false;
    } else {
        return true;
    }
}

var GlobalCommon = {
    ShowInfo: function (message, title) {
        toastr.info(message, title);
    },
    ShowMessage: function (message, title) {
        toastr.success(message, title);
    },
    ShowError: function (message, title) {
        toastr.error(message, title);
    },
    ShowWarning: function (message, title) {
        toastr.warning(message, title);
    },
    NumberFormat: function (number, n, x) {
        return numberFormat(number, n, x);
    },
    SetCookie: function (key, value) {
        value = JSON.stringify(value);
        $.cookie(key, value, { expires: 360, path: '/' });
    },
    GetCookie: function (key) {
        var value = $.cookie(key);
        if (value == undefined || value == null) return undefined;
        return JSON.parse(value);
    }
};

window.GlobalCommon = GlobalCommon;