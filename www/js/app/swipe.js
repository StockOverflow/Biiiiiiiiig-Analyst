/**
 * Created by lifengshuang on 5/18/15.
 */
define(function () {
    window.Swipe = {

        startX: 0,

        startY: 0,

        endX: 0,

        endY: 0,

        swipeControl: true,

        initialize: function () {
            document.body.addEventListener('touchstart', function (e) {
//                console.log(e);
                Swipe.touchStart(e);
            }, false);
            document.body.addEventListener('touchend', function (e) {
//                console.log(e);
                Swipe.touchEnd(e);
            }, false);
        },

        touchStart: function (event) {
            event.stopPropagation();
            if (event.hasOwnProperty('changedTouches')) {
                var touch = event.changedTouches[0];
                this.startX = touch.pageX;
                this.startY = touch.pageY;
            }
//            console.log(event);
        },

        touchEnd: function (event) {
            if (this.swipeControl && event.hasOwnProperty('changedTouches')){
                this.swipeControl = false;
                var ctx = this;
                setTimeout(function () {
                    ctx.swipeControl = true;
                }, 250);

                var touch = event.changedTouches[0];
                this.endX = touch.pageX;
                this.endY = touch.pageY;

                this.isSwipeRight();
            }
//            console.log(event);
        },

        isSwipeRight: function () {
            if (pageNeedSwipe(location.hash)) {
                if (this.endX - this.startX > 200 * screenRatio && Math.abs(this.startY - this.endY) < 150 * screenRatio) {
                    console.log('swipe');
                    Router.back();
                }
            }

            function pageNeedSwipe(hash) {
                return !(hash == '#homepage');
            }
        }
    };
    Swipe.initialize();
});