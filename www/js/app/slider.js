/**
 * Created by lifengshuang on 5/18/15.
 */
define(function () {
    window.Slider = {

        direction: 'right',

//        slide: function (el) {
//            this.body = $('body');
//            this.left = $('.page_left');
//            this.center = $('.page_center');
//            this.right = $('.page_right');
//            if (this.direction == 'left') {
////                this.body.append('<div class="page page_left" style="background-color: #8ca83d"></div>');
////                var left = $('.page_left')[0];
////                left.innerHTML = el;
////                console.log(left);
////                left.className = 'page transition page_center';
////                center.className = 'page transition page_right';
//                this.right[0].style.width = '720px';
//                this.right.remove();
//                this.left.html(el);
//                this.left[0].className = 'page transition page_center';
//                this.center[0].className = 'page transition page_right';
//                this.body.append('<div class="page page_left"></div>');
////                $('.page_right')[0].style.width = '0';
//            }
//            else if (this.direction == 'right'){
//                //direction: right
//                this.right[0].style.width = '720px';
//                this.left.remove();
//                this.right.html(el);
//                this.right[0].className = 'page transition page_center';
//                this.center[0].className = 'page transition page_left';
//                this.body.append('<div class="page page_right"></div>');
////                $('.page_right')[0].style.width = '0';
//            }
//            else {
//                this.center.html(el);
//            }
//            this.direction = 'right';
//            setTimeout(function () {
//                $('.page_left').html('');
//                $('.page_right').html('');
//            }, 250)
//        }

        slide: function (el) {
            //$('.page_center').html(el);
            //return
            window.previousPage2 = window.previousPage1;//used for return homepage when hit back to search page
            window.previousPage1 = location.hash;//It's a VERY BAD method!

            this.body = $('body');
            if (this.direction == 'left') {
                this.body.append('<div class="page page_left transition"></div>');
                $('.page_left').html(el);
                setTimeout(function () {
                    $('.page_center')[0].className = 'page page_right transition';
                    $('.page_left')[0].className = 'page page_center transition';
                    setTimeout(function () {
                        $('.page_right').remove();
                    }, 250);
                }, 0);
            }
            else if (this.direction == 'right'){
                //direction: right
                this.body.append('<div class="page page_right transition"></div>');
                $('.page_right').html(el);
                setTimeout(function () {
                    $('.page_center')[0].className = 'page page_left transition';
                    $('.page_right')[0].className = 'page page_center transition';
                    setTimeout(function () {
                        $('.page_left').remove();
                    }, 250);
                }, 0);
            }
            else {
                $('.page_center').html(el);
            }
            this.direction = 'right';
        }
    };
});