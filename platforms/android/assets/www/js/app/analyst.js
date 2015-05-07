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
                'click #rt-tab': 'tabOne',
                'click #di-tab': 'tabTwo',
                'click #ci-tab': 'tabThree',
                'click .left': 'back',
                'click .analyst-di-stock': 'enter_stock'
            },

            initialize: function () {
                console.log('analystView initialize');
                loadCSS(css);
                this.tabTwo();
                this.render();
            },

            render: function () {
                this.$('.homepage-item').append(info);
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


            enter_stock: function () {
                Router.navigate('stock/1', {trigger: true});
            }
        });

        return AnalystView;

    }
);