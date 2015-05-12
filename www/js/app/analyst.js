/**
 * Created by lifengshuang on 5/5/15.
 */

define(['text!html/analyst/index_analyst.html', 'text!html/analyst/css_analyst.html',
        'text!html/analyst/tab1_analyst.html', 'text!html/analyst/tab2_analyst.html',
        'text!html/analyst/tab3_analyst.html', 'text!html/analyst/info_analyst.html'],
    function (index, css, tab1, tab2, tab3, info) {


        var AnalystView = Backbone.View.extend({

            el: index,

            tabNumber: 0,

            events: {
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
                'click .left': 'back',
                'click .analyst-di-stock': 'enter_stock'
            },

            initialize: function () {
                this.$('.content').append(tab1).append(tab2).append(tab3);
                loadCSS(css);
                //this.render();
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
//                Router.popHistory();
            },


            enter_stock: function () {
                Router.navigate('stock/1', {trigger: true});
            },

            getAnalystData: function (a_id) {
                var base_url = 'http://stock.whytouch.com//analyzerpages/get_analyzer_info.php?s_id=' + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderAnalystInfo(data.basic_info);
                    ctx.renderStockChart(data.price);
                    ctx.renderTitle(s_id, data.basic_info);
                }, 'json');
            },

            renderAnaltsyInfo: function (data) {
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
        });

        return AnalystView;

    }
);