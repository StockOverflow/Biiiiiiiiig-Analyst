/**
 * Created by lifengshuang on 5/13/15.
 */

define(['text!html/favour-analyst/index_favour-analyst.html', 'text!html/favour-analyst/css_favour-analyst.html',
    'text!html/favour-analyst/item_favour-analyst.html'], function (index, css, item) {

    var FavourAnalystModel = Backbone.Model.extend({
        defaults: {
            'a_id': '1',
            'a_name': '胡子欣',
            'a_institution': '东海证券',
            'a_position': '分析员',
            'following_stocks': [],
            'portrait': '0'
        }
    });

    var FavourAnalystCollection = Backbone.Collection.extend({
        model: FavourAnalystModel,
        models: []
    });

    var SingleAnalystView = Backbone.View.extend({

        template: HandleBars.compile(item),

        events: {
            'click .followed-item':'enter_analyst',
            'click .col4': 'unfollow'
        },

        initialize: function () {
            this.$el.html(this.template(this.model.toJSON()));
        },

        enter_analyst: function () {
            var a_id = this.model.get("a_id");
            Router.navigate('analyst/' + a_id, {trigger: true});
        },

        unfollow: function () {
            var ctx = this;
            $.get('http://stock.whytouch.com/users/unfollow_analyzer.php?u_id=' + User.phone + '&a_id=' + this.model.a_id, function () {
                ctx.$el.html('');
            }, 'json');
        }
    });

    var FavourAnalystView = Backbone.View.extend({

        el: index,

        analysts: new FavourAnalystCollection(),

        events: {
            'click .nav-icon.left': 'back'
        },

        initialize: function () {
            loadCSS(css);

            console.log(this.el);
            this.analysts = new FavourAnalystCollection();
            var ctx = this;
            $.get('http://stock.whytouch.com/users/get_following_analyzers.php?u_id=1', function (data) {
                var list = JSON.parse(data.following_analyzers);
                _.each(list, function (item) {
                    ctx.analysts.add(item);
                });
//                console.log(ctx.analysts);
                ctx.analysts.each(ctx.show, ctx);
            }, 'json');

        },

        show: function (model) {
            var view = new SingleAnalystView({model: model});
            console.log(view.el);
            this.$('.content').append(view.el);
        },


        back: function () {
            history.back();
        }

    });


    return FavourAnalystView;
});