/**
 * Created by lifengshuang on 5/14/15.
 */

define(['text!html/search/index_search.html', 'text!html/search/css_search.html',
        'text!html/search/analyst_item_search.html', 'text!html/search/stock_item_search.html',
        'text!html/search/not_found_search.html'],
    function (index, css, analyst, stock, not_found) {

        var AnalystView = Backbone.View.extend({

            template: HandleBars.compile(analyst),

            events: {
                'click .analyst-item': 'click'
            },

            initialize: function () {
                this.$el.html(this.template(this.model));
            },

            click: function(){
                Router.navigate('analyst/' + this.model.a_id, {trigger: true});
            }

        });

        var StockView = Backbone.View.extend({

            template: HandleBars.compile(stock),

            events: {
                'click .stock-item': 'click'
            },

            initialize: function () {
                this.$el.html(this.template(this.model));
            },

            click: function(){
                Router.navigate('stock/' + this.model.s_id, {trigger: true});
            }

        });


        var SearchView = Backbone.View.extend({

            el: index,

            count: 0,

            receiveCount: 0,

//            analyst_template: HandleBars.compile(analyst),

//            stock_template: HandleBars.compile(stock),

            events: {
                'click #search-cancel': 'back',
                'click #clear-icon': 'clearText',
                'click .homepage-item': 'analyst',
                'click .analyst-di-item': 'stock',
//                'keyup .search-text': 'search',
                'input .search-text': 'search'
            },

            initialize: function () {
                loadCSS(css);
                if (User.hasSignin){
                    this.$('.drawer-username').html(User.name);
                }
            },

            search: function () {
                var text = $('.search-text').val();
                console.log('search: ' + text);
                this.count += 1;
                var thisCount = this.count;
                var ctx = this;
                $.get('http://stock.whytouch.com/search.php?word=' + text, function (data) {
                    if (ctx.receiveCount < thisCount) {
                        ctx.receiveCount = thisCount;
                        if (data.code == 200) {
                            $('.content').html('');
                            var analysts = data.analyzers;
                            var stocks = data.stocks;
                            for (var i = 0; i < analysts.length; i++){
                                ctx.getAnalystData(analysts[i].a_id, ctx, thisCount);
                            }
                            for (var j = 0; j < stocks.length; j++){
                                ctx.getStockData(stocks[j].s_id, ctx, thisCount);
                            }
                        }
                        else if (data.code == 500) {
                            $('.content').html(not_found);
                        }
                    }
                }, 'json');
            },

            getAnalystData: function (a_id, ctx, thisCount) {
                $.get('http://stock.whytouch.com/analyzerpages/get_analyzer_info.php?a_id=' + a_id,
                    function (data) {
                        if (ctx.receiveCount == thisCount && data.code == 200){
                            var analystModel = $.extend({'a_id': a_id}, JSON.parse(data.basic_info));
                            var analystView = new AnalystView({model: analystModel});
                            if (location.hash.indexOf('#search') != -1) {
                                $('.content').append(analystView.el);
                            }
                        }
                    }, 'json');
            },

            getStockData: function (s_id, ctx, thisCount) {
                $.get('http://stock.whytouch.com/stockpages/get_stock_price.php?s_id=' + s_id + '&days=2&need_basic_info=true',
                    function (data) {
                        if (ctx.receiveCount == thisCount && data.code == 200){
//                            $('.content').append(ctx.stock_template(JSON.parse(data.basic_info)));
                            var stockModel = $.extend({'s_id': s_id}, JSON.parse(data.basic_info));
                            var stockView = new StockView({model: stockModel});
                            if (location.hash.indexOf('#search') != -1) {
                                $('.content').append(stockView.el);
                            }
                        }
                    }, 'json');
            },

            clearText: function () {
                this.$('.search-text').val('');
            },

            analyst: function () {
                Router.navigate('analyst', {trigger: true});
            },

            stock: function () {
                Router.navigate('stock/1', {trigger: true});
            },

            back: function () {
                Router.back();
            }



        });
        return SearchView;

    });