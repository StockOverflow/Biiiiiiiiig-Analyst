/**
 * Created by lifengshuang on 5/13/15.
 */

define(['text!html/favour-analyst/index_favour-analyst.html', 'text!html/favour-analyst/css_favour-analyst.html',
    'text!html/favour-analyst/item_favour-analyst.html'], function (index, css, item) {

    var FavourAnalystView = Backbone.View.extend({

        el: index,

        events: {
            'click .homepage-item': 'analyst',
            'click .left': 'back'
        },

        initialize: function () {
            loadCSS(css);
            this.appendItem();
            this.appendItem();
            this.appendItem();
        },

        appendItem: function () {
            this.$('.content').append(item);
        },

        analyst: function () {
            Router.navigate('analyst', {trigger: true});
        },

        back: function () {
            history.back();
        }

    });


    return FavourAnalystView;
});