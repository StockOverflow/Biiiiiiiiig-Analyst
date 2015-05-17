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
            require(['app/zoom'], function (zoom) {
                zoom();
            });

            FastClick.attach(document.body);
        });


        window.loadCSS = function (css) {
//            $('link').remove();
//            $('head').append(css);
        };

        window.User = {
            hasSignin: false,
            name: '',
            phone: ''
        };

        window.Slider = {

            direction: '',

            slide: function (el) {
                this.body = $('body');
                this.left = $('.page_left');
                this.center = $('.page_center');
                this.right = $('.page_right');
                if (this.direction == 'left') {
//                this.body.append('<div class="page page_left" style="background-color: #8ca83d"></div>');
//                var left = $('.page_left')[0];
//                left.innerHTML = el;
//                console.log(left);
//                left.className = 'page transition page_center';
//                center.className = 'page transition page_right';
                    this.right[0].style.width = '720px';
                    this.right.remove();
                    this.left.html(el);
                    this.left[0].className = 'page transition page_center';
                    this.center[0].className = 'page transition page_right';
                    this.body.append('<div class="page page_left"></div>');
                    $('.page_right')[0].style.width = '0';
                }
                else{
                    //direction: right
                    this.right[0].style.width = '720px';
                    this.left.remove();
                    this.right.html(el);
                    this.right[0].className = 'page transition page_center';
                    this.center[0].className = 'page transition page_left';
                    this.body.append('<div class="page page_right"></div>');
                    $('.page_right')[0].style.width = '0';
                }
                this.direction = 'right';
                setTimeout(function () {
                    $('.page_left').html('');
                    $('.page_right').html('');
                }, 250)
            }
        };

        window.Swipe = {

            startX: 0,

            startY: 0,

            endX: 0,

            endY: 0,

            swipeControl: true,

            touchStart: function (event) {
                var touch = event.originalEvent.changedTouches[0];
                this.startX = touch.pageX;
                this.startY = touch.pageY;
            },

            touchEnd: function (event) {
                if (this.swipeControl){
                    this.swipeControl = false;
                    var ctx = this;
                    setTimeout(function () {
                        ctx.swipeControl = true;
                    }, 250);

                    var touch = event.originalEvent.changedTouches[0];
                    this.endX = touch.pageX;
                    this.endY = touch.pageY;

                    this.isSwipeRight();
                }
            },

            isSwipeRight: function () {
//                console.log('judge');
//                console.log(this.startX);
//                console.log(this.startY);
//                console.log(this.endX);
//                console.log(this.endY);
                if (this.endX - this.startX > 100 && Math.abs(this.startY - this.endY) < 100){
                    console.log('swipe');
                    Router.back();
                }
            }
        }

    });

});