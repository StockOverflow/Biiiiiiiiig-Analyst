/**
 * Created by lifengshuang on 4/29/15.
 */

//alert("hello!");
console.log('app.js loaded');

requirejs.config({
    baseUrl: 'js/lib',

    path: {
        app: '../app',
        jquery: 'jquery-2.1.3.min',
        backbone: 'backbone-min',
        handlebars: 'handlebars-v3.0.1'
    }
});
requirejs([path.jquery, path.handlebars], function($, HandleBars){});
define(['jquery'], function($){
    $(function(){
        alert(123);
    })
});


