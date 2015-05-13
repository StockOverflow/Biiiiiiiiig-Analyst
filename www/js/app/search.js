/**
 * Created by lifengshuang on 5/14/15.
 */

define(['text!html/search/index_search.html', 'text!html/search/css_search.html'], function (index, css) {

    var SearchView = Backbone.View.extend({

        el: index,

        events: {
            'click #search-cancel': 'back',
            'click #clear-icon': 'clearText',
            'click .homepage-item': 'analyst',
            'click .analyst-di-item': 'stock'
        },

        initialize: function () {
            loadCSS(css);
            if (User.hasSignin){
                this.$('.drawer-username').html(User.name);
            }
        },

        clearText: function () {
            this.$('.search-text').val('');
        },

        analyst: function () {
            Router.navigate('analyst', {trigger: true});
        },

        stock: function () {
            Router.navigate('stock/1', {trigger: true});
        },

        back: function () {
            history.back();
        }



    });
    console.log(index);
    return SearchView;

});