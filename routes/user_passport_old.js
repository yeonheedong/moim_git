/**
 * 패스포트 라우팅 함수 정의
 *
 * @date 2016-11-10
 * @author Mike
 */

module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');

    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index.ejs', {login_success:true});
        }
    });    
      

    
     router.route('/login_header').get(function(req, res) {
        console.log('/login_header 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/login_header 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('login_header.ejs', {user: req.user[0]._doc});
            } else {
                res.render('login_header.ejs', {user: req.user});
            }
        }
    });
    
    // 로그인 화면
    router.route('/login').get(function(req, res) {
        console.log('/login 패스 요청됨.');
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });
	 
    // 회원가입 화면
    router.route('/signup').get(function(req, res) {
        console.log('/signup 패스 요청됨.');
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });
    
    // 정보찾기 화면
    router.route('/find').get(function(req, res) {
        console.log('/find 패스 요청됨.');
        res.render('find.ejs', {message: req.flash('findMessage')});
    });
    
  
    
	 
    // 로그인 후 인덱스 화면
    router.route('/home').get(function(req, res) {
        console.log('/home 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/home 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('home.ejs', {user: req.user[0]._doc});
            } else {
                res.render('home.ejs', {user: req.user});
            }
        }
    });
    
    // 프로필 화면
    router.route('/profile').get(function(req, res) {
        console.log('/profile 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/profile 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('profile.ejs', {user: req.user[0]._doc});
            } else {
                res.render('profile.ejs', {user: req.user});
            }
        }
    });
    
    // 내 모임 화면
    router.route('/mymoim').get(function(req, res) {
        console.log('/mymoim 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/mymoim 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('mymoim.ejs', {user: req.user[0]._doc});
            } else {
                res.render('mymoim.ejs', {user: req.user});
            }
        }
    });
    
    // 모임 만들기 첫 화면
    router.route('/new').get(function(req, res) {
        console.log('/new 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/new 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new.ejs', {user: req.user});
            }
        }
    });
    
    // 모임 만들기 화면
    router.route('/new_confirm').get(function(req, res) {
        console.log('/new_confirm 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/new_confirm 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new_confirm.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new_confirm.ejs', {user: req.user});
            }
        }
    });
    
    // 모임 만들기 화면
    router.route('/new_info').get(function(req, res) {
        console.log('/new_info 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/new_info 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new_info.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new_info.ejs', {user: req.user});
            }
        }
    });
    
        // 모임 만들기 첫 화면
    router.route('/new').get(function(req, res) {
        console.log('/new 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/new 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new.ejs', {user: req.user});
            }
        }
    });
    
    // 모임 만들기 화면
    router.route('/new_complete').get(function(req, res) {
        console.log('/new_complete 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/new_complete 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new_complete.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new_complete.ejs', {user: req.user});
            }
        }
    });  
    
    // 모임 만들기 화면
    router.route('/moimDetail').get(function(req, res) {
        console.log('/moimDetail 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/moimDetail 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('moimDetail.ejs', {user: req.user[0]._doc});
            } else {
                res.render('moimDetail.ejs', {user: req.user});
            }
        }
    }); 
    

    
    // 회원정보 없음 화면
    router.route('/find_fail').get(function(req, res) {
        console.log('/find_fail 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find_fail.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('index.ejs', {login_success:true});
        }
    });
    
    // 회원정보 있음 화면
    router.route('/find_success').get(function(req, res) {
        console.log('/find_success 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('find_success.ejs', {login_success:false});
        }
    });
    
	
    // 로그아웃
    router.route('/logout').get(function(req, res) {
        console.log('/logout 패스 요청됨.');
        req.logout();
        res.redirect('/');
    });


    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/home', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));

    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/profile', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
    
    // 회원정보 찾기 인증
    router.route('/find').post(passport.authenticate('local-find', {
        successRedirect : '/find_success', 
        failureRedirect : '/find_fail', 
        failureFlash : true
    }));

};
