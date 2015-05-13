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
            'click .toSignup': 'signupDiv'
        },

        initialize: function () {
            loadCSS(css);
            this.signinDiv();
        },

        signin: function () {
            var phone = $('.usersign-mobile').val();
            var password = $('.usersign-password').val();
            User.hasSignin = true;
            User.name = '胡子欣';
            this.backDiv('欢迎回来');
        },

        signup: function () {
            User.hasSignin = true;
            User.name = '胡子欣';
            this.backDiv('注册成功');
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
        },

        back: function () {
            Router.navigate('homepage', {trigger: true});
        }

    });


    return UserSignView;
});