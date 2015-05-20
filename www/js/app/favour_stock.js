/**
 * Created by lifengshuang on 5/13/15.
 */

define(['text!html/favour-stock/index_favour-stock.html', 'text!html/favour-stock/css_favour-stock.html',
        'text!html/favour-stock/item_favour-stock.html'], function (index, css, item) {

    var FavourStockModel = Backbone.Model.extend({
        defaults: {
            's_id': 1,
            's_name': '',
            'expected_price': 0,
            'price': 0,
            'researchNumber': 0
        }
    });

    var FavourStockCollection = Backbone.Collection.extend({
        model: FavourStockModel,
        models: []
    });

    var SingleStockView = Backbone.View.extend({

        template: HandleBars.compile(item),

        events: {
            'click .followed-item':'enter_Stock'
//            'click .col4': 'unfollow'
        },

        initialize: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },

        enter_Stock: function () {
            var s_id = this.model.get("s_id");
            Router.navigate('stock/' + s_id, {trigger: true});
        },

        unfollow: function () {
            var ctx = this;
            $.get('http://stock.whytouch.com/users/unfollow_stocks.php?u_id=' + User.phone + '&s_id=' + this.model.s_id, function () {
                ctx.$el.html('');
            }, 'json');
        }
    });

    var FavourStockView = Backbone.View.extend({

        el: index,

        stocks: new FavourStockCollection(),

        events: {
            'click .nav-icon.left': 'back'
        },

        initialize: function () {
            this.stocks = new FavourStockCollection();
            var ctx = this;
            $.get('http://stock.whytouch.com/users/get_following_stocks.php?u_id=' + User.phone, function (data) {
                var list = JSON.parse(data.following_stocks);
                _.each(list, function (item) {
                    ctx.stocks.add(item);
                });
                ctx.stocks.each(ctx.show, ctx);
            }, 'json');

        },

        show: function (model) {
            var view = new SingleStockView({model: model});
            this.$('.content').append(view.el);
        },


        back: function () {
            Router.back();
        }

    });


    return FavourStockView;
});