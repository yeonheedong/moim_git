var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var MoimListSchema = mongoose.Schema({
		title: {type: String, default:''}
        , manager: {type: String, 'default':''}
	    , introduction: {type: String, 'default':''}
	    , keyword: {type: String, default:''}
        , min_num: {type:Number, default:0}
        , max_num: {type:Number, default:0}
        , num: {type:Number, default:0}
        , count: {type:Number, default:0}
        , location: {type: String, default:''}
        , start: {type: Date, 'default': Date.now}
	    , finish: {type: Date, 'default': Date.now}
        , start_at: {type: Date, 'default': Date.now}
	    , finish_at: {type: Date, 'default': Date.now}
        , createdAt:{type:Date, 'default':Date.now}
        , updatedAt: {type:Date, 'default':Date.now}
        , state: {type:String, 'default':'waiting'}
	, fileName: {type : String, 'default':'default.png'}
        , path:  {type: String}
	});
    
    
    console.log('MoimListSchema 정의함.');

    return MoimListSchema;
    
}


module.exports = Schema;



