/**
 * Created by lifengshuang on 5/18/15.
 */
define(function () {
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
});