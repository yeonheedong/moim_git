var util = require('../utils/utils')

var SchemaObj = {};

SchemaObj.createSchema = function(mongoose) {
	
	// 스키마 정의
	var PostSchema = mongoose.Schema({
		title: {type: String, default:''}
	    , introduction: {type: String, 'default':''}
	    , keyword: {type: String, default:''}
        , number : [{
            min_num: {type:Number, dafault:0},
            max_num: {type:Number, dafalut:0}
        }]
        , location: {type: String, default:''}
        , recruitment: [{
          start: {type: Date, 'default': Date.now}
	    , finish: {type: Date, 'default': Date.now}
        }]
        , duration: [{
          start_at: {type: Date, 'default': Date.now}
	    , finish_at: {type: Date, 'default': Date.now}
        , image: {}
        }]
	});
    	
	
	// 스키마에 인스턴스 메소드 추가
	PostSchema.methods = {
		savePost: function(callback) {		// 글 저장
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		},
		addComment: function(user, comment, callback) {		// 댓글 추가
			this.comment.push({
				contents: comment.contents,
				writer: user._id
			});
			
			this.save(callback);
		},
		removeComment: function(id, callback) {		// 댓글 삭제
			var index = utils.indexOf(this.comments, {id: id});
			if (~index) {
				this.comments.splice(index, 1);
			} else {
				return callback('ID [' + id + '] 를 가진 댓글 객체를 찾을 수 없습니다.');
			}
			
			this.save(callback);
		}
	}
	
	PostSchema.statics = {
		// ID로 글 찾기
		load: function(id, callback) {
			this.findOne({_id: id})
				.populate('writer', 'name provider email')
				.populate('comments.writer')
				.exec(callback);
		},
		list: function(options, callback) {
			var criteria = options.criteria || {};
			
			this.find(criteria)
				.populate('writer', 'name provider email')
				.sort({'created_at': -1})
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		}
	}
	
	console.log('PostSchema 정의함.');

	return PostSchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = SchemaObj;


