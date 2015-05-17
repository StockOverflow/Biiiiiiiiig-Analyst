/**
 * Created by lifengshuang on 5/5/15.
 */

define(['text!html/analyst/index_analyst.html', 'text!html/analyst/css_analyst.html',
        'text!html/analyst/tab1_analyst.html', 'text!html/analyst/tab2_analyst.html',
        'text!html/analyst/tab3_analyst.html', 'text!html/analyst/info_analyst.html',
        'app/chartwrapper',
        'text!html/analyst/analyst_stock_item.html', 'text!html/analyst/analyst_research_item.html'
        , 'text!html/analyst/analyst_to_stock.html'],
    function (index, css, tab1, tab2, tab3, info, chartwrapper, analyst_item, research_item, analyst_to_stock_item) {


        var AnalystView = Backbone.View.extend({

                a_id: '1',
                el: index,

                events: {
                    'click .rt-tab': 'tabOne',
                    'click .di-tab': 'tabTwo',
                    'click .ci-tab': 'tabThree',
                    'click .nav-bar>.left': 'back',
                    'click .nav-bar>.right': 'search',
                    'touchstart .scroll': 'scrollStart',
                    'touchend .scroll': 'scrollEnd'
                },


                initialize: function (a_id) {
                    this.a_id = a_id;
                    this.$('.content').append(tab1).append(tab2).append(tab3);
                    loadCSS(css);
                    setTimeout(this.getAnalystData(this.a_id), 0);
                    setTimeout(this.getAnalystStockData(this.a_id), 1000);
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
                    history.back();
//                Router.popHistory();
                },


                getAnalystData: function (a_id) {
                    var base_url = 'http://stock.whytouch.com/analyzerpages/get_analyzer_info.php?a_id=' + a_id;
                    var ctx = this;
                    $.get(base_url, function (data) {
                        ctx.renderAnalystInfo(data.basic_info);
                        ctx.renderAnalystChart(data.attribute)
                    }, 'json');
                },

                renderAnalystInfo: function (data) {
                    var basic_info = JSON.parse(data);
                    var template = HandleBars.compile(info);
                    var injected = template({
                            'a_institution': basic_info.a_institution,
                            'a_position': basic_info.a_position
                        }
                    );
                    $('.homepage-item').append(injected);
                    $(".nav-bar>.title").html(basic_info.a_name);
                },

                renderAnalystChart: function (data) {
                    var attribute = JSON.parse(data);
                    var wrapped = analystRadarChart(attribute);

                    var ctx = $("#analystChart").get(0).getContext("2d");
                    new Chart(ctx).Radar(wrapped[0], wrapped[1]);
                },

                getAnalystStockData: function (a_id) {
                    var base_url = 'http://stock.whytouch.com/analyzerpages/get_analyzer_stock.php?a_id=' + a_id;
                    var ctx = this;
                    $.get(base_url, function (data) {
                        ctx.renderAnalystStock(data.analyzer_stock);
                    }, 'json');
                },

                renderAnalystStock: function (data) {
                    var analyzer_stock = JSON.parse(data);
                    var template = HandleBars.compile(analyst_item);
                    var ctx = this;
                    _.each(analyzer_stock, function (item) {
                        var injected = template({
                                'date': item.date,
                                's_name': item.s_name,
                                'target_price': item.target_price,
                                'yield_rate': percentageToString(item.yield_rate),
                                'drift_rate': percentageToString(item.drift_rate),
                                'accuracy': item.accuracy,
                                'speed': item.speed,
                                'stability': item.stability,
                                's_id': 'sid' + item.s_id
                            }
                        );
                        $('.di-div').append(injected);
                        ctx.getAnalystToStockData(item.s_id, ctx.a_id);
                        $('.sid' + item.s_id).siblings().children('.col5').click(function () {
                            var obj = $('.sid' + item.s_id);
                            var dis = obj.css('display');
                            if (dis == 'none') {
                                obj.css('display', 'block');
                            } else {
                                obj.css('display', 'none');
                            }
                        });

                        $('.sid' + item.s_id).siblings().children('.col1').click(function () {
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
                }
                ,

                renderAnalystToStock: function (s_id, data) {
                    var researches = JSON.parse(data);
                    _.each(researches, function (item) {
                        var title = item.title, date = item.date;

                        var template = HandleBars.compile(analyst_to_stock_item);
                        var injected = template({
                                'content': title + "-" + date
                            }
                        );
                        $('.sid' + s_id).append(injected);
                    });
                }
                ,

                getResearchData: function (a_id) {
                    var base_url = 'http://stock.whytouch.com/analyzerpages/get_researches.php?a_id=' + a_id;
                    var ctx = this;
                    $.get(base_url, function (data) {
                        ctx.renderResearches(data.researches);
                    }, 'json');
                }
                ,

                renderResearches: function (data) {
                    var researches = JSON.parse(data);
                    _.each(researches, function (item) {
                        var title = item.title, date = item.date, s_name = item.s_name;

                        var template = HandleBars.compile(research_item);
                        var injected = template({
                                'title': title,
                                'date': date,
                                's_name': s_name
                            }
                        );
                        $('.ci-div').append(injected);
                    });
                }
                ,

                search: function () {
                    Router.navigate('search', {trigger: true});
                }
                ,

                scrollStart: function (ev) {
                    setInterval(function () {
                        var ctx = this;
                        var value = ctx.$(ev.currentTarget).scrollLeft();
                        var objs = ctx.$('.scroll');
                        _.each(objs, function (obj) {
                            $(obj).scrollLeft(value);
                        });
                    }, 5);
                },

                scrollEnd: function () {
                    window.clearInterval(0);
                }

            })
            ;

        return AnalystView;

    }
)
;