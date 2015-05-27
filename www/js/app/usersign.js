/**
 * Created by lifengshuang on 5/13/15.
 */

/**
 * Created by lifengshuang on 5/13/15.
 */

define(['text!html/usersign/index_usersign.html', 'text!html/usersign/css_usersign.html',
    'text!html/usersign/signin_usersign.html', 'text!html/usersign/signup_usersign.html',
    'text!html/usersign/back_usersign.html'], function (index, css, signin, signup, back) {

    var UserSignView = Backbone.View.extend({

        el: index,

        events: {
            'click .left': 'back',
            'click .signin': 'signin',
            'click .signup': 'signup',
            'click .toSignin': 'signinDiv',
            'click .toSignup': 'signupDiv',
            'touchstart div': 'touchStart',
            'touchend div': 'touchEnd'
        },


        touchStart: function (event) {
            Swipe.touchStart(event);
        },

        touchEnd: function (event) {
            Swipe.touchEnd(event);
        },

        initialize: function (option) {
            loadCSS(css);
            if (option == 'signup'){
                this.signupDiv();
            }
            else {
                this.signinDiv();
            }
        },

        signin: function () {
            var phone = $('.usersign-mobile').val();
            var password = $('.usersign-password').val();
            var url = 'http://stock.whytouch.com/users/login.php?phone=' + phone + '&password=' + password;
            var ctx = this;
            $.get(url, function (data) {
                if (data.code == 200){
                    User.hasSignin = true;
                    User.name = data.username;
                    User.phone = phone;
                    ctx.backDiv('欢迎回来');
                }
                else {
                    alert(data.state);
                }
            }, 'json');
        },

        signup: function () {
            var username = $('.usersign-username').val();
            var phone = $('.usersign-mobile').val();
            var password = $('.usersign-password').val();
            var url = 'http://stock.whytouch.com/users/register.php?username=' + username + '&phone=' + phone + '&password=' + password;
            var ctx = this;
            $.get(url, function (data) {
                console.log(data);
                if (data.code == 200){
                    User.hasSignin = true;
                    User.name = username;
                    User.phone = phone;
                    ctx.backDiv('注册成功');
                }
                else {
                    alert(data.state);
                }
            }, 'json');
        },

        signupDiv: function () {
            this.$('.title').html('用户注册');
            this.$('.content').html(signup);
        },

        signinDiv: function () {
            this.$('.title').html('用户登录');
            this.$('.content').html(signin);
        },

        backDiv: function (text) {
            this.$('.content').html(back);
            this.$('.back-text').html(text);
            User.updateFollowedInfo();
            setTimeout(function () {
                if (location.hash == '#usersign'){
                    Router.back();
                }
            }, 1000);
        },

        back: function () {
            Router.back();
        }

    });


    return UserSignView;
});