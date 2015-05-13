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
            'click .drawer-reminder': 'reminder'
//            'mouseover .drawer-stock': 'overStock'
        },

        initialize: function () {
            loadCSS(css);
            if (User.hasSignin){
                this.$('.drawer-username').html(User.name);
            }
        },

        back: function () {
            history.back();
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
        }

//        overStock: function() {
//            $('.drawer-stock').removeClass('unselected');
//            $('.drawer-stock').addClass('selected');
//        }

    });
    console.log(index);
    return DrawerView;

});