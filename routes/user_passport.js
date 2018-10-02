/* userPassport, moimList merge ver. + header */

module.exports = function(router, passport) {
    console.log('user_passport 호출됨.');
    console.log('moimlist 호출됨');


    // 홈 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');
        
        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user의 정보');
        console.dir(req.user);
        
        var database = req.app.get('database'); 
        
        console.log("모든 모임 정보 출력");
        
        var searchMoim = new database.Moim();
        
        database.Moim.find({}).sort({createdAt:-1}).exec(function(err, searchMoim){
            if(err) throw err;
            // 인증 안된 경우
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.render('index.ejs', {login_success:false, Moim:searchMoim});
            } else {
                console.log('사용자 인증된 상태임.');
                res.render('index.ejs', {login_success:true, Moim:searchMoim});
            }
        });
        
    });    
      

    /* 네비게이터 라우팅... 어쩌지 */
     router.route('/login_header').get(function(req, res) {
        console.log('/login_header 패스 요청됨.');

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/login_header 패스 요청됨.');
            console.log('req.user의 정보');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('login_header.ejs', {user: req.user[0]._doc});
            } else {
                res.render('login_header.ejs', {user: req.user});
            }
        }
    });
    
    
  
    
	 
    // 로그인 후 홈 화면
    router.route('/home').get(function(req, res) {
        console.log('/home 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user 객체의 값')
            console.dir(req.user);
            
            var database = req.app.get('database'); 
        
            console.log("모든 모임 정보 출력");

            var searchMoim = new database.Moim();

            database.Moim.find({}).sort({createdAt:-1}).exec(function(err, searchMoim){
                if(err) throw err;   
                if (Array.isArray(req.user)) {
                res.render('home.ejs', {user: req.user[0]._doc, Moim:searchMoim});
                } else {
                    res.render('home.ejs', {user: req.user, Moim:searchMoim});
                }
                });  
        }       
    });
    
    // 프로필 화면( 헤더 파일 있음 )
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

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/mymoim 패스 요청됨.');
            console.log('req.user 객체의 값');
            console.dir(req.user);
            
            var database = req.app.get('database'); 
        
            var userid = req.user._id;

            console.log(userid+"의 모임 정보 출력");

            var searchMoim = new database.Moim();

            database.Moim.find({user_id:userid}).sort({createdAt:-1}).exec(function(err, searchMoim){
                if(err) throw err;
                if (Array.isArray(req.user)) {
                    res.render('mymoim.ejs', {user: req.user[0]._doc, Moim:searchMoim});
                } else {
                    res.render('mymoim.ejs', {user: req.user, Moim:searchMoim});
                }                        
            });
        }
    });
    
    // 모임 만들기 안내
    router.route('/new/new_info').get(function(req, res) {
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
                res.render('new/new_info.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new/new_info.ejs', {user: req.user});
            }
        }
    });
    
    // 모임 만들기 (get)
    router.route('/new/new_moim').get(function(req, res) {
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
            console.log('/new_moim 패스 요청됨.');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new/new_moim.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new/new_moim.ejs', {user: req.user});
            }
        }
    });

    
    // 모임 만들기 (post)
    router.route('/new/new_moim').post(function(req, res) {
        console.log('new_moim 패스 요청됨.');
        
        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/new_moim 패스 요청됨.');
            console.dir(req.user);
            
            var title = req.body.title;
            var introduction = req.body.introduction;
            var keyword = req.body.keyword;
            var min_num = req.body.min_num;
            var max_num = req.body.max_num;
            var location = req.body.location;
            var start = req.body.start;
            var finish = req.body.finish;
            var start_at = req.body.start_at;
            var finish_at = req.body.finishat;

            var database = req.app.get('database');
            var newMoimList = new database.MoimList({"title":title, "manager":req.user._id, "introduction":introduction, "keyword":keyword, "min_num":min_num, "max_num":max_num, "location":location, "start":start, "finish":finish, "start_at":start_at, "finish_at":finish_at, count:1});

            newMoimList.save(function(err) {
                  if (err) {
                     throw err;
                  }
                  console.log("모임리스트 데이터 추가함.");
            });

            var moimId = newMoimList._id;

            var newMoim = new database.Moim({
              moim_id:moimId 
            , user_id: req.user._id 
            , member_type: 'manager'
            , payment: 0
            , event_refund: 0
            , total_refund: 0
            , state: 'waiting'});
        
            newMoim.save(function(err) {
                  if (err) {
                     throw err;
                  }
                  console.log("모임 데이터 추가함.");
            });

            if (Array.isArray(req.user)) {
                res.render('new/new_complete.ejs', {user: req.user[0]._doc, moim:newMoimList});
            } else {
                res.render('new/new_complete.ejs', {user: req.user, moim:newMoimList});
            }
        }
        
    });
    
    
    // 모임 만들기 완료
    router.route('/new/new_complete').get(function(req, res) {
        console.log('/new_complete 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user 객체의 값');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('new/new_complete.ejs', {user: req.user[0]._doc});
            } else {
                res.render('new/new_complete.ejs', {user: req.user});
            }
        }
    });  
    
    // 모임 상세보기
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
            
            var moimId = req.param('id');
            console.log(moimId+"의 모임 정보 출력");

            var database = req.app.get('database'); 
            var searchMoim = new database.MoimList();
            var moim = new database.Moim();
            
            database.MoimList.findOne({_id:moimId}, function(err, searchMoim){
            if(err) throw err;
            if (Array.isArray(req.user)) {
                res.render('moimDetail.ejs', {user: req.user[0]._doc, Moim:searchMoim, id:moimId});
            } else {
                res.render('moimDetail.ejs', {user: req.user, Moim:searchMoim, id:moimId});
            }  
            });  
        }
    });
    
    // 참여하기 (get)
    router.route('/moimJoin').get(function(req, res) {
        console.log('/moimJoin 패스 요청됨.');

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user의 정보');
            console.dir(req.user);
            
            var moimId = req.param('id');
            console.log(moimId+"모임 참여 화면");
            
            var database = req.app.get('database'); 
        
            database.MoimList.findOne({_id: moimId}, function(err, moim){
                if(err) throw err;
                moim.count += 1;

                moim.save(function(err){
                    if(err) throw err;
                });
            });

            var newMoim = new database.Moim();

            var newMoim = new database.Moim({
              moim_id:moimId 
            , user_id: req.user._id 
            , member_type: 'manager'
            , payment: 0
            , event_refund: 0
            , total_refund: 0
            , state: 'waiting'});

            newMoim.save(function(err) {
                  if (err) {
                     throw err;
                  }
		          console.log(moimId+"모임 사용자 추가");
            });          
            

            if (Array.isArray(req.user)) {
                res.render('moimJoin.ejs', {user: req.user[0]._doc});
            } else {
                res.render('moimJoin.ejs', {user: req.user});
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