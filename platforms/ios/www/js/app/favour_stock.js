/**
 * Created by lifengshuang on 5/13/15.
 */

define(['text!html/favour-stock/index_favour-stock.html', 'text!html/favour-stock/css_favour-stock.html',
        'text!html/favour-stock/item_favour-stock.html'], function (index, css, item) {

    var FavourStockView = Backbone.View.extend({

        el: index,

        events: {
            'click .left': 'back',
            'click .favour-stock-item': 'stock'
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

        stock: function () {
            Router.navigate('stock/1', {trigger: true});
        },

        back: function () {
            Router.back();
        }

    });


    return FavourStockView;
});