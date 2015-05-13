/**
 * Created by lifengshuang on 5/4/15.
 */

define(['text!html/homepage/index_homepage.html', 'text!html/homepage/analyst_item.html',
        'text!html/homepage/css_homepage.html', 'app/model/AnalystRankingModel',
        'app/model/AnalystRankingCollection'],
    function (index, analyst, css, AnalystRankingModel, AnalystRankingCollection) {

        var AnalystView = Backbone.View.extend({

            template: HandleBars.compile(analyst),

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.render();
            },

            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
            }
        });

        var HomePageView = Backbone.View.extend({

            el: index,

            analysts: new AnalystRankingCollection(),

            events: {
                'click #homepage-search-cancel': 'searchCancel',
                'click .homepage-item': 'click',
                'click .nav-bar .left': 'drawer',
                'click .search-text': 'search'
            },

            initialize: function () {
                /*TODO only uncomment this only compiling to mobile*/
                //FastClick.attach(this.$('body'));
                this.analysts.add(new AnalystRankingModel());
                setTimeout(this.getAnalystRankingData("accuracy"), 0);
                loadCSS(css);
                this.render();
            },

            render: function () {
                this.analysts.each(this.show, this);
            },

            show: function (model) {
                var view = new AnalystView({model: model});
                this.$('.content').append(view.el.innerHTML);
            },

            searchCancel: function () {
                this.$('#homepage-search').val('');
            },

            click: function () {
                Router.navigate('analyst', {trigger: true});
            },

            drawer: function () {
                Router.navigate('drawer', {trigger:true});
            },

            search: function () {
                Router.navigate('search', {trigger: true});
            },

            getAnalystRankingData: function (type) {
                var base_url = "http://stock.whytouch.com/get_rankings.php?type=" + type;
                //TODO TODO TODO TODO TODO TODO
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderResearches(data.researches);
                }, 'json');
            }

        });

        return HomePageView;
    });