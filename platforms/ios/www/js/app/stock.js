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

            events: {
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
                'click .nav-bar>.left': 'back',
                'click .nav-bar>.right': 'search'
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
                history.back();
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
                    var target_price = item.target_price, a_name = item.a_name, a_id = item.a_id;
                    var yield_rate = (item.yield_rate > 0) ? ("+" + (item.yield_rate * 100) + "%") : ((item.yield_rate * 100) + "%");

                    var template = HandleBars.compile(analyst_item);
                    var injected = template({
                            'target_price': target_price,
                            'yield_rate': yield_rate,
                            'a_name': a_name,
                            'a_id': 'aid' + a_id
                        }
                    );
                    $('.di-div').append(injected);
                    ctx.getAnalystToStockData(ctx.s_id, a_id);
                    $('.aid' + a_id).parent().click(function () {
                        var obj = $('.aid' + a_id);
                        var dis = obj.css('display');
                        if (dis == 'none') {
                            obj.css('display', 'block');
                        } else {
                            obj.css('display', 'none');
                        }
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
                    var title = item.title, date = item.date, a_name = item.a_name;

                    var template = HandleBars.compile(research_item);
                    var injected = template({
                            'title': title,
                            'date': date,
                            'a_name': a_name
                        }
                    );
                    $('.ci-div').append(injected);
                });
            },

            getAnalystToStockData: function (s_id, a_id) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_researches_by_analyzer.php?s_id=' + s_id + "&a_id=" + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderAnalystToStock(a_id, data.researches_by_analyzer);
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
                    $('.aid' + a_id).append(injected);
                });
            },


            search: function () {
                Router.navigate('search', {trigger: true});
            }
        });

        return StockView;

    })
;