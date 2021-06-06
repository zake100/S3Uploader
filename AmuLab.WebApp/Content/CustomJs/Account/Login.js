$(function () {
    //$('input').iCheck({
    //    checkboxClass: 'icheckbox_square-blue',
    //    radioClass: 'iradio_square-blue',
    //    increaseArea: '20%' // optional
    //});
    ResetPassValidate.init();
});

function showResetPassForm() {
    $('#userResetPassModal').modal('show');
}

function validateResetPassForm() {
    return $('#resetpassform').valid();
}

function successResponse(data) {
    debugger;
    if (data.ResultCode === 1) {
        alert('Mật khẩu mới của bạn đã được gửi tới địa chỉ ' +
            data.Email +
            '. Vui lòng kiểm tra email của bạn. Nếu có vấn đề gì về tài khoản, vui lòng liên hệ Admin (admin@vingroup.net) để được trực tiếp giải quyết');
        $('#userResetPassModal').modal('hide');
    } else {
        alert(data.Message);
    }
}

function failResponse(ex) {
    
}

var ResetPassValidate = function () {
    var handleValidate = function () {
        $('#resetpassform').validate({
            errorElement: 'div', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: true, // do not focus the last invalid input

            invalidHandler: function () { //display error alert on form submit
                $('.alert-danger', $('#resetpassform')).show();
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
                error.insertAfter(element.closest('.input-icon'));
            }
        });

        //$("#CaptchaInputText").rules("add", {
        //    required: true,
        //    messages: {
        //        required: requiremess
        //    }
        //});

        $("#EmailAddress").rules("add", {
            required: true,
            email: true,
            maxlength: 50,
            messages: {
                required: 'Bạn vui lòng nhập email'
                , email: 'Bạn hãy nhập đúng định dạng email. VD: abc@gmail.com'
            }
        });
    };

    return {
        init: function () {
            handleValidate();
        }
    };
}();