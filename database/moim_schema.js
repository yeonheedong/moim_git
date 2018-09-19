var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var MoimSchema = mongoose.Schema({
		moim_id: {type: String, default:''}
	    , user_id: {type: String, 'default':''}
	    , member_type: {type: String, default:''}
        , payment: {type:Number, dafault:0}
        , event_refund: {type:Number, dafalut:0}
        , total_refund: {type:Number, default:0}
        , event_date: {type: Date, 'default': Date.now}
        , state: {type: String, 'default': ''}
        , createdAt:{type:Date, 'default':Date.now}
        , updatedAt: {type:Date, 'default':Date.now}
	});
    
    
    console.log('MoimSchema 정의함.');

    return MoimSchema;
    
}


module.exports = Schema;

