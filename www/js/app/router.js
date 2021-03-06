/**
 * Created by lifengshuang on 5/4/15.
 */

define(function () {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'homepageRoute',
            'homepage': 'homepageRoute',
            'usersign': 'usersignRoute',
            'usersign/:option': 'usersignRoute',
            'analyst/:a_id': 'analystRoute',
            'stock/:s_id': 'stockRoute',
            'drawer': 'drawerRoute',
            'favour_stock': 'favourStockRoute',
            'favour_analyst': 'favourAnalystRoute',
            'search': 'searchRoute'
        },

        initialize: function () {
            console.log('router start');
            document.addEventListener("backbutton", function () {
                Router.back();
                console.log('back');
            }, false);
        },

        back: function () {
            Slider.direction = 'left';
            console.log(previousPage2);
            if (previousPage2.indexOf('#search') != -1) {
                Router.navigate('homepage', {trigger:true});
            }
            else {
                history.back();
            }
        },

        homepageRoute: function () {
            require(['app/homepage'], function (homepage) {
                Slider.slide((new homepage()).el);
            });
        },

        usersignRoute: function (option) {
            require(['app/usersign'], function (usersign) {
                Slider.slide((new usersign(option)).el);
//                $('#main_entry').html((new usersign(option)).el);
            });
        },

        analystRoute: function (a_id) {
            require(['app/analyst'], function (analyst) {
                Slider.slide((new analyst(a_id)).el);
//                $('#main_entry').html((new analyst(a_id)).el);
            });
        },

        stockRoute: function (s_id) {
            require(['app/stock'], function (stock) {
                Slider.slide((new stock(s_id)).el);
//                $('#main_entry').html((new stock(s_id)).el);
            });
        },

        drawerRoute: function () {

        },

        favourStockRoute: function () {
            require(['app/favour_stock'], function (favour_stock) {
                Slider.slide((new favour_stock()).el);
//                $('#main_entry').html((new favour_stock()).el);
            });
        },

        favourAnalystRoute: function () {
            require(['app/favour_analyst'], function (favour_analyst) {
                Slider.slide((new favour_analyst()).el);
//                $('#main_entry').html((new favour_analyst()).el);
            });
        },

        searchRoute: function () {
            require(['app/search'], function (search) {
                Slider.slide((new search()).el);
//                $('#main_entry').html((new search()).el);
            });
        }


    });

    window.Router = new AppRouter();
    Backbone.history.start();
});