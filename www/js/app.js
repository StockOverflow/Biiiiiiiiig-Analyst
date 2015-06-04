/**
 * Created by lifengshuang on 4/29/15.
 */


require(['./config'], function () {

    require(['jquery', 'backbone', 'handlebars', 'chart', 'fastclick', 'jui'], function ($, Backbone, HandleBars, Chart, FastClick, JUI) {
        window.$ = $;
        window.Backbone = Backbone;
        window.HandleBars = HandleBars;
        window.Chart = Chart;
        window.FastClick = FastClick;
        window.JUI = JUI;

        require(['app/router'], function () {
            require(['text!html/css.html'], function (css) {
                $('head').append(css);
            });
        });

        $(function () {
            require(['app/zoom', 'app/swipe', 'app/slider'], function (zoom) {
                zoom();
            });

            FastClick.attach(document.body);
        });


        window.loadCSS = function (css) {
            //deprecated
        };

        window.User = {
            hasSignin: false,
            name: '',
            phone: 1,

            saveUser: function () {
                var ctx = this;
                var info = {
                    hasSignin: ctx.hasSignin,
                    name: ctx.name,
                    phone: ctx.phone
                };
                localStorage.user = JSON.stringify(info);
            },

            loadUser: function () {
                if (localStorage.user){
                    var info = JSON.parse(localStorage.user);
                    if (info.hasSignin){
                        User.hasSignin = true;
                        User.name = info.name;
                        User.phone = info.phone;
                    }
                }
            },

            updateFollowedInfo: function () {
                if (User.hasSignin) {
                    window.FollowedAnalysts = [];
                    window.FollowedStocks = [];
                    $.get('http://stock.whytouch.com/users/get_following_analyzers.php?u_id=' + User.phone, function (data) {
                        if (data.code == 200) {

                            var list = JSON.parse(data.following_analyzers);
                            _.each(list, function (item) {
                                FollowedAnalysts.push(item.a_id);
                            });
                        }
//                        console.log(FollowedAnalysts);
                    }, 'json');
                    $.get('http://stock.whytouch.com/users/get_following_stocks.php?u_id=' + User.phone, function (data) {
                        if (data.code == 200) {

                            var list = JSON.parse(data.following_stocks);
                            _.each(list, function (item) {
                                FollowedStocks.push(item.s_id);
                            });
                        }
                    }, 'json');
                }
            },
            followStock: function (s_id) {
                if(User.hasSignin) {
                    $.get('http://stock.whytouch.com/users/follow_stock.php?u_id=' + User.phone + '&s_id=' + s_id, function (data) {
                        if (data.code == 200) {
                            User.updateFollowedInfo();
                        }
                    }, 'json');
                }
            },
            unfollowStock: function (s_id) {
                if(User.hasSignin) {
                    $.get('http://stock.whytouch.com/users/unfollow_stock.php?u_id=' + User.phone + '&s_id=' + s_id, function (data) {
                        if (data.code == 200) {
                            User.updateFollowedInfo();
                        }
                    }, 'json');
                }
            },
            hasFollowStock: function (s_id) {
                if (User.hasSignin) {
                    if (_.indexOf(FollowedStocks, s_id.toString()) != -1) {
                        return true;
                    }
                }
                return false;
            },
            followAnalyst: function (a_id) {
                if(User.hasSignin) {
                    $.get('http://stock.whytouch.com/users/follow_analyzer.php?u_id=' + User.phone + '&a_id=' + a_id, function (data) {
                        if (data.code == 200) {
                            User.updateFollowedInfo();
                        }
                    }, 'json');
                }
            },
            unfollowAnalyst: function (a_id) {
                if(User.hasSignin) {
                    $.get('http://stock.whytouch.com/users/unfollow_analyzer.php?u_id=' + User.phone + '&a_id=' + a_id, function (data) {
                        if (data.code == 200) {
                            User.updateFollowedInfo();
                        }
                    }, 'json');
                }
            },
            hasFollowAnalyst: function (a_id) {
                if (User.hasSignin && FollowedAnalysts) {
                    if (_.indexOf(FollowedAnalysts, a_id.toString()) != -1) {
                        return true;
                    }
                }
                return false;
            }
        };
        User.loadUser();
        User.updateFollowedInfo();


    });

});