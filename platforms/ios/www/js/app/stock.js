/**
 * Created by lifengshuang on 5/6/15.
 */

define(['text!html/stock/index_stock.html', 'text!html/stock/css_stock.html',
        'text!html/stock/tab1_stock.html', 'text!html/stock/tab2_stock.html',
        'text!html/stock/tab3_stock.html', 'text!html/stock/info_stock.html',
        'app/chartwrapper', 'text!html/stock/stock_analyst_item.html'],
    function (index, css, tab1, tab2, tab3, info, chartwrapper, analyst_item) {

        var StockView = Backbone.View.extend({

            s_id: '1',
            el: index,

            events: {
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
                'click .left': 'back'
            },

            initialize: function () {
                this.$('.content').append(tab1).append(tab2).append(tab3);

                loadCSS(css);

                this.getStockData(this.s_id, 30, true);
                setTimeout(this.getAnalystData(this.s_id), 1000);
            },

            render: function () {
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
                _.each(analysts, function (item) {
                    var target_price = item.target_price,
                        yield_rate = (item.yield_rate * 100) + "%",
                        a_name = item.a_name;
                    var template = HandleBars.compile(analyst_item);
                    var injected = template({
                            'target_price': target_price,
                            'yield_rate': yield_rate,
                            'a_name': a_name
                        }
                    );
                    $('.di-div').append(injected);
                });
            }
        });

        return StockView;

    })
;