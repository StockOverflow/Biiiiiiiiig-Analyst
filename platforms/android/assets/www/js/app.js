/**
 * Created by lifengshuang on 4/29/15.
 */


require(['./config'], function () {

    require(['jquery', 'backbone', 'handlebars', 'chart', 'fastclick', 'jui'], function ($, Backbone, HandleBars, Chart, FastClick, JUI) {
        window.jQuery = $;
        window.Backbone = Backbone;
        window.HandleBars = HandleBars;
        window.Chart = Chart;
        window.FastClick = FastClick;
        window.JUI = JUI;
//        window.historyRecord = [];

        window.loadCSS = function (css) {
            $('link').remove();
            $('head').append(css);
        };

        require(['app/router'], function () {

        });

    });

});


//
//define(['jquery'], function($){
//    console.log('analyst loaded');
//    var body = $('body');
//    $.get('/analyst/www/analyst.html', function(data){
//        console.log(data);
//        body.append(data);
//        require(['handlebars'], function(HandleBars){
//            var source = HandleBars.compile($('#a')[0]);
//            var context = {content: 'handlebars'};
//            var html = source(context);
//            $('body').html(html);
//        });
//    })
//});