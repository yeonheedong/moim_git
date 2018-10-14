var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var MoimTableSchema = mongoose.Schema({
        moim_id: {type: String, default:''}
        , total_num: {type:Number, default:0}
        , num: {type:Number, default:0}
        , date: {type: String, default:'미정'}
        , time: {type: String, default:'미정'}
        , location: {type: String, 'default':'미정'}
	    , course: {type: String, 'default':'없음'}
        , createdAt:{type:Date, 'default':Date.now}
        , updatedAt: {type:Date, 'default':Date.now}
	});
    
    
    console.log('MoimTableSchema 정의함.');

    return MoimTableSchema;
    
}


module.exports = Schema;



