/**
 * Created by Tong on 05.01.
 */
define(function() {
    function zoom() {
        var wWidth = $(window).width();
        $('body').css('zoom', wWidth / 720);
        window.screenRatio = wWidth / 720;
    }
    return zoom;
});
