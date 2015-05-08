/**
 * Created by lifengshuang on 5/4/15.
 */

define(['text!html/homepage/index_homepage.html', 'text!html/homepage/analyst_item.html', 'text!html/homepage/css_homepage.html'],
    function (index, analyst, css) {
//    console.log(index);
//    console.log(analyst);

        var AnalystModel = Backbone.Model.extend({
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
            model: AnalystModel
        });

        var Analysts = new AnalystList();
        //TODO: load data to Analysts
//        console.log((new Analyst()).attributes);
        Analysts.add(new AnalystModel());

        var AnalystView = Backbone.View.extend({

            template: HandleBars.compile(analyst),

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.render();
            },

            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
//            console.log('render');
            }


        });

        var HomePageView = Backbone.View.extend({

            el: index,


            events: {
                'click #homepage-search-cancel': 'searchCancel',
                'click .homepage-item': 'click'
            },

            initialize: function () {
                /*TODO only uncomment this only compiling to mobile*/
                //FastClick.attach(this.$('body'));
                console.log('homepageView initialize');
                loadCSS(css);
                this.render();
            },

            render: function () {
                console.log('homepageView render');
                Analysts.each(this.show, this);
//            console.log(this.el)
            },

            show: function (model) {
                var view = new AnalystView({model: model});
                this.$('.content').append(view.el.innerHTML);
            },

            searchCancel: function () {
                console.log('cancel click');
                this.$('#homepage-search').val('');
            },

            click: function () {
                Slider.direction = 'left';
                Router.navigate('analyst', {trigger: true});
            }

        });

        return HomePageView;
    });