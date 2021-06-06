var RootApp = angular.module('rootApp', ["brantwills.paging", "toggle-switch"]);
RootApp.directive('onErrorSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.onErrorSrc) {
                    attrs.$set('src', attrs.onErrorSrc);
                }
            });
        }
    };
});
function beginPaging(args) {
    // Animate
    $('#grid-list').fadeOut('normal');
}

function successPaging() {
    // Animate
    $('#grid-list').fadeIn('normal');
    //$('a').tooltip();
}

function failurePaging() {
    $("#grid-list").html("<h4> @Resources.m_data_not_found.</h4>");
    $('#grid-list').fadeIn('normal');
}

$(document).ready(function () {
    $(".dropdown.message.messages-menu").removeClass("open");
    $("[data-mask]").inputmask();
    $('.select2').select2();
});
if ($.browser !== undefined) {
    if ($.browser.mozilla && $.browser.version >= "1.8") {
        // some code
    }
    // If the browser type is Opera
    if ($.browser.opera) {
        // some code
    }
    // If the web browser type is Safari
    if ($.browser.safari) {
        // some code
    }
    // If the web browser type is Chrome
    if ($.browser.chrome) {
        // some code
    }
    // If the web browser type is Internet Explorer
    if ($.browser.msie && $.browser.version < 10) {
        window.location.href = '/Account/BrowserNotSupport';
    }
    //If the web browser type is Internet Explorer 6 and above
    if ($.browser.msie && $.browser.version >= 10) {
        // some code
    }
}