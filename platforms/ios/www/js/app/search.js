/**
 * Created by lifengshuang on 5/14/15.
 */

define(['text!html/search/index_search.html', 'text!html/search/css_search.html',
        'text!html/search/analyst_item_search.html', 'text!html/search/stock_item_search.html',
        'text!html/search/not_found_search.html'],
    function (index, css, analyst, stock, not_found) {

    var SearchView = Backbone.View.extend({

        el: index,

        count: 0,

        receiveCount: 0,

        analyst_template: HandleBars.compile(analyst),

        stock_template: HandleBars.compile(stock),

        events: {
            'click #search-cancel': 'back',
            'click #clear-icon': 'clearText',
            'click .homepage-item': 'analyst',
            'click .analyst-di-item': 'stock',
            'keyup .search-text': 'search',
            'input .search-text': 'search'
        },

        initialize: function () {
            loadCSS(css);
            $('.search-text').focus();
            if (User.hasSignin){
                this.$('.drawer-username').html(User.name);
            }
        },

        search: function () {
            var text = $('.search-text').val();
            console.log('search' + text);
            this.count += 1;
            var thisCount = this.count;
            var ctx = this;
            $.get('http://stock.whytouch.com/search.php?word=' + text, function (data) {
//                console.log(data);
//                console.log(thisCount + ' & ' + ctx.receiveCount);
                if (ctx.receiveCount < thisCount) {
                    ctx.receiveCount = thisCount;
                    if (data.code == 200) {
                        console.log('change');
                        $('.content').html('');
                        var analysts = data.analyzers;
                        var stocks = data.stocks;
                        for (var i = 0; i < analysts.length; i++){
                            $.get('http://stock.whytouch.com/analyzerpages/get_analyzer_info.php?a_id=' + analysts[i].a_id,
                                function (data) {
                                if (ctx.receiveCount == thisCount && data.code == 200){
//                                    $('.content').append(ctx.analyst_template($.extend(JSON.parse(data.basic_info), JSON.parse(data.attribute))));
                                    $('.content').append(ctx.analyst_template($.extend(JSON.parse(data.basic_info), JSON.parse(data.attribute))));
                                }
                            }, 'json');
                        }
                        for (var j = 0; j < stocks.length; j++){
                            $.get('http://stock.whytouch.com/stockpages/get_stock_price.php?s_id=' + stocks[j].s_id + '&days=2&need_basic_info=true',
                                function (data) {
                                if (ctx.receiveCount == thisCount && data.code == 200){
//                                    $('.content').append(ctx.analyst_template($.extend(JSON.parse(data.basic_info), JSON.parse(data.attribute))));
                                    $('.content').append(ctx.stock_template(JSON.parse(data.basic_info)));
                                }
                            }, 'json');
                        }
                    }
                    else if (data.code == 500) {
                        $('.content').html(not_found);
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
            history.back();
        }



    });
    return SearchView;

});