var $loading = '<div id="loading_wrapper" class="loading_wrapper"> <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;"></div> <div style="z-index: 102004545; background: url(/Content/img/ajax-loader1.gif) 50% 50% no-repeat;position: absolute;top: 0;left: 0;width: 100%;height: 100%; background-size: 64px 64px"></div> </div>',
    queue = 0;

$(document)
    .ajaxSend(function (event, jqxhr, settings) {
        loader.show();
        window.setTimeout(function () {
            loader.hide();
        }, 1000 * 5);
    })
    .ajaxComplete(function () {
        loader.hide();
    })
    .ajaxError(function () {
        loader.hide();
    });

var loader = loader || {};
loader.show = function () {

    queue += 1;
    console.log("q", queue);
    if (!$('.loading_wrapper').length || !$('.overlay-loading').length) {

        $('body').append($loading);

        window.setTimeout(function () {
            loader.hide();
        }, 1000 * 3);
    }
};
loader.hide = function () {
    if (queue > 0) {
        queue -= 1;
        if (queue == 0) {
            window.setTimeout(function () {
                $('.loading_wrapper').remove();
            }, 1000);
        }
    }
};