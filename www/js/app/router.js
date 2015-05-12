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

//        direction: 'left',

        initialize: function () {
            console.log('router start');
        },

        blank: function () {

        },

        homepageRoute: function () {
            require(['app/homepage'], function (homepage) {
//                Slider.slide((new homepage()).el);
//                console.log(Router.direction);
                $('#main_entry').html((new homepage()).el);
            });
        },

        usersignRoute: function () {

        },

        analystRoute: function () {
//            console.log('analystRouter');
            require(['app/analyst'], function (analyst) {
//                Slider.slide((new analyst()).el);
                $('#main_entry').html((new analyst()).el);
            });
        },

        stockRoute: function (s_id) {
            require(['app/stock'], function (stock) {
//                Slider.slide((new stock()).el);
                $('#main_entry').html((new stock()).el);
            });
        },

        drawerRoute: function () {
            require(['app/drawer'], function (drawer) {
                $('#main_entry').html((new drawer()).el);
            });
        }




    });

    window.Router = new AppRouter();
    Backbone.history.start();
});