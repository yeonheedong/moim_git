var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var AttendanceSchema = mongoose.Schema({
		moim_id: {type: String, default:''}
        , date: {type:Date, dafault:''}
        , user_id: {type: String, default:''}
        , total_num: {type:Number, default:0}
        , num: {type:Number, default:0}
        , state: {type: String, default:'-'}
	});
    
    
    console.log('AttendanceSchema 정의함.');

    return AttendanceSchema;
    
}


module.exports = Schema;



