/**
 * Created by lifengshuang on 5/4/15.
 */

define(['text!html/homepage/index_homepage.html', 'text!html/homepage/analyst_item.html',
        'text!html/homepage/css_homepage.html', 'app/model/AnalystRankingModel',
        'app/model/AnalystRankingCollection', 'text!html/homepage/rank_modal.html', 'app/chartwrapper'],
    function (index, analyst, css, AnalystRankingModel, AnalystRankingCollection, RankModal, chartwrapper) {

        var AnalystView = Backbone.View.extend({

            model: new AnalystRankingModel(),
            template: HandleBars.compile(analyst),

            events: {
                'click .homepage-item': 'enter_analyst'
            },

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
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
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
                        item.average_yield_rate = percentageToString(item.average_yield_rate);
                        item.average_drift_rate = percentageToString(item.average_drift_rate);
                        item.speed = percentageToString(item.speed);
                        item.stability = percentageToString(item.stability);
                        item.accuracy = percentageToString(item.accuracy);
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
//                Router.navigate('drawer', {trigger: true});
                require(['app/drawer'], function (drawer) {
//                Slider.slide((new drawer()).el);
                    $('.page_center').append((new drawer()).el);
                });
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
            },

            tabOne: function () {
                this.hideAllTab(2, 3);
                $('.rt-div').css('display', 'block');
                $('.rt-tab').children('img').attr('src', "img/integration%20click.png");
            },

            tabTwo: function () {
                this.hideAllTab(1, 3);
                $('.di-div').css('display', 'block');
                $('.di-tab').children('img').attr('src', "img/Documents%20%20click.png");
            },

            tabThree: function () {
                this.hideAllTab(1, 2);
                $('.ci-div').css('display', 'block');
                $('.ci-tab').children('img').attr('src', "img/Comments.png");

            },

            hideAllTab: function (a, b) {
                if (5 != a + b) {
                    $('.rt-div').css('display', 'none');
                    $('.rt-tab').children('img').attr('src', "img/integration.png");
                }
                if (4 != a + b) {
                    $('.di-div').css('display', 'none');
                    $('.di-tab').children('img').attr('src', "img/Documents.png");
                }
                if (3 != a + b) {
                    $('.ci-div').css('display', 'none');
                    $('.ci-tab').children('img').attr('src', "img/Comments-normal.png");
                }
            }


        });


        return HomePageView;

    }
)
;
