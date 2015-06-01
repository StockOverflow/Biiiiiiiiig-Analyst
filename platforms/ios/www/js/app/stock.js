/**
 * Created by lifengshuang on 5/6/15.
 */

define(['text!html/stock/index_stock.html', 'text!html/stock/css_stock.html',
        'text!html/stock/tab1_stock.html', 'text!html/stock/tab2_stock.html',
        'text!html/stock/tab3_stock.html', 'text!html/stock/info_stock.html',
        'app/chartwrapper',
        'text!html/stock/stock_analyst_item.html', 'text!html/stock/stock_research_item.html'
        , 'text!html/stock/anlayst_to_stock.html'],
    function (index, css, tab1, tab2, tab3, info, chartwrapper, analyst_item, research_item, analyst_to_stock_item) {

        var StockView = Backbone.View.extend({

            s_id: '1',
            el: index,
            graph: false,
            events: {
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
                'click .nav-bar>.left': 'back',
                'click .nav-bar>.right': 'search',
                'click .stock-tounfollow': 'toFollow',

                'touchstart .scroll': 'scrollStart',
                'touchend .scroll': 'scrollEnd',
                'touchmove .scroll': 'scroll'
            },

            initialize: function (s_id) {
                this.s_id = s_id;
                this.$('.content').append(tab1).append(tab2).append(tab3);
                loadCSS(css);

                setTimeout(this.getStockData(this.s_id, 30, true), 0);
                setTimeout(this.getAnalystData(this.s_id), 1000);
                setTimeout(this.getResearchData(this.s_id), 1000);
            },

            render: function () {
            },

            tabOne: function () {
                this.hideAllTab(2, 3);
                $('.rt-div').css('display', 'block');
                //$(".rt-div").slideToggle("slow", 'ease');
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
            },

            back: function () {
                Router.back();
            },

            toFollow: function () {
                if (User.hasSignin) {
                    if (User.hasFollowStock(this.s_id)) {
                        User.unfollowStock(this.s_id);
                        $('.stock-tounfollow')[0].src = 'img/tounfollow.png';
                    }
                    else {
                        User.followStock(this.s_id);
                        $('.stock-tounfollow')[0].src = 'img/tofollow.png';
                    }
                }
            },

            getStockData: function (s_id, days, need_basic_info) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_stock_price.php?s_id=' + s_id
                    + '&days=' + days + '&need_basic_info=' + need_basic_info;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderStockInfo(data.basic_info);
                    ctx.renderStockChart(data.price);
                    ctx.renderTitle(s_id, data.basic_info);
                }, 'json');
            },

            renderStockInfo: function (data) {
                var basic_info = JSON.parse(data);
                var template = HandleBars.compile(info);
                var injected = template({
                        'yesterday_price': basic_info.yesterday_price,
                        'up': basic_info.up,
                        'expected_price': basic_info.expected_price,
                        'num_of_researches': basic_info.num_of_researches
                    }
                );
                $('.homepage-item').append(injected);
                var ctx = this;
                setTimeout(function () {
                    if (User.hasSignin) {
                        if (User.hasFollowStock(ctx.s_id)) {
                            $('.stock-tounfollow')[0].src = 'img/tofollow.png';
                        }
                        else {
                            $('.stock-tounfollow')[0].src = 'img/tounfollow.png';
                        }
                    }
                }, 250);
            },

            renderStockChart: function (data) {
                var price = JSON.parse(data);
                var wrapped = stocklinechart(price);

                var ctx = $("#stockChart").get(0).getContext("2d");
                new Chart(ctx).Line(wrapped[0], wrapped[1]);
            },

            renderTitle: function (s_id, data) {
                var basic_info = JSON.parse(data);
                $(".nav-bar>.title").html(basic_info.name + "(" + s_id + ")");
            },

            getAnalystData: function (s_id) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_analysis.php?s_id=' + s_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderAnalysts(data.analysis);
                }, 'json');
            },

            renderAnalysts: function (data) {
                var analysts = JSON.parse(data);
                var ctx = this;
                _.each(analysts, function (item) {
                    var template = HandleBars.compile(analyst_item);
                    var injected = template({
                            'date': item.date,
                            'a_name': item.a_name,
                            'target_price': item.target_price,
                            'yield_rate': percentageToString(item.yield_rate),
                            'drift_rate': percentageToString(item.drift_rate),
                            'accuracy': percentageToString(item.accuracy),
                            'speed': percentageToString(item.speed),
                            'stability': percentageToString(item.stability),
                            'a_id': 'aid' + item.a_id
                        }
                    );
                    $('.di-div .QAQ').append(injected);
                    ctx.getAnalystToStockData(ctx.s_id, item.a_id);
                    var target = $('.di-div .aid' + item.a_id).siblings();
                    target.children('.col5').click(function () {
                        var obj = $('.aid' + item.a_id);
                        var dis = obj.css('display');
                        if (dis == 'none') {
                            target.children('.col5').children('.stock-di-fold').attr('src', 'img/unfold.png');
                            obj.css('display', 'block');
                        } else {
                            target.children('.col5').children('.stock-di-fold').attr('src', 'img/fold.png');
                            obj.css('display', 'none');
                        }
                    });

                    $('.di-div .aid' + item.a_id).siblings().children('.col1').click(function () {
                        Router.navigate('analyst/' + item.a_id, {trigger: true});
                    });
                });
            },

            getResearchData: function (s_id) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_researches.php?s_id=' + s_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderResearches(data.researches);
                }, 'json');
            },

            renderResearches: function (data) {
                var researches = JSON.parse(data);
                _.each(researches, function (item) {
                    var template = HandleBars.compile(research_item);
                    var injected = template({
                            'title': item.title,
                            'date': item.date,
                            'a_name': item.a_name,
                            'a_id': "aid" + item.a_id
                        }
                    );
                    $('.ci-div .QAQ').append(injected);
                    $('.ci-div .aid' + item.a_id).children('.col6').click(function () {
                        Router.navigate('analyst/' + item.a_id, {trigger: true});
                    });
                });
            },

            getAnalystToStockData: function (s_id, a_id) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_researches_by_analyzer.php?s_id=' + s_id + "&a_id=" + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    if (!ctx.graph) {
                        ctx.renderAnalystToStock(a_id, data.researches_by_analyzer);
                        ctx.graph = true;
                    }
                }, 'json');
            },

            renderAnalystToStock: function (a_id, data) {
                var researches = JSON.parse(data);
                _.each(researches, function (item) {
                    var title = item.title, date = item.date;

                    var template = HandleBars.compile(analyst_to_stock_item);
                    var injected = template({
                            'content': title + "-" + date
                        }
                    );
                    $('.di-div .aid' + a_id).append(injected);
                });
            },


            search: function () {
                Router.navigate('search', {trigger: true});
            },

            scrollStart: function (ev) {
                ev.stopPropagation();
                ev.preventDefault();
                this.startX = ev.originalEvent.touches[0].screenX;
                this.startY = ev.originalEvent.touches[0].screenY;
                this.leftX = $('.scroll').scrollLeft();
                this.topY = $('.QAQ').scrollTop();
            },

            startX: 0,
            startY: 0,

            leftX: 0,
            topY: 0,

            scrollEnd: function (ev) {
                ev.stopPropagation();
            },

            scroll: function (ev) {
                var x_change = this.startX - ev.originalEvent.touches[0].screenX;
                var y_change = this.startY - ev.originalEvent.touches[0].screenY;
                var ctx = this;
                var objs = ctx.$('.scroll');
                _.each(objs, function (obj) {
                    $(obj).scrollLeft(x_change / screenRatio + ctx.leftX);
                });
                console.log(y_change / screenRatio + ctx.topY);
                $('.QAQ').scrollTop(y_change / screenRatio + ctx.topY);
            }

        });

        return StockView;

    })
;