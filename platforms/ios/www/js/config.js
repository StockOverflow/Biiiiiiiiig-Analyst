/**
 * Created by lifengshuang on 4/30/15.
 */

//alert("hello!");
console.log('app.js loaded');

requirejs.config({
    baseUrl: 'js/lib',

    paths: {
        html: '../../html',
        css: '../../css',
        app: '../app',
        jquery: 'jquery-2.1.3.min',
        backbone: 'backbone-min',
        handlebars: 'handlebars-v3.0.1',
        underscore: 'underscore-min',
        chart: 'Chart.min',
        fastclick:'fastclick'
    },

    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }

});