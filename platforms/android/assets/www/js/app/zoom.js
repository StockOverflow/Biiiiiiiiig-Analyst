/**
 * Created by Tong on 05.01.
 */
define(['jquery'], function($) {
    function zoom() {
        var wWidth = $(window).width();
        $('body').css('zoom', wWidth / 720);
    }

    return zoom;
});
