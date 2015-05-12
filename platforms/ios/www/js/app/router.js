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
                Slider.slide((new homepage()).el, Router.direction);
                console.log(Router.direction);
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
                Slider.slide((new analyst()).el, Router.direction);
                require(['app/zoom'], function (zoom) {
                    zoom();
                });
            });
        },

        stockRoute: function (s_id) {
            require(['app/stock'], function (stock) {
                Slider.slide((new stock()).el, Router.direction);
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

    window.Slider = {

        slide: function (el, direction) {
            this.body = $('body');
            this.left = $('.page_left');
            this.center = $('.page_center');
            this.right = $('.page_right');
            if (direction == 'left') {
//                this.body.append('<div class="page page_left" style="background-color: #8ca83d"></div>');
//                var left = $('.page_left')[0];
//                left.innerHTML = el;
//                console.log(left);
//                left.className = 'page transition page_center';
//                center.className = 'page transition page_right';
                this.right.remove();
                this.left.html(el);
                this.left[0].className = 'page transition page_center';
                this.center[0].className = 'page transition page_right';
                this.body.append('<div class="page page_left"></div>');
            }
            else{
                //direction: right
                this.left.remove();
                this.right.html(el);
                this.right[0].className = 'page transition page_center';
                this.center[0].className = 'page transition page_left';
                this.body.append('<div class="page page_right"></div>');
            }
        }

    };
});