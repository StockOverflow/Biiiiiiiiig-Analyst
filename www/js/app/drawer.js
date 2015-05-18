/**
 * Created by lifengshuang on 5/12/15.
 */

define(['text!html/drawer/index_drawer.html', 'text!html/drawer/css_drawer.html'], function (index, css) {

    var DrawerView = Backbone.View.extend({

        el: index,

        events: {
            'click .non-drawer': 'back',
            'click .drawer-stock': 'stock',
            'click .drawer-analyst': 'analyst',
            'click .drawer-reminder': 'reminder',
            'click .logout': 'logout',
            'click .setting': 'setting'
        },

        initialize: function () {
            if (User.hasSignin){
                this.$('.drawer-username').html(User.name);
            }
            else {
                this.$('.setting').html('立即注册');
                this.$('.logout').html('登录');
                this.$('.logout').before('&nbsp;&nbsp;&nbsp;');
            }
//            document.body.addEventListener('click', function (event) {
//                if (location.hash == '#drawer') {
//                    console.log(event);
//                    if (event.pageX / innerWidth > 486 / 720) {
//                        $('.drawer-closure').remove();
//                    }
//                }
//            }, false);
        },

        back: function () {
            Router.back();
        },

        stock: function () {
            if (User.hasSignin) {
                Router.navigate('favour_stock', {trigger: true});
            }
            else {
                Router.navigate('usersign', {trigger: true});
            }
        },

        analyst: function () {
            if (User.hasSignin) {
                Router.navigate('favour_analyst', {trigger: true});
            }
            else {
                Router.navigate('usersign', {trigger: true});
            }
        },

        reminder: function () {
            if (User.hasSignin) {
                Router.navigate('favour_reminder', {trigger: true});
            }
            else {
                Router.navigate('usersign', {trigger: true});
            }
        },

        logout: function () {
            if (User.hasSignin) {
                User.hasSignin = false;
                User.name = '未登录';
                User.phone = '';
                this.back();
            }
            else {
                Router.navigate('usersign', {trigger: true});
            }
        },

        setting: function () {
            if (User.hasSignin){

            }
            else {
                Router.navigate('usersign/signup', {trigger: true});
            }
        }

//        overStock: function() {
//            $('.drawer-stock').removeClass('unselected');
//            $('.drawer-stock').addClass('selected');
//        }

    });
    return DrawerView;

});