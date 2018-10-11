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

        var searchMoim = new database.MoimList();

        database.MoimList.find({}).sort({createdAt:-1}).exec(function(err, searchMoim){
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

            var searchMoim = new database.MoimList();

            var notification = new Array();
            var user = new Date(req.user.updated_at);
            var database = req.app.get('database');
            database.db.collection("moimlists").find({'manager' : req.user._id}).toArray(function(err,moimlists){
              database.db.collection("moims").find({'member_type' : {$ne : "manager"}}).toArray(function(err,moims){
                database.db.collection("users").find().toArray(function(err,users){
                  for(var i=0;i<moimlists.length;i++){
                    for(var j=0;j<moims.length;j++){
                      if(moimlists[i]._id.toString() == moims[j].moim_id && user.getTime()<moims[j].updatedAt.getTime()){
                        for(var k=0;k<users.length;k++){
                          if(users[k]._id.toString() == moims[j].user_id)
                            notification.push(users[k].name + "님이 " + moimlists[i].title + "모임에 입장하셨습니다.");
                        }
                      }
                    }
                  }
                  if (!req.user) {
                      console.log('사용자 인증 안된 상태임.');
                      res.redirect('/');
                  }else{
                    database.MoimList.find({}).sort({createdAt:-1}).exec(function(err, searchMoim){
                      if(err) throw err;
                      if (Array.isArray(req.user)) {
                        res.render('home.ejs', {user: req.user[0]._doc, Moim:searchMoim});
                      } else {
                        res.render('home.ejs', {user: req.user, Moim:searchMoim, contents:notification, length:notification.length});
                      }
                    });
                }
              });
            });
          });
        }
      });

    // 프로필 화면( 헤더 파일 있음 )
    router.route('/profile/profile_main').get(function(req, res) {
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
                res.render('profile/profile_main.ejs', {user: req.user[0]._doc});
            } else {
                res.render('profile/profile_main.ejs', {user: req.user});
            }
        }
    });

   // 회원정보 수정 화면 (get)
    router.route('/profile_modify').get(function (req, res) {
        console.log('/profile_modify 패스 요청됨.');

        console.dir(req.user);

        if (Array.isArray(req.user)) {
            res.render('profile/profile_modify.ejs', {
                user: req.user[0]._doc
            });
        } else {
            res.render('profile/profile_modify.ejs', {
                user: req.user
            });
        }
    });

    // 토큰 화면
    router.route('/token').get(function (req, res) {
        console.log('/token 패스 요청됨.');
        var database = req.app.get('database');
        database.db.collection("historys").find({'user_id' : req.user._id.toString()}).toArray(function(err,historys){
          if (Array.isArray(req.user)) {
              res.render('profile/token.ejs', {
                  user: req.user[0]._doc
              });
          } else {
              res.render('profile/token.ejs', {
                  user: req.user,
                  history: historys
              });
          }
        });
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
            var moim = new database.MoimList();

            database.MoimList.find({}).sort({createdAt:-1}).exec(function(err, moim){
                if(err) throw err;
            });

            database.Moim.find({user_id:userid}).sort({createdAt:-1}).exec(function(err, searchMoim){
                if(err) throw err;
                if (Array.isArray(req.user)) {
                    res.render('mymoim.ejs', {user: req.user[0]._doc, Moim:searchMoim, moim:moim});
                } else {
                    res.render('mymoim.ejs', {user: req.user, Moim:searchMoim, moim:moim});
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

    // 참여하기 (post)
    router.route('/moimDetail').post(function(req, res) {
        console.log('/moimDetail 패스 요청됨.');

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user의 정보');
            console.dir(req.user);

            var moimId = req.body.moimid;
            console.log(moimId);

            console.log(moimId+"모임 참여 화면");

            var database = req.app.get('database');

            database.MoimList.findOne({_id: moimId}, function(err, moim){
                if(err) throw err;
                moim.count += 1;

                moim.save(function(err){
                    if(err) throw err;
                    console.log(moimId+"모임 count +1");
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

    // 참여하기 (get)
    router.route('/moimJoin').get(function(req, res) {
        console.log('/moimJoin 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user 객체의 값');
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('moimJoin.ejs', {user: req.user[0]._doc});
            } else {
                res.render('moimJoin.ejs', {user: req.user});
            }
        }
    });

    // 회원정보 찾기 화면 (get)
    router.route('/find/find_pw').get(function(req, res) {
        console.log('/find_pw 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find/find_pw.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {login_success:true});
        }
    });

    // 회원정보 찾기 화면 (post)
    router.route('/find/find_pw').post(function(req, res) {
        console.log('/find_pw post 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');

            var mail = req.body.email;
            console.log(mail);
            var database = req.app.get('database');

            database.UserModel.findOne({email:mail}, function(err, searchMail){
            if(err) throw err;
            if (searchMail) {
                res.render('find/find_success.ejs', {mail:searchMail});
            } else {
                res.render('find/find_fail.ejs');
            }
            });
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {login_success:true});
        }
    });

    // 회원정보 없음 화면
    router.route('/find/find_fail').get(function(req, res) {
        console.log('/find_fail 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find/find_fail.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {login_success:true});
        }
    });

    // 회원정보 있음 화면
    router.route('/find/find_success').get(function(req, res) {
        console.log('/find_success 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find/find_success.ejs', {login_success:false});
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {login_success:true});
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

    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/home',
        failureRedirect : '/login',
        failureFlash : true
    }));

    // 회원가입 인증
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : 'profile/profile_main',
        failureRedirect : '/signup',
        failureFlash : true
    }));

};
