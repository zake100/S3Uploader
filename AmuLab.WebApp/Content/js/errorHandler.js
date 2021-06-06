var MQ = MQ || {};

AntData.BBVP.ErrorHandler = {
    HandleError: function (data, status, headers, config) {
        if (data === "" || data == null) {
            return;
        }

        if (data.exceptionType === "System.UnauthorizedAccessException") {
            window.location.href = "/home/deny";
            return;
        }

        if (data.exceptionType === "System.Web.HttpRequestValidationException")
            return;

        if (data.exceptionMessage) {
            bootbox.alert("<div class='alert alert-danger'>" + data.exceptionMessage + "</div>");
            return;
        }

        if (data.message) {
            bootbox.alert("<div class='alert alert-danger'>" + data.message + "</div>");
            return;
        }

        bootbox.alert("<div class='alert alert-danger'>" + data + "</div>");
    },

    HandleErrorWhenSavingCombo: function () {
        alert("Vui lòng kiểm tra lại các trường thông tin");
    },

    HandleErrorNotHavePermission: function (data, status, headers, config) {
        AntData.BBVP.ErrorHandler.HandleError(data, status, headers, config);
    },
    CommonHandleError: function (data, status, headers, config) {
        // Phong
        //console.log(data);
        //console.log(status);
        //console.log(headers);
        //console.log(config);

        if (status === 400) {
            // Validate
            // get error

            if (data.Errors) {
                var msg = '';
                for (var i = 0; i < data.Errors.length; i++) {
                    msg += data.Errors[i];
                    if (i != (data.Errors.length - 1)) {
                        msg += "<br/>";
                    }
                }
                //bootbox.alert("<div class='alert alert-danger'>" + msg + "</div>");
                bootbox.alert("<div class=''>" + msg + "</div>");
            }

            return;
        }
        AntData.BBVP.ErrorHandler.HandleError(data, status, headers, config);
    },
    GetHttpErrorMessage: function (data) {
        if (data.Errors) {
            var msg = '';
            for (var i = 0; i < data.Errors.length; i++) {
                msg += data.Errors[i];
                if (i != (data.Errors.length - 1)) {
                    msg += "<br/>";
                }
            }
            return msg;
        }
    }
}