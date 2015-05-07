/**
 * Created by lifengshuang on 5/4/15.
 */

define(function () {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'homepageRoute',
            'homepage': 'homepageRoute',
            'usersign': 'usersignRoute',
            'analyst': 'analystRoute',
            'stock/:s_id': 'stockRoute'
        },

        initialize: function () {
            console.log('router start');
        },

        blank: function () {

        },

        homepageRoute: function () {
            console.log('homepageRouter');
            require(['app/homepage'], function (homepage) {
                console.log('homepageRouter');

                console.log(homepage);
                $('#main_entry').html((new homepage()).el);
                require(['app/zoom'], function (zoom) {
                    zoom();
                });
            });
        },

        usersignRoute: function () {

        },

        analystRoute: function () {
            console.log('analystRouter');
            require(['app/analyst'], function (analyst) {
                $('#main_entry').html((new analyst()).el);
                require(['app/zoom'], function (zoom) {
                    zoom();
                });
            });
        },

        stockRoute: function (s_id) {
            require(['app/stock'], function (stock) {
                $('#main_entry').html((new stock({'s_id': s_id})).el);
                require(['app/zoom'], function (zoom) {
                    zoom();
                });
            });
        }

//        pushHistory: function (hash, css) {
//            loadCSS(css);
//            historyRecord.push([hash, css]);
//        },
//
//        popHistory: function () {
//            historyRecord.pop();
//            var pair = historyRecord.pop();
////            this.navigate(pair[0], {trigger: true});
//            location.hash = pair[0];
//            loadCSS(pair[1]);
////            location.reload();
//        }


    });

    window.Router = new AppRouter();
    Backbone.history.start();
});