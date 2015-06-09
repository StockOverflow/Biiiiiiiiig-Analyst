/**
 * Created by lifengshuang on 5/6/15.
 */

define(['text!html/stock/index_stock.html', 'text!html/stock/css_stock.html',
        'text!html/stock/tab1_stock.html', 'text!html/stock/tab2_stock.html',
        'text!html/stock/tab3_stock.html', 'text!html/stock/info_stock.html',
        'app/chartwrapper',
        'text!html/stock/stock_analyst_item.html', 'text!html/stock/stock_research_item.html'
        , 'text!html/stock/anlayst_to_stock.html',
        'text!html/analyst/stock_image.html'],
    function (index, css, tab1, tab2, tab3, info, chartwrapper, analyst_item, research_item, analyst_to_stock_item, stock_image) {

        var StockView = Backbone.View.extend({

            s_id: '1',
            el: index,
            events: {
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
                'click .nav-bar>.left': 'back',
                'click .nav-bar>.left-second': 'home',
                'click .nav-bar>.nav-search': 'search',
                'click .nav-bar>.right': 'search',
                'click .stock-tounfollow': 'toFollow',
                'click .stock-image-shadow': 'hide_stock_image',

                'touchstart .scroll': 'scrollStart',
                'touchend .scroll': 'scrollEnd',
                'touchmove .scroll': 'scroll'
            },

            initialize: function (s_id) {
                this.s_id = s_id;
                this.$('.content').append(tab1).append(tab2).append(tab3);
                loadCSS(css);

                setTimeout(this.getStockData(this.s_id, 20, true), 0);
                setTimeout(this.getSinaData(this.s_id), 0);
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

            home: function () {
                Slider.direction = 'left';
                Router.navigate('homepage', {trigger: true});
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
                    //ctx.renderStockInfo(data.basic_info);
                    //ctx.renderStockChart(data.price);
                    ctx.renderTitle(s_id, data.basic_info);
                    ctx.renderStockChart();
                }, 'json');

            },

            getSinaData: function (s_id) {
                var base_url = (s_id.indexOf("6") == 0) ? 'http://hq.sinajs.cn/list=sh' + s_id : 'http://hq.sinajs.cn/list=sz' + s_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderStockInfo(data);
                }, 'html');
            },

            renderStockInfo: function (data) {
                data = data.substr(data.indexOf('"') + 1,
                    data.indexOf('"', data.indexOf('"') + 1) - data.indexOf('"') - 1);
                var array = [];
                var ptr = -1;
                while (data.indexOf(',', ptr + 1) != -1) {
                    array.push(data.substr(ptr + 1, data.indexOf(',', ptr + 1) - ptr - 1));
                    ptr = data.indexOf(',', ptr + 1);
                }
                array.push(data.substr(ptr + 1, data.length - ptr - 1));
                //alert(array);

                var template = HandleBars.compile(info);
                var injected = template({
                        'name': array[0],
                        'price_now': array[3],
                        'open_price': array[1],
                        'close_price': array[2],
                        'max_price': array[4],
                        'min_price': array[5],
                        'stock_amount': array[8],
                        'money': array[9],
                        'date': array[30],
                        'time': array[31]
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
                /*var price = JSON.parse(data);
                 var wrapped = stocklinechart(price);

                 var ctx = $("#stockChart").get(0).getContext("2d");
                 new Chart(ctx).Line(wrapped[0], wrapped[1]);*/
                if (this.s_id.indexOf("6") == 0) {

                    $("#stockChart").attr("src", "http://image.sinajs.cn/newchart/daily/n/sh" + this.s_id + ".gif");
                } else {
                    $("#stockChart").attr("src", "http://image.sinajs.cn/newchart/daily/n/sz" + this.s_id + ".gif");

                }
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
                    ctx.analyst_data = data.analysis;
                }, 'json');
            },

            renderAnalysts: function (data) {
                var analysts = JSON.parse(data);
                var ctx = this;
                $('.di-div .QAQ').html('');
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

            analyst_data: undefined,

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
                    $('.di-div .aid' + a_id).append(injected);
                });
            },


            search: function () {
                Router.navigate('search', {trigger: true});
            },

            stock_image: function () {
                $('.inner-wrapper').append(stock_image);
            },

            hide_stock_image: function () {
                $('.stock-image-div').remove();
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

            //0 for horizontal, 1 for vertical, -1 for unset
            direction: -1,

            scrollEnd: function (ev) {
                ev.stopPropagation();
                var touch = ev.originalEvent.changedTouches[0];
                //console.log(ev);
                //click not available, use scrollEnd
                if (touch.screenX == this.startX && touch.screenY == this.startY) {
                    console.log(touch.screenY);
                    if (touch.screenY < 375) {
                        this.sort_stocks(ev.target.innerText);
                    }
                    else {
                        this.stock_image();
                    }
                }
                this.direction = -1;
            },

            scroll: function (ev) {

                var x_change = this.startX - ev.originalEvent.touches[0].screenX;
                var y_change = this.startY - ev.originalEvent.touches[0].screenY;
                if (this.direction == -1) {
                    if (x_change > y_change * 5) {
                        this.direction = 0;
                    } else {
                        this.direction = 1;
                    }
                }
                var ctx = this;
                var objs = ctx.$('.scroll');
                if (this.direction == 0) {
                    _.each(objs, function (obj) {
                        $(obj).scrollLeft(x_change / screenRatio + ctx.leftX);
                    });
                }
                if (this.direction == 1) {
                    $('.QAQ').scrollTop(y_change / screenRatio + ctx.topY);
                }
            },

            sort_stocks: function () {
                var sortFromLargeToSmall = false;
                return function (attribute) {
                    console.log('sort: ' + attribute);
                    var array = JSON.parse(this.analyst_data);
                    if (this.analyst_data) {
                        sortFromLargeToSmall = !sortFromLargeToSmall;
                        if (attribute == 'stability' || attribute == '稳定性') {
                            array.sort(function (a, b) {
                                if (a.stability < b.stability == sortFromLargeToSmall) {
                                    return 1;
                                }
                                return -1;
                            });
                        }
                        if (attribute == 'speed' || attribute == '速度') {
                            array.sort(function (a, b) {
                                if (a.speed < b.speed == sortFromLargeToSmall) {
                                    return 1;
                                }
                                return -1;
                            });
                        }
                        if (attribute == 'accuracy' || attribute == '准确性') {
                            array.sort(function (a, b) {
                                if (a.accuracy < b.accuracy == sortFromLargeToSmall) {
                                    return 1;
                                }
                                return -1;
                            });
                        }
                        if (attribute == 'average_drift_rate' || attribute == '偏移度') {
                            array.sort(function (a, b) {
                                if (a.drift_rate < b.drift_rate == sortFromLargeToSmall) {
                                    return 1;
                                }
                                return -1;
                            });
                        }

                        if (attribute == 'researchCount' || attribute == '研报数') {
                            //array.sort(function (a, b) {
                            //    if (a.drift_rate < b.drift_rate == sortFromLargeToSmall){
                            //        return 1;
                            //    }
                            //    return -1;
                            //});
                        }

                        if (attribute == '...' || attribute == '目标价') {
                            array.sort(function (a, b) {
                                if (a.target_price < b.target_price == sortFromLargeToSmall) {
                                    return 1;
                                }
                                return -1;
                            });
                        }
                        if (attribute == '...' || attribute == '收益率') {
                            array.sort(function (a, b) {
                                if (a.yield_rate < b.yield_rate == sortFromLargeToSmall) {
                                    return 1;
                                }
                                return -1;
                            });
                        }
                        //console.log(array);
                        //console.log(this.analyst_data);
                        this.analyst_data = JSON.stringify(array);
                        this.renderAnalysts(this.analyst_data);
                    }
                }
            }()

        });

        return StockView;

    })
;