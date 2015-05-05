/**
 * Created by lifengshuang on 4/29/15.
 */


require(['./config'], function () {
    require(['app/router'], function () {

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