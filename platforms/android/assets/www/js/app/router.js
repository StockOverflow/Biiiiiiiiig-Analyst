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

        direction: 'left',

        initialize: function () {
            console.log('router start');
        },

        blank: function () {

        },

        homepageRoute: function () {
            require(['app/homepage'], function (homepage) {
                Slider.slide((new homepage()).el);
                console.log(Router.direction);

            });
        },

        usersignRoute: function () {

        },

        analystRoute: function () {
            console.log('analystRouter');
            require(['app/analyst'], function (analyst) {
                Slider.slide((new analyst()).el);
            });
        },

        stockRoute: function (s_id) {
            require(['app/stock'], function (stock) {
                Slider.slide((new stock()).el);
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