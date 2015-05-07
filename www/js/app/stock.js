/**
 * Created by lifengshuang on 5/6/15.
 */

define(['text!html/stock/index_stock.html', 'text!html/stock/css_stock.html',
        'text!html/stock/tab1_stock.html', 'text!html/stock/tab2_stock.html',
        'text!html/stock/tab3_stock.html', 'text!html/stock/info_stock.html',
        'app/chartwrapper'],
    function (index, css, tab1, tab2, tab3, info, chartwrapper) {

        var StockView = Backbone.View.extend({

            s_id: '1',
            el: index,

            tabNumber: 0,

            events: {
                'click #rt-tab': 'tabOne',
                'click #di-tab': 'tabTwo',
                'click #ci-tab': 'tabThree',
                'click .left': 'back'
            },

            initialize: function () {
                console.log('analystView initialize');
                loadCSS(css);
                this.tabOne();
                //this.renderStockChart();

                this.getStockInfo(this.s_id, 60, true);
                //this.render();
            },

            render: function (injected_info) {
                this.$('.homepage-item').append(injected_info);
            },

            tabOne: function () {
                if (this.tabNumber != 1) {
                    this.tabNumber = 1;
                    this.hideAllTab();
                    this.$('.content').append(tab1);
                }
            },

            tabTwo: function () {
                if (this.tabNumber != 2) {
                    this.tabNumber = 2;
                    this.hideAllTab();
                    this.$('.content').append(tab2);
                }
            },

            tabThree: function () {
                console.log(tab3);
                if (this.tabNumber != 3) {
                    this.tabNumber = 3;
                    this.hideAllTab();
                    this.$('.content').append(tab3);
                }
            },

            hideAllTab: function () {
                $('.rt-div').remove();
                $('.di-div').remove();
                $('.ci-div').remove();
            },

            back: function () {
                history.back();
//                Router.popHistory();
            },

            getStockInfo: function (s_id, days, need_basic_info) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_stock_price.php?s_id=' + s_id
                    + '&days=' + days + '&need_basic_info=' + need_basic_info;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderStockInfo(data.basic_info);
                    ctx.renderStockChart(data.price);
                    ctx.renderTitle(s_id, data.basic_info);

                    /*TODO: save tab contents*/
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

                // Get the context of the canvas element we want to select
                var ctx = $("#stockChart").get(0).getContext("2d");
                new Chart(ctx).Line(wrapped[0], wrapped[1]);
            },

            renderTitle: function (s_id, data) {
                var basic_info = JSON.parse(data);
                $(".nav-bar>.title").html(basic_info.name + "(" + s_id + ")");
            }
        });

        return StockView;

    })
;