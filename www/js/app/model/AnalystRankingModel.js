/**
 * Created by Tong on 05.13.
 */
define(function () {
    var AnalystRankingModel = Backbone.Model.extend({
        defaults: {
            'a_id': '1',
            'a_name': '胡子欣',
            'a_institution': '东海证券',
            'a_position': '分析员',
            'average_yield_rate': '20%',
            'average_drift_rate': '20%',
            'speed': '20%',
            'stability': '20%',
            'accuracy': '20%',
            'portrait': '0'
        }
    });
    return AnalystRankingModel;
});
