var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var HistorySchema = mongoose.Schema({
	   user_id: {type: String, 'default':''}
	    , history: {type: String, default:''}
	});


    console.log('MoimSchema 정의함.');

    return HistorySchema;

}


module.exports = Schema;
