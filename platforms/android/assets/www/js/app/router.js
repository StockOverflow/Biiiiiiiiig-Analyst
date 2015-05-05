/**
 * Created by lifengshuang on 5/4/15.
 */

define(['jquery', 'backbone'], function($, Backbone){

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'homepageRoute',
            'homepage': 'homepageRoute',
            'usersign': 'usersignRoute'
        },

        initialize: function () {
            console.log('router start');
        },

        blank: function(){

        },

        homepageRoute: function () {
            require(['app/homepage', 'app/zoom'], function (homepage, zoom) {
                console.log(homepage);
                $('#main_entry').html(homepage.el);
                zoom();
            });
        },

        usersignRoute: function () {

        }

    });

    var appRouter = new AppRouter();
    Backbone.history.start();
});