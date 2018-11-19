var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var AttendanceSchema = mongoose.Schema({
		moim_id: {type: String, default:''}
        , date: {type:String, dafault:''}//type: date로 해서 '미정'으로 초기화할때 에러났던거
        , user_id: {type: String, default:''}
        , total_num: {type:Number, default:0}
        , num: {type:Number, default:0}
        , state: {type: String, default:'-'}
	});
    
    
    console.log('AttendanceSchema 정의함.');

    return AttendanceSchema;
    
}


module.exports = Schema;



