/**
 * Created by Tong on 05.14.
 */

define(['app/model/AnalystRankingModel'], function (AnalystRankingModel) {
    var AnalystRankingCollection = Backbone.Collection.extend({
        model: AnalystRankingModel,
        models: []


    });

    return AnalystRankingCollection;
});