/**
 * Created by lifengshuang on 5/4/15.
 */

define(['text!html/homepage/index_homepage.html', 'text!html/homepage/analyst_item.html',
        'text!html/homepage/css_homepage.html', 'app/model/AnalystRankingModel',
        'app/model/AnalystRankingCollection'],
    function (index, analyst, css, AnalystRankingModel, AnalystRankingCollection) {

        var AnalystView = Backbone.View.extend({

            model: new AnalystRankingModel(),
            template: HandleBars.compile(analyst),

            events: {'click .homepage-item':'enter_analyst'},

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.render();
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
                //this.listenTo(this.$el, 'click', this.enter_analyst);
            },

            enter_analyst: function () {
                var a_id = this.model.get("a_id");
                //alert(a_id);
                Router.navigate('analyst/' + a_id, {trigger: true});
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
                    this.analysts = new AnalystRankingCollection();
                    this.render();
                    loadCSS(css);
                },

                render: function () {
                    //getAnalystRankingData
                    var base_url = "http://stock.whytouch.com/get_rankings.php?type=" + "accuracy";
                    var ctx = this;
                    $.get(base_url, function (data) {
                        var ans = JSON.parse(data.analyzer_rankings);
                        _.each(ans, function (item) {
                            ctx.analysts.add(item);
                        });
                        ctx.analysts.each(ctx.show, ctx);
                    }, 'json');
                },

                show: function (model) {
                    var view = new AnalystView({model: model});
                    this.$('.content').append(view.el);
                },

                searchCancel: function () {
                    this.$('#homepage-search').val('');
                },

                drawer: function () {
                    Router.navigate('drawer', {trigger: true});
                },

                search: function () {
                    Router.navigate('search', {trigger: true});
                }
            })
            ;

        return HomePageView;
    })
;