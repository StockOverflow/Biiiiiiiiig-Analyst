/**
 * Created by lifengshuang on 5/5/15.
 */

define(['text!html/analyst/index_analyst.html', 'text!html/analyst/css_analyst.html',
        'text!html/analyst/tab1_analyst.html', 'text!html/analyst/tab2_analyst.html',
        'text!html/analyst/tab3_analyst.html', 'text!html/analyst/info_analyst.html',
        'app/chartwrapper', 'text!html/analyst/analyst_stock_item.html', 'text!html/analyst/analyst_research_item.html',
        'text!html/analyst/analyst_to_stock.html', 'text!html/analyst/radar_item_analyst.html',
        'text!html/analyst/stock_image.html'],
    function (index, css, tab1, tab2, tab3, info, chartwrapper, analyst_item, research_item,
              analyst_to_stock_item, radar_item, stock_image) {


        var AnalystView = Backbone.View.extend({

            a_id: '1',
            el: index,
            graph: false,
            events: {
                'click .rt-tab': 'tabOne',
                'click .di-tab': 'tabTwo',
                'click .ci-tab': 'tabThree',
                'click .nav-bar>.left': 'back',
                'click .nav-bar>.left-second': 'home',
                'click .nav-bar>.nav-search': 'search',
                'click .nav-bar>.right': 'search',
                'touchstart .scroll': 'scrollStart',
                'touchend .scroll': 'scrollEnd',
                'touchmove .scroll': 'scroll',
                'click .analyst-tofollow': 'toFollow',
                'click .followed-stocks': 'tabTwo',
                'click .stock-image-shadow': 'hide_stock_image',
                'click .radar-item': 'radar_item_click'
            },

            initialize: function (a_id) {
                this.a_id = a_id;
                this.$('.content').append(tab1).append(tab2).append(tab3);

                setTimeout(this.getAnalystData(this.a_id), 0);
                setTimeout(this.getAnalystStockData(this.a_id), 0);
                setTimeout(this.getResearchData(this.a_id), 1000);
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
                    if (User.hasFollowAnalyst(this.a_id)) {
                        User.unfollowAnalyst(this.a_id);
                        $('.analyst-tofollow')[0].src = 'img/tounfollow.png';
                    }
                    else {
                        User.followAnalyst(this.a_id);
                        $('.analyst-tofollow')[0].src = 'img/tofollow.png';
                    }
                }
            },


            getAnalystData: function (a_id) {
                var base_url = 'http://stock.whytouch.com/analyzerpages/get_analyzer_info.php?a_id=' + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderAnalystInfo(data.basic_info);
                    ctx.renderAnalystChart(data.attribute);
                    ctx.renderFollowedStock();
                }, 'json');
            },

            renderFollowedStock: function () {
                //TODO: display real data
                $('.followed-stocks').html("近期关注个股：平安银行，招商银行...");
            },

            renderAnalystInfo: function (data) {
                var basic_info = JSON.parse(data);
                var template = HandleBars.compile(info);
                var injected = template({
                        'a_name': basic_info.a_name,
                        'a_institution': basic_info.a_institution,
                        'a_position': basic_info.a_position
                    }
                );
                $('.homepage-item').append(injected);
                //$(".nav-bar>.title").html(basic_info.a_name);
                var ctx = this;
                setTimeout(function () {
                    if (User.hasSignin) {
                        if (User.hasFollowAnalyst(ctx.a_id)) {
                            $('.analyst-tofollow')[0].src = 'img/tofollow.png';
                        }
                        else {
                            $('.analyst-tofollow')[0].src = 'img/tounfollow.png';
                        }
                    }
                }, 250);
            },

            renderAnalystChart: function (data) {
                //chart
                var attribute = JSON.parse(data);
                var wrapped = analystRadarChart(attribute);
                var ctx = $("#analystChart").get(0).getContext("2d");
                new Chart(ctx).Radar(wrapped[0], wrapped[1]);


                //five attributes
                var template = HandleBars.compile(radar_item);
                var parent_div = $('.rt-div');

                var stability = template({
                    class: 'stability',
                    attribute: '稳定性',
                    attribute_value: toPercentage(attribute.stability),
                    rank_value: attribute.stability_rank
                });
                var speed = template({
                    class: 'speed',
                    attribute: '速度',
                    attribute_value: toPercentage(attribute.speed),
                    rank_value: attribute.speed_rank
                });
                var accuracy = template({
                    class: 'accuracy',
                    attribute: '准确性',
                    attribute_value: toPercentage(attribute.accuracy),
                    rank_value: attribute.accuracy_rank
                });
                var overestimation = template({
                    class: 'average_drift_rate',
                    attribute: '偏移度',
                    attribute_value: toPercentage(attribute.average_drift_rate),
                    rank_value: attribute.average_drift_rate_rank
                });
                var underestimation = template({
                    class: 'researchCount',
                    attribute: '研报数',
                    attribute_value: attribute.researchCount,
                    rank_value: attribute.researchCount_rank
                });

                parent_div.append(stability);
                parent_div.append(speed);
                parent_div.append(accuracy);
                parent_div.append(overestimation);
                parent_div.append(underestimation);

                function toPercentage(num) {
                    var result = num.toString().substr(num.toString().indexOf('.') + 1, 2) + '%';
                    if (result.charAt(0) == '0' && result.charAt(1) != '%') {
                        result = result.substr(1);
                    }
                    if (num < 0) {
                        return '-' + result;
                    }
                    return result;
                }
            },

            analyst_data: undefined,

            getAnalystStockData: function (a_id) {
                var base_url = 'http://stock.whytouch.com/analyzerpages/get_analyzer_stock.php?a_id=' + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.stock_data = data.analyzer_stock;
                    ctx.renderAnalystStock(data.analyzer_stock);
                }, 'json');
            },

            renderAnalystStock: function (data) {
                var analyzer_stock = JSON.parse(data);
                var template = HandleBars.compile(analyst_item);
                var ctx = this;
                $('.di-div .QAQ').html('');
                _.each(analyzer_stock, function (item) {
                    var injected = template({
                            'date': item.date,
                            's_name': item.s_name,
                            'target_price': item.target_price,
                            'yield_rate': percentageToString(item.yield_rate),
                            'drift_rate': percentageToString(item.drift_rate),
                            'accuracy': percentageToString(item.accuracy),
                            'speed': percentageToString(item.speed),
                            'stability': percentageToString(item.stability),
                            's_id': 'sid' + item.s_id
                        }
                    );
                    $('.di-div .QAQ').append(injected);
                    ctx.getAnalystToStockData(item.s_id, ctx.a_id);
                    var target = $('.di-div .sid' + item.s_id).siblings();
                    target.children('.col5').click(function () {
                        var obj = $('.sid' + item.s_id);
                        var dis = obj.css('display');
                        if (dis == 'none') {
                            target.children('.col5').children('.analyst-di-fold').attr('src', 'img/unfold.png');
                            obj.css('display', 'block');
                        } else {
                            target.children('.col5').children('.analyst-di-fold').attr('src', 'img/fold.png');
                            obj.css('display', 'none');
                        }
                    });

                    $('.di-div .sid' + item.s_id).siblings().children('.col1').click(function () {
                        Router.navigate('stock/' + item.s_id, {trigger: true});
                    });
                });

            },

            getAnalystToStockData: function (s_id, a_id) {
                var base_url = 'http://stock.whytouch.com/stockpages/get_researches_by_analyzer.php?s_id=' + s_id + "&a_id=" + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    ctx.renderAnalystToStock(s_id, data.researches_by_analyzer);
                }, 'json');
            },

            renderAnalystToStock: function (s_id, data) {
                var researches = JSON.parse(data);
                _.each(researches, function (item) {
                    var title = item.title, date = item.date;

                    var template = HandleBars.compile(analyst_to_stock_item);
                    var injected = template({
                            'content': title + "-" + date
                        }
                    );
                    $('.di-div .sid' + s_id).append(injected);
                });
            },

            getResearchData: function (a_id) {
                var base_url = 'http://stock.whytouch.com/analyzerpages/get_researches.php?a_id=' + a_id;
                var ctx = this;
                $.get(base_url, function (data) {
                    if (!ctx.graph) {
                        ctx.renderResearches(data.researches);
                        ctx.graph = true;
                    }
                }, 'json');
            },

            renderResearches: function (data) {
                var researches = JSON.parse(data);
                _.each(researches, function (item) {
                    var template = HandleBars.compile(research_item);
                    var injected = template({
                            'title': item.title,
                            'date': item.date,
                            's_name': item.s_name,
                            's_id': 'sid' + item.s_id
                        }
                    );
                    $('.ci-div .QAQ').append(injected);
                    $('.ci-div .sid' + item.s_id).children('.col6').click(function () {
                        Router.navigate('stock/' + item.s_id, {trigger: true});
                    });
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
            //0 for horizontal, 1 for vertical, -1 for unset
            direction: -1,


            scrollEnd: function (ev) {
                ev.stopPropagation();
                var touch = ev.originalEvent.changedTouches[0];
                //console.log(ev);
                //click not available, use scrollEnd
                if (touch.screenX == this.startX && touch.screenY == this.startY) {
                    console.log(touch.screenY);
                    if (touch.screenY < 390) {
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
                    if (x_change > y_change*5) {
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

            stock_image: function () {
                $('.inner-wrapper').append(stock_image);
            },

            hide_stock_image: function () {
                $('.stock-image-div').remove();
            },

            sort_stocks: function () {
                var sortFromLargeToSmall = false;
                return function (attribute) {
                    console.log('sort: ' + attribute);
                    var array = JSON.parse(this.stock_data);
                    if (this.stock_data) {
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
                        this.stock_data = JSON.stringify(array);
                        this.renderAnalystStock(this.stock_data);
                    }
                }
            }(),

            radar_item_click: function (event) {
                console.log(event);
                var className = event.currentTarget.classList[2]; //dangerous! but save time...
                this.tabTwo();
                this.sort_stocks(className);
            }

        });

        return AnalystView;

    }
);