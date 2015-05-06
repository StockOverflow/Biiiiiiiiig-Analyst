/**
 * Created by lifengshuang on 5/6/15.
 */

define(['text!html/stock/index_stock.html', 'text!html/stock/css_stock.html',
        'text!html/stock/tab1_stock.html', 'text!html/stock/tab2_stock.html',
        'text!html/stock/tab3_stock.html', 'text!html/stock/info_stock.html',
        'app/model/stock_model'],
    function (index, css, tab1, tab2, tab3, info) {

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
                this.tabTwo();
                this.getStockInfo(this.s_id, 0, true);
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
                $.get(base_url, function (data) {
                    var template = HandleBars.compile(info);
                    var basic_info = JSON.parse(data.basic_info);
                    var injected = template({'yesterday_price': basic_info.yesterday_price,
                        'up': basic_info.up,
                        'expected_price': basic_info.expected_price,
                        'num_of_researches': basic_info.num_of_researches}
                        );

                    $('.homepage-item').append(injected);

                }, 'json');
            }

        });

        return StockView;

    })
;