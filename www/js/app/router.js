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
            'stock/:s_id': 'stockRoute',
            'drawer': 'drawerRoute',
            'favour_stock': 'favourStockRoute',
            'favour_analyst': 'favourAnalystRoute',
            'search': 'searchRoute'
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
            require(['app/usersign'], function (usersign) {
                $('#main_entry').html((new usersign()).el);
            });
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
        },

        favourStockRoute: function () {
            require(['app/favour_stock'], function (favour_stock) {
                $('#main_entry').html((new favour_stock()).el);
            });
        },

        favourAnalystRoute: function () {
            require(['app/favour_analyst'], function (favour_analyst) {
                $('#main_entry').html((new favour_analyst()).el);
            });
        },

        searchRoute: function () {
            require(['app/search'], function (search) {
                $('#main_entry').html((new search()).el);
            });
        }


    });

    window.Router = new AppRouter();
    Backbone.history.start();
});