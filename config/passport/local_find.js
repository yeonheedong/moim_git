
var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
		usernameField : 'email',
		passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, email, done) { 
		console.log('passport의 local-find 호출됨 : ' + email);
		
		var database = req.app.get('database');
	    database.UserModel.findOne({ 'email' :  email }, function(err, user) {
	    	if (err) { return done(err); }

	    	// 등록된 사용자가 없는 경우
	    	if (!user) {
	    		console.log('계정이 일치하지 않음.');
	    		return done(null, false, req.flash('findMessage', '등록된 계정이 없습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
	    	}
	    	
			// 정상인 경우
			console.log('계정이 일치함.');
			return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
	    });

	});

