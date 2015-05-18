/**
 * Created by lifengshuang on 4/29/15.
 */


require(['./config'], function () {

    require(['jquery', 'backbone', 'handlebars', 'chart', 'fastclick', 'jui'], function ($, Backbone, HandleBars, Chart, FastClick, JUI) {
        window.$ = $;
        window.Backbone = Backbone;
        window.HandleBars = HandleBars;
        window.Chart = Chart;
        window.FastClick = FastClick;
        window.JUI = JUI;

        require(['app/router'], function () {
            require(['text!html/css.html'], function (css) {
                $('head').append(css);
            });
        });

        $(function () {
            require(['app/zoom', 'app/swipe', 'app/slider'], function (zoom) {
                zoom();
            });

            FastClick.attach(document.body);
        });


        window.loadCSS = function (css) {
            //deprecated
        };

        window.User = {
            hasSignin: false,
            name: '',
            phone: ''
        };



    });

});