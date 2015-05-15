/**
 * Created by lifengshuang on 5/4/15.
 */

define(['text!html/homepage/index_homepage.html', 'text!html/homepage/analyst_item.html',
        'text!html/homepage/css_homepage.html', 'app/model/AnalystRankingModel',
        'app/model/AnalystRankingCollection', 'text!html/homepage/rank_modal.html'],
    function (index, analyst, css, AnalystRankingModel, AnalystRankingCollection, RankModal) {

        var AnalystView = Backbone.View.extend({

            model: new AnalystRankingModel(),
            template: HandleBars.compile(analyst),

            events: {'click .homepage-item': 'enter_analyst'},

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
                this.render();
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON()));
            },

            enter_analyst: function () {
                var a_id = this.model.get("a_id");
                Router.navigate('analyst/' + a_id, {trigger: true});
            }
        });

        var HomePageView = Backbone.View.extend({

            el: index,

            analysts: new AnalystRankingCollection(),

            events: {
                'click .homepage-item': 'click',
                'click .nav-bar .left': 'drawer',
                'click .search-text': 'search',
                'click #homepage-search-rank': 'showModal',
                'click .rank-by-stability': function () {
                    this.rankBy('stability');
                },
                'click .rank-by-speed': function () {
                    this.rankBy('speed');
                },
                'click .rank-by-accuracy': function () {
                    this.rankBy('accuracy');
                },
                'click .rank-by-average-yield-rate': function () {
                    this.rankBy('average_yield_rate');
                },
                'click .rank-by-average-drift-rate': function () {
                    this.rankBy('average_drift_rate');
                },
                'click .rank-cancel': 'removeModal',
                'click .rank-modal': 'removeModal'
            },

            initialize: function () {
                this.render('accuracy');
                loadCSS(css);
            },

            render: function (type) {
                //getAnalystRankingData
                this.analysts = new AnalystRankingCollection();
                this.$('.homepage-items').html('');
                var base_url = "http://stock.whytouch.com/get_rankings.php?type=" + type;
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
                this.$('.homepage-items').append(view.el);
            },


            drawer: function () {
                Router.navigate('drawer', {trigger: true});
            },

            search: function () {
                Router.navigate('search', {trigger: true});
            },

            showModal: function () {
                //$('.rank-modal').css('display', 'block');
                this.$('.rank-modal').fadeTo(100, 1).removeClass('slide-down')
                    .css('bottom', '-500px')
                    .addClass('slide-up', 500, 'easeOutQuart');

            },

            rankBy: function (type) {
                this.render(type);
                switch (type) {
                    case 'stability':
                        this.$('#homepage-search-rank').html('稳定性');
                        break;
                    case 'speed':
                        this.$('#homepage-search-rank').html('速度');
                        break;
                    case 'accuracy':
                        this.$('#homepage-search-rank').html('准确性');
                        break;
                    case 'average_yield_rate':
                        this.$('#homepage-search-rank').html('收益率');
                        break;
                    case 'average_drift_rate':
                        this.$('#homepage-search-rank').html('偏移度');
                        break;
                }
                this.removeModal();
            },

            removeModal: function () {
                this.$('.rank-modal').removeClass('slide-up')
                    .css('bottom', '0')
                    .addClass('slide-down', 300, 'easeOutQuint');
                this.$('.rank-modal').fadeTo(100, 0, function () {
                    $('.rank-modal').css('display', 'none');
                });
            }


        });


        return HomePageView;

    }
)
;
