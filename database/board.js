var mongoose = require('mongoose');

var Schema = {};


Schema.createSchema = function(mongoose) {


var BoardSchema = mongoose.Schema({
		moim_id: {type: String, default:''}
	    , writer: {type: String, 'default':''}
	    , title: {type: String, default:''}
        , content: {type:String, dafault:''}
        , comments: [{
            writer: {type: String, 'default':''}
            , contents: {type:String, dafault:''}
            , comment_date: {type: Date, 'default': Date.now}
        }]
        , count: {type:Number, default:0}
        , date: {type: Date, 'default': Date.now}
        , updatedAt: {type:Date, 'default':Date.now}
	});
    
    
    console.log('BoardSchema 정의함.');

    return BoardSchema;
    
}


module.exports = Schema;

