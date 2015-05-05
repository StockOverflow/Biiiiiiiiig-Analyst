/**
 * Created by lifengshuang on 5/4/15.
 */

define(['jquery', 'backbone', 'handlebars', 'text!html/homepage/index.html', 'text!html/homepage/analyst_item.html'],
    function ($, Backbone, HandleBars, index, analyst) {
//    console.log(index);
//    console.log(analyst);

    var Analyst = Backbone.Model.extend({
        defaults: {
            'name': '胡子欣',
            'title': '东海证券分析员',
            'rate': '平均收益率',
            'rate_num': '+20%',
            'bias': '平均偏移度',
            'bias_num': '+30%',
            'badge': ['招商证券']
        }
    });

    var AnalystList = Backbone.Collection.extend({
        model: Analyst
    });

    var Analysts = new AnalystList();
        //TODO: load data to Analysts
//        console.log((new Analyst()).attributes);
        Analysts.add(new Analyst());

    var AnalystView = Backbone.View.extend({

        template: HandleBars.compile(analyst),

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
//            this.render();
        },

        render: function () {
            var context = {name: this.model.get('name'), title: this.model.get('title'),
                            rate: this.model.get('rate'), rate_num: this.model.get('rate_num'),
                            bias: this.model.get('bias'), bias_num: this.model.get('bias_num'),
                            badge: this.model.get('badge')[0]};//TODO: badge with correct counts
//            console.log(this.model.toJSON());
            this.$el.html(this.template(context));
        }
    });

    var HomePageView = Backbone.View.extend({

        el: index,

        initialize: function () {
            $('head').append('<link type="text/css" rel="stylesheet" href="css/main.css"><link type="text/css" rel="stylesheet" href="css/homepage.css">');
            this.render();
        },

        render: function () {
            Analysts.each(this.show, this);
        },

        show: function (analyst) {
            console.log(analyst.toJSON());
            var view = new AnalystView({model: analyst});
//            this.$el('#content').append(view.el);
            console.log(this.$el);
        }

    });

    return new HomePageView();
});