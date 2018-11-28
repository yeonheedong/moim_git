/* userPassport, moimList merge ver. + header */
var eth = require("../dapp/eth.js");
var request = require("request");
var fs = require('fs');
var multer = require('multer');
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/upload/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }),
});
var option = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: ['image', 'page', 'result']
};
module.exports = function (router, passport) {
    console.log('user_passport 호출됨.');
    console.log('moimlist 호출됨');


    // 홈 화면
    router.route('/').get(function (req, res) {
        console.log('/ 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user의 정보');
        console.dir(req.user);

        var database = req.app.get('database');

        console.log("모든 모임 정보 출력");

        var searchMoim = new database.MoimList();

        database.MoimList.find({}).sort({
            createdAt: -1
        }).exec(function (err, searchMoim) {
            if (err) throw err;
            // 인증 안된 경우
            if (!req.user) {
                console.log('사용자 인증 안된 상태임.');
                res.render('index.ejs', {
                    login_success: false,
                    Moim: searchMoim
                });
            } else {
                console.log('사용자 인증된 상태임.');
                res.render('index.ejs', {
                    login_success: true,
                    Moim: searchMoim
                });
            }
        });

    });
    //백
    //회원가입 메일안내 페이지
    router.route('/signup_mail').get(function (req, res) {
        console.log('/signup_mail패스 요청됨.');
        req.session.destroy(function () {
            req.session;
        });
        res.render('signupMail.ejs');
    });

    //백
    //메일 인증완료 페이지
    router.route('/confirmMail').get(function (req, res) {
        console.log('/confirmMail패스 요청됨.');

        res.render('confirmMail.ejs');
    });

    /* 네비게이터 라우팅... 어쩌지 */
    router.route('/login_header').get(function (req, res) {
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
                res.render('login_header.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('login_header.ejs', {
                    user: req.user
                });
            }
        }
    });


    // 로그인 후 홈 화면
    router.route('/home').get(function (req, res) {
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
            var alarm = new Array();
            var user = new Date(req.user.updated_at);
            var database = req.app.get('database');
            database.db.collection("moimlists").find({
                'manager': req.user._id
            }).toArray(function (err, moimlists) {
                database.db.collection("moims").find({
                    'member_type': {
                        $ne: "manager"
                    }
                }).toArray(function (err, moims) {
                    database.db.collection("users").find().toArray(function (err, users) {
                        for (var i = 0; i < moimlists.length; i++) {
                            for (var j = 0; j < moims.length; j++) {
                                if (moimlists[i]._id.toString() == moims[j].moim_id && user.getTime() < moims[j].updatedAt.getTime()) {
                                    for (var k = 0; k < users.length; k++) {
                                        if (users[k]._id.toString() == moims[j].user_id) {
                                            notification.push(users[k].name + "님이 " + moimlists[i].title + "모임에 입장하셨습니다.");
                                            alarm.push(moimlists[i]._id.toString());
                                        }
                                    }
                                }
                            }
                        }
                        if (!req.user) {
                            console.log('사용자 인증 안된 상태임.');
                            res.redirect('/');
                        } else {
                            database.MoimList.find({}).sort({
                                createdAt: -1
                            }).exec(function (err, searchMoim) {
                                if (Array.isArray(req.user)) {
                                    res.render('home.ejs', {
                                        user: req.user[0]._doc,
                                        Moim: searchMoim
                                    });
                                } else {
                                    console.log(searchMoim);
                                    res.render('home.ejs', {
                                        user: req.user,
                                        Moim: searchMoim,
                                        contents: notification,
                                        alarm: alarm
                                    });
                                }
                            });
                        }
                    });
                });
            });
        }
    });

    //홈 화면에서 검색시
    router.route('/home_search').post(function (req, res) {
        console.log('/home_search 패스 요청됨.');
        var database = req.app.get('database');
        database.db.collection("moimlists")
            .find({
                $or: [{
                    'title': {
                        $regex: req.body.search
                    }
                }, {
                    'keyword': {
                        $regex: req.body.search
                    }
                }]
            })
            .toArray(function (err, searchMoim) {
                if (Array.isArray(req.user)) {
                    res.render('home_search.ejs', {
                        user: req.user[0]._doc,
                        Moim: searchMoim
                    });
                } else {
                    res.render('home_search.ejs', {
                        user: req.user,
                        Moim: searchMoim
                    });
                }
            });
    });

    // 프로필 화면( 헤더 파일 있음 )
    router.route('/profile/profile_main').get(function (req, res) {
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
                res.render('profile/profile_main.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('profile/profile_main.ejs', {
                    user: req.user
                });
            }
        }
    });
    //백선희
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

    //백
    // 토큰 화면
    router.route('/token').get(function (req, res) {
        console.log('/token 패스 요청됨.');

        var database = req.app.get('database');
        database.db.collection("historys").find({
            'user_id': req.user._id.toString()
        }).toArray(function (err, historys) {
            if (Array.isArray(req.user)) {
                res.render('profile/token.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                //eth부분 주석 풀었음
                console.log("route/token - address : " + req.user.address);
                 var tokenAmount = eth.getTokenAmount(req.user.address);
                console.log(tokenAmount + "@@@@@@@@@@@");
                 var test = new ObjectId(historys[0].user_id);
                 var tokenAmount,data2;
                 database.db.collection("users").findOne({'_id': test},function(err,data){
                   data2 = data;
                   tokenAmount = eth.getTokenAmount(data);
                 })
                 console.log('/token  = addr : ' + data2);
                res.render('profile/token.ejs', {
                    user: req.user,
                    history: historys,
                    tokenAmount: tokenAmount
                });
            }
        })
    });

    // 내 모임 화면 (get)
    router.route('/mymoim').get(function (req, res) {
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

            console.log(userid + "의 모임 정보 출력");

            var searchMoim = new database.Moim();
            var moim = new database.MoimList();

            database.MoimList.find({}).sort({
                createdAt: -1
            }).exec(function (err, moim) {
                if (err) throw err;

                database.Moim.find({
                    user_id: userid
                }).sort({
                    createdAt: -1
                }).exec(function (err, searchMoim) {
                    if (err) throw err;
                    if (Array.isArray(req.user)) {
                        res.render('mymoim.ejs', {
                            user: req.user[0]._doc,
                            Moim: searchMoim,
                            moim: moim
                        });
                    } else {
                        res.render('mymoim.ejs', {
                            user: req.user,
                            Moim: searchMoim,
                            moim: moim
                        });
                    }
                });

            });

        }
    });

    // 모임 만들기 안내
    router.route('/new/new_info').get(function (req, res) {
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
                res.render('new/new_info.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('new/new_info.ejs', {
                    user: req.user
                });
            }
        }
    });

    // 모임 만들기 (get)
    router.route('/new/new_moim').get(function (req, res) {
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
                res.render('new/new_moim.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('new/new_moim.ejs', {
                    user: req.user
                });
            }
        }
    });


    // 모임 만들기 (post)
    router.route('/new/new_moim').post(upload.single('file'), function (req, res) {
        //60토큰 차감
         eth.join(req.user.address, req.user.hashed_password, 60);
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

            var database = req.app.get('database');

            //git올리다가 이부분 빠졌는데
            //다시쓰니까 에러남ㅜㅠ어째서
            
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

            var newMoimList = new database.MoimList({
                "title": title,
                "manager": req.user._id,
                "introduction": introduction,
                "keyword": keyword,
                "min_num": min_num,
                "max_num": max_num,
                "location": location,
                "start": start,
                "finish": finish,
                "start_at": start_at,
                "finish_at": finish_at,
                count: 1
            });

            console.log(req.file);
            if (req.file) {
                newMoimList.fileName = req.file.originalname;
                newMoimList.path = req.file.path;
            }

            newMoimList.save(function (err) {
                if (err) {
                    throw err;
                }
                console.log("모임리스트 데이터 추가함.");
            });

            var moimId = newMoimList._id;

            var newMoim = new database.Moim({
                moim_id: moimId,
                user_id: req.user._id,
                member_type: 'manager',
                payment: 0,
                event_refund: 0,
                total_refund: 0,
                state: 'waiting'
            });
            newMoim.save(function (err) {
                if (err) {
                    throw err;
                }
                console.log("모임 데이터 추가함.");
            });
            
            //git 올리면서 history부분 지워져서 다시올림
            database.MoimList.findOne({
                _id: moimId
            }, function (err, moim) {
                if (err) throw err;
                var history = new database.History({
                    user_id: req.user._id,
                    history: title + "모임을 생성해서 60토큰 차감"
                    //moim.title하면 에러나서 그냥 위에 req.body로 받아온 title로
                });
                history.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("history 추가 완료");
                });
            });
            

            if (Array.isArray(req.user)) {
                res.render('new/new_complete.ejs', {
                    user: req.user[0]._doc,
                    moim: newMoimList
                });
            } else {
                res.render('new/new_complete.ejs', {
                    user: req.user,
                    moim: newMoimList
                });
            }
        }
    });


    // 모임 만들기 완료
    router.route('/new/new_complete').get(function (req, res) {
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
                res.render('new/new_complete.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('new/new_complete.ejs', {
                    user: req.user
                });
            }
        }
    });

    // 모임 약관
    router.route('/moimProvision').get(function (req, res) {
        console.log('/moimProvision 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user 객체의 값')
            console.dir(req.user);

            if (Array.isArray(req.user)) {
                res.render('moimProvision.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('moimProvision.ejs', {
                    user: req.user
                });
            }

        }
    });

    // 모임 상세보기
    router.route('/join/moimDetail').get(function (req, res) {
        console.log('/moimDetail 패스 요청됨.');

        // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
        console.log('req.user 객체의 값');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/login');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('/moimDetail 패스 요청됨.');
            console.dir(req.user);

            var moimId = req.param('id');
            console.log(moimId + "의 모임 정보 출력");

            var database = req.app.get('database');
            var searchMoim = new database.MoimList();
            var moim = new database.Moim();
            var Manager = new database.UserModel();

            database.MoimList.findOne({
                _id: moimId
            }, function (err, searchMoim) {
                if (err) throw err;

                database.Moim.findOne({
                    moim_id: moimId
                }, function (err, moim) {
                    if (err) throw err;

                    database.UserModel.find({}).sort({
                        createdAt: -1
                    }).exec(function (err, Manager) {
                        if (err) throw err;
                        console.log(Manager);
                        if (Array.isArray(req.user)) {
                            res.render('join/moimDetail.ejs', {
                                user: req.user[0]._doc,
                                Moim: searchMoim,
                                id: moimId,
                                manager: Manager,
                                moim: moim
                            });
                        } else {
                            res.render('join/moimDetail.ejs', {
                                user: req.user,
                                Moim: searchMoim,
                                id: moimId,
                                manager: Manager,
                                moim: moim
                            });
                        }
                    });

                });
            });
        }
    });

    // 참여하기 (post)
    router.route('/join/moimDetail').post(function (req, res) {
        console.log('/moimDetail 패스 요청됨.');

        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
             } else if (eth.getTokenAmount(req.user.address) <= 40) {
                 res.send('<script type="text/javascript">alert("토큰이 부족합니다.");</script>');
        } else {
            //40토큰 차감
            console.log("@@" + req.user.address);
             eth.join(req.user.address, req.user.hashed_password, 40);
            console.log('사용자 인증된 상태임.');
            console.log('req.user의 정보');
            console.dir(req.user);

            var moimId = req.body.moimid;
            console.log(moimId);

            console.log(moimId + "모임 참여 화면");

            var database = req.app.get('database');

            database.MoimList.findOne({
                _id: moimId
            }, function (err, moim) {
                if (err) throw err;
                moim.count += 1;

                moim.save(function (err) {
                    if (err) throw err;
                    console.log(moimId + "모임 count +1");
                });
                var history = new database.History({
                    user_id: req.user._id,
                    history: moim.title + "모임에 참가해서 40토큰 차감"
                });

                history.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("history 추가 완료");
                });
            });

            var newMoim = new database.Moim();

            var newMoim = new database.Moim({
                moim_id: moimId,
                user_id: req.user._id,
                member_type: 'member',
                payment: 0,
                event_refund: 0,
                total_refund: 0,
                state: 'waiting'
            });

            newMoim.save(function (err) {
                if (err) {
                    throw err;
                }
                console.log(moimId + "모임 사용자 추가");
            });

            if (Array.isArray(req.user)) {
                res.render('join/moimJoin.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('join/moimJoin.ejs', {
                    user: req.user
                });
            }
        }
    });

    // 참여하기 (get)
    router.route('/join/moimJoin').get(function (req, res) {
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
                res.render('join/moimJoin.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('join/moimJoin.ejs', {
                    user: req.user
                });
            }
        }
    });

    // 참여 취소하기 (get)
    router.route('/cancel/waiting_cancel').get(function (req, res) {
        console.log('/waiting_cancel 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user 객체의 값');
            console.dir(req.user);

            var moimId = req.param('id');
            console.log(moimId + "의 모집 참가 취소");

            var database = req.app.get('database');
            var searchMoim = new database.MoimList();

            database.MoimList.findOne({
                _id: moimId
            }, function (err, searchMoim) {
                if (err) throw err;
                console.log(searchMoim);
                if (Array.isArray(req.user)) {
                    res.render('cancel/waiting_cancel.ejs', {
                        user: req.user[0]._doc,
                        moim: searchMoim
                    });
                } else {
                    res.render('cancel/waiting_cancel.ejs', {
                        user: req.user,
                        moim: searchMoim
                    });
                }
            });
        }
    });

    // 참여 취소 완료 (get)
    router.route('/cancel/cancel_complete').get(function (req, res) {
        console.log('/cancel_complete 패스 요청됨.');

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');
        } else {
            console.log('사용자 인증된 상태임.');
            console.log('req.user 객체의 값');
            console.dir(req.user);

            var moimId = req.param('id');
            console.log(moimId + "의 모집 참가 취소");

            var database = req.app.get('database');
            var searchMoim = new database.Moim();

            database.MoimList.findOne({
                _id: moimId
            }, function (err, moim) {
                if (err) throw err;
                moim.count -= 1;

                moim.save(function (err) {
                    if (err) throw err;
                    console.log(moimId + "모임 count -1");
                });

                database.Moim.deleteOne({
                    moim_id: moimId,
                    user_id: req.user._id
                }, function (err, seacrhMoim) {
                    if (err) throw err;
                    if (Array.isArray(req.user)) {
                        res.render('cancel/cancel_complete.ejs', {
                            user: req.user[0]._doc,
                            moim: moim
                        });
                    } else {
                        res.render('cancel/cancel_complete.ejs', {
                            user: req.user,
                            moim: moim
                        });
                    }
                });

            });
        }
    });

    // 회원정보 찾기 화면 (get)
    router.route('/find/find_pw').get(function (req, res) {
        console.log('/find_pw 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find/find_pw.ejs', {
                login_success: false
            });
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {
                login_success: true
            });
        }
    });

    // 회원정보 찾기 화면 (post)
    router.route('/find/find_pw').post(function (req, res) {
        console.log('/find_pw post 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');

            var mail = req.body.email;
            console.log(mail);
            var database = req.app.get('database');

            database.UserModel.findOne({
                email: mail
            }, function (err, searchMail) {
                if (err) throw err;
                if (searchMail) {
                    res.render('find/find_success.ejs', {
                        mail: searchMail
                    });
                } else {
                    res.render('find/find_fail.ejs');
                }
            });
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {
                login_success: true
            });
        }
    });

    // 회원정보 없음 화면
    router.route('/find/find_fail').get(function (req, res) {
        console.log('/find_fail 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find/find_fail.ejs', {
                login_success: false
            });
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {
                login_success: true
            });
        }
    });

    // 회원정보 있음 화면
    router.route('/find/find_success').get(function (req, res) {
        console.log('/find_success 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('find/find_success.ejs', {
                login_success: false
            });
        } else {
            console.log('사용자 인증된 상태임.');
            res.render('home.ejs', {
                login_success: true
            });
        }
    });

    // 모임 시작하기 (get)
    router.route('/approval').get(function (req, res) {
        console.log('/approval 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            console.log('사용자 인증된 상태임.');

            var moimId = req.param('id');
            console.log(moimId + " 모임 시작");

            var database = req.app.get('database');
            var moim = new database.MoimList();

            database.MoimList.findOne({
                _id: moimId
            }, function (err, moim) {
                if (err) throw err;

                if (Array.isArray(req.user)) {
                    res.render('approval.ejs', {
                        user: req.user[0]._doc,
                        moim: moim,
                        text: 'false'
                    });
                } else {
                    res.render('approval.ejs', {
                        user: req.user,
                        moim: moim,
                        text: 'false'
                    });
                }
            });
        }
    });

    // 모임 시작하기 (post)
    router.route('/approval').post(function (req, res) {
        console.log('/approval 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var moimId = req.body.moimid;
            console.log(moimId + "모임 시작 준비");
            var database = req.app.get('database');
            var SearchMoim = new database.MoimList();
            var moim = new database.Moim();
            database.MoimList.findOne({
                _id: moimId
            }, function (err, SearchMoim) {
                SearchMoim.state = 'ongoing';
                SearchMoim.save(function (err) {
                    if (err) throw err;
                    console.log(moimId + "모임 state 변경");
                });

                database.Moim.find({
                    moim_id: moimId
                }).sort({
                    createAt: -1
                }).exec(function (err, moim) {
                    if (err) throw err;

                    if (moim.length > 0) {
                        var i = 0;
                        moim.forEach(function (moim) {
                            moim.state = 'ongoing';
                            if (moim.member_type == 'manager') {
                                moim.payment = 60;
                            } else {
                                moim.payment = 40;
                            }
                            moim.save(function (err) {
                                if (err) throw err;
                                console.log(moimId + "모임 참여자 state, payment 변경");
                            });
                        })
                    }
                    if (Array.isArray(req.user)) {
                        res.render('moim/start.ejs', {
                            user: req.user[0]._doc,
                            moim: SearchMoim
                        });
                    } else {
                        res.render('moim/start.ejs', {
                            user: req.user,
                            moim: SearchMoim
                        });
                    }

                });
            });

        }
    });

    // 모임 들어가기 (get)
    router.route('/moim/start').get(function (req, res) {
        console.log('/start 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            if (Array.isArray(req.user)) {
                res.render('moim/start.ejs', {
                    user: req.user[0]._doc
                });
            } else {
                res.render('moim/start.ejs', {
                    user: req.user
                });
            }
        }
    });

    // 모임 상세페이지 (get)
    router.route('/moim/moimHome').get(function (req, res) {
        console.log('/moimHome 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 모임 관리 시작");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();

            database.MoimTable.find({
                moim_id: moimId
            }).sort({
                num: +1
            }).exec(function (err, table) {
                if (err) throw err;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/moimHome.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            table: table
                        });
                    } else {
                        res.render('moim/moimHome.ejs', {
                            user: req.user,
                            moim: moim,
                            table: table
                        });
                    }
                });
            });
        }
    });

    var this_num = 1; //출석인증하는 모임 회차. 일단 1로 초기화

    //백
    //출석인증 (get)
    router.route('/moim/att_verification').get(function (req, res) {
        console.log('=====================================================================');
        console.log('\n /moim/att_verification get패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {

            var moimId = req.param('id');
            console.log(moimId + " 모임 출석 인증");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();

            database.MoimTable.find({
                moim_id: moimId
            }).sort({
                num: +1
            }).exec(function (err, table) {
                if (err) throw err;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/att_verification.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            table: table
                        });
                    } else {
                        res.render('moim/att_verification.ejs', {
                            user: req.user,
                            moim: moim,
                            table: table
                        });
                    }
                });
            });
        }
    });

    //백
    //출석인증 (post)
    //gps api사용해서 user의 location값을 받아와 db에 있는 모임location과 같은지 값대조
    //user_location==moim.location이면 출석
    router.route('/moim/att_verification').post(function (req, res) {
        console.log('=====================================================================');
        console.log('\n /moim/att_verification (post)호출됨.');
        var latitude = req.body.latitude.substring(0, 9);
        var longitude = req.body.longitude.substring(0, 10);
        var moimId = req.body.moimid;
        var bool = 1;

        var OPTIONS = {
            headers: {
                'Authorization': "KakaoAK 2227c44d872e4835f161cdd60599a506"
            },
            type: 'GET',
            url: "https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=" + longitude + "&y=" + latitude + "&input_coord=WGS84",
        };
        request.get(OPTIONS, function (err, res, result) {
            var results = JSON.parse(result);
            var user_loc = results.documents[0].region_1depth_name + " " + results.documents[0].region_2depth_name;

            console.log(user_loc);

            //var moimId = req.body.moimid;
            console.log(moimId + "모임 출석인증!!");

            var database = req.app.get('database');
            var Moim_list = new database.MoimList();
            var att = new database.Attendance();

            //moimId같은 모임의 장소가 user_loc과 같은지
            database.MoimList.findOne({
                _id: moimId,
                location: user_loc
            }, function (err, Moim_list) {
                if (Moim_list == null) {
                    console.log("모임의 위치가 다릅니다. 예외처리");
                    //attendance
                    database.Attendance.updateOne({
                        moim_id: moimId,
                        user_id: req.user._id,
                        num: this_num
                    }, {
                        $set: {
                            "state": '인증실패'
                        }
                    }, function (err, att) {
                        console.log(att);
                    });
                } else { //모임 위치==유저 위치
                    console.log("<모임정보>\n" + Moim_list);
                    console.log(moimId + "모임의 위치::\n" + Moim_list.location + "\n");

                    //attendance
                    database.Attendance.updateOne({
                        moim_id: moimId,
                        user_id: req.user._id,
                        num: this_num //<-몇회차 출석인지는 방장에게 입력받는걸로.
                    }, {
                        $set: {
                            "state": '출석',
                            "date": new Date(),
                            "total_num": +1
                            //total_num을 모임의 전체횟수로 보는지 or 회원이 모임에 참여한 횟수로 보는지..?
                        }
                    }, function (err, att) {
                        console.log(att);
                    });
                    //여기 res.redirect도 아닌거같은데
                }
            });
        });
        //값 같으면 1.attendance데이터베이스 update하고 2.출석완료 페이지render
        //출석부에서 확인하라는 페이지
        res.redirect('/moim/att_done?id=' + moimId);
    });

    //백
    // 출석 완료페이지 (get)
    // 그냥 안내하는 페이지
    router.route('/moim/att_done').get(function (req, res) {
        console.log('/att_done 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);
        var moimId = req.param('id');
        var database = req.app.get('database');
        var moim = new database.MoimList();

        database.MoimList.findOne({
            _id: moimId
        }, function (err, moim) {
            if (err) throw err;

            if (Array.isArray(req.user)) {
                res.render('moim/att_done.ejs', {
                    user: req.user[0]._doc,
                    moim: moim
                });
            } else {
                res.render('moim/att_done.ejs', {
                    user: req.user,
                    moim: moim
                });
            }
        });
    });

    //백
    // /moim/att_manager삭제: 출서인증을 gps값으로 하니 방장이 따로 인증번호를 받을 필요가 없다.
    // 근데 몇회차 출석 시작할건지는 설정해야해서 post에서 입력받게 바꿨다.
    router.route('/moim/att_manager').get(function (req, res) {
        console.log('/att_manager 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);
        var moimId = req.param('id');
        var database = req.app.get('database');
        var moim = new database.MoimList();

        database.MoimList.findOne({
            _id: moimId
        }, function (err, moim) {
            if (err) throw err;

            if (Array.isArray(req.user)) {
                res.render('moim/att_manager.ejs', {
                    user: req.user[0]._doc,
                    moim: moim
                });
            } else {
                res.render('moim/att_manager.ejs', {
                    user: req.user,
                    moim: moim
                });
            }
        });
    });
    //백
    // 방장이 설정한 회차 값 받아오기
    router.route('/moim/att_manager').post(function (req, res) {
        console.log('/att_manager (post)패스 요청됨.');

        //받아온 회차는 멤버변수 this_num에 저장.
        this_num = req.body.this_num;
        console.log("this_num : " + this_num);

        var moimId = req.body.moimid;
        console.log(moimId + " 출석회차 설정");

        var database = req.app.get('database');
        var moim = new database.MoimList();
        var moimTable = new database.MoimTable();

        database.MoimTable.find({
            moim_id: moimId
        }).sort({
            num: +1
        }).exec(function (err, table) {
            if (err) throw err;

            database.MoimList.findOne({
                _id: moimId
            }, function (err, moim) {
                if (err) throw err;

                if (Array.isArray(req.user)) {
                    res.render('moim/moimHome.ejs', {
                        user: req.user[0]._doc,
                        moim: moim,
                        table: table
                    });
                } else {
                    res.render('moim/moimHome.ejs', {
                        user: req.user,
                        moim: moim,
                        table: table
                    });
                }
            });
        });
    });


    // 모임 회차별 관리 (get)
    router.route('/moim/moimSetting').get(function (req, res) {
        console.log('/setting 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 모임 회차별 관리");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();

            database.MoimTable.find({
                moim_id: moimId
            }).sort({
                num: +1
            }).exec(function (err, table) {
                if (err) throw err;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/moimSetting.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            table: table
                        });
                    } else {
                        res.render('moim/moimSetting.ejs', {
                            user: req.user,
                            moim: moim,
                            table: table
                        });
                    }
                });
            });
        }
    });

    // 모임 회차별 관리 (post)
    router.route('/moim/moimSetting').post(function (req, res) {
        console.log('/approval 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var moimId = req.body.moimid;
            var num = req.body.num;
            console.log(moimId + "모임 회차 수정");
            var database = req.app.get('database');
            var SearchMoim = new database.MoimList();
            var table = new database.MoimTable();
            var user = new database.UserModel();

            database.MoimList.findOne({
                _id: moimId
            }, function (err, SearchMoim) {
                SearchMoim.state = 'ongoing';
                SearchMoim.num = num;
                SearchMoim.save(function (err) {
                    if (err) throw err;
                    console.log(moimId + "모임 state 변경");
                });

                for (var i = 1; i <= num; i++) {
                    var moimtable = new database.MoimTable({
                        "moim_id": moimId,
                        "num": i
                    });
                    moimtable.save(function (err) {
                        if (err) throw err;
                        console.log(moimId + " 모임 테이블 생성");
                    });
                }


                var moim = new database.Moim();

                database.UserModel.find({}).sort({
                    createdAt: -1
                }).exec(function (err, users) {
                    if (err) throw err;

                    database.Moim.find({
                        moim_id: moimId
                    }).sort({
                        createdAt: -1
                    }).exec(function (err, moim) {
                        if (err) throw err;
                        if (moim.length > 0) {
                            var i = 0;
                            moim.forEach(function (moim) {
                                for (var i = 1; i <= num; i++) {
                                    var attendance = new database.Attendance({
                                        "moim_id": moimId,
                                        "user_id": moim.user_id,
                                        "date": moimtable.date,
                                        "num": i
                                    });
                                    attendance.save(function (err) {
                                        if (err) throw err;
                                    })
                                }

                            })
                        }
                        console.log(moimId + "출석부 생성");
                    });
                });
            });
            res.redirect('/moim/moimSetting?id=' + moimId);

        }
    });

    // 모임 회차별 관리 (post)
    router.route('/moim/moimSetting/table').post(function (req, res) {
        console.log('/table 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var moimId = req.body.moimid;
            var tablenum = req.body.tablenum;
            console.log(moimId + "모임 회차 세부 수정");
            var database = req.app.get('database');
            var SearchMoim = new database.MoimList();
            var table = new database.MoimTable();
            database.MoimList.findOne({
                _id: moimId
            }, function (err, SearchMoim) {
                if (err) throw err;
                database.MoimTable.findOne({
                    moim_id: moimId,
                    num: tablenum
                }, function (err, table) {
                    if (Array.isArray(req.user)) {
                        res.render('moim/tableEdit.ejs', {
                            user: req.user[0]._doc,
                            moim: SearchMoim,
                            table: table,
                            tablenum: tablenum
                        });
                    } else {
                        res.render('moim/tableEdit.ejs', {
                            user: req.user,
                            moim: SearchMoim,
                            table: table,
                            tablenum: tablenum
                        });
                    }
                });

            });

            res.redirect('/moim/moimSetting?id=' + moimId);
        }
    });

    // 모임 회차별 수정 (get)
    router.route('/moim/tableEdit').get(function (req, res) {
        console.log('/tableEdit 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var tableId = req.param('id');
            console.log(moimId + " 모임 회차별 관리");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();
            var moimId;

            database.MoimTable.findOne({
                _id: tableId
            }, function (err, table) {
                if (err) throw err;
                moimId = table.moim_id;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/tableEdit.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            table: table
                        });
                    } else {
                        res.render('moim/tableEdit.ejs', {
                            user: req.user,
                            moim: moim,
                            table: table
                        });
                    }
                });
            });
        }
    });

    // 모임 회차별 수정 (post)
    router.route('/moim/tableEdit').post(function (req, res) {
        console.log('/moim/tableEdit 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var moimId = req.body.moimid;
            var tablenum = req.body.tablenum;
            var date = req.body.date;
            var time = req.body.time;
            var location = req.body.location;
            console.log(moimId + "모임 회차 세부 수정");
            var database = req.app.get('database');
            var SearchMoim = new database.MoimList();
            var table = new database.MoimTable();
            var attendance = new database.Attendance();
            database.MoimList.findOne({
                _id: moimId
            }, function (err, SearchMoim) {
                if (err) throw err;
                database.MoimTable.findOne({
                    moim_id: moimId,
                    num: tablenum
                }, function (err, table) {
                    table.date = date;
                    table.time = time;
                    table.location = location;
                    table.save(function (err) {
                        if (err) throw err;
                    });
                    database.Attendance.find({
                        moim_id: moimId,
                        num: tablenum
                    }).sort({
                        num: +1
                    }).exec(function (err, attendance) {
                        if (attendance.length > 0) {
                            var i = 0;
                            console.log(attendance);
                            attendance.forEach(function (attendance) {
                                attendance.date = date;

                                attendance.save(function (err) {
                                    if (err) throw err;
                                    console.log('출석부 날짜 업데이트');
                                });
                            })
                        }
                    });

                });
                res.redirect('/moim/moimSetting?id=' + moimId);
            });
        }
    });

    // 전체 출석 관리 (get)
    router.route('/moim/allAttendance').get(function (req, res) {
        console.log('/allAttendance 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 모임 회차별 관리");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();
            var attendance = new database.Attendance();
            var Moim = new database.Moim();
            var users = new database.UserModel();

            database.UserModel.find({}).sort({
                _id: +1
            }).exec(function (err, users) {
                if (err) throw err;
                console.log(users);

                database.Moim.find({
                    moim_id: moimId
                }).sort({
                    createdAt: +1
                }).exec(function (err, Moim) {
                    if (err) throw err;

                    database.MoimTable.find({
                        moim_id: moimId
                    }).sort({
                        num: +1
                    }).exec(function (err, table) {
                        if (err) throw err;

                        database.Attendance.find({
                            moim_id: moimId
                        }).sort({
                            num: +1
                        }).exec(function (err, attendance) {
                            if (err) throw err;

                            database.MoimList.findOne({
                                _id: moimId
                            }, function (err, moim) {
                                if (err) throw err;

                                if (Array.isArray(req.user)) {
                                    res.render('moim/allAttendance.ejs', {
                                        user: req.user[0]._doc,
                                        moim: moim,
                                        table: table,
                                        attendance: attendance,
                                        users: users
                                    });
                                } else {
                                    res.render('moim/allAttendance.ejs', {
                                        user: req.user,
                                        moim: moim,
                                        table: table,
                                        attendance: attendance,
                                        users: users
                                    });
                                }
                            });
                        });
                    });
                });
            });
        }
    });

    //백
    // 모임 참여자 목록 (get)
    router.route('/moim/members').get(function (req, res) {
        console.log('/members 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 모임 회차별 관리");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();
            var attendance = new database.Attendance();
            var Moim = new database.Moim();
            var users = new database.UserModel();

            database.UserModel.find({}).sort({
                _id: +1
            }).exec(function (err, users) {
                if (err) throw err;
                console.log(users);

                database.Moim.find({
                    moim_id: moimId
                }).sort({
                    createdAt: +1
                }).exec(function (err, Moim) {
                    if (err) throw err;

                    database.MoimTable.find({
                        moim_id: moimId
                    }).sort({
                        num: +1
                    }).exec(function (err, table) {
                        if (err) throw err;

                        database.Attendance.find({
                            moim_id: moimId
                        }).sort({
                            num: +1
                        }).exec(function (err, attendance) {
                            if (err) throw err;

                            database.MoimList.findOne({
                                _id: moimId
                            }, function (err, moim) {
                                if (err) throw err;

                                if (Array.isArray(req.user)) {
                                    res.render('moim/members.ejs', {
                                        user: req.user[0]._doc,
                                        moim: moim, //moimlist
                                        table: table,
                                        attendance: attendance,
                                        users: users
                                    });
                                } else {
                                    res.render('moim/members.ejs', {
                                        user: req.user,
                                        moim: moim,
                                        table: table,
                                        attendance: attendance,
                                        users: users
                                    });
                                }
                            });
                        });
                    });
                });
            });
        }
    });

    // 개인 출석 관리 (get)
    router.route('/moim/attendance').get(function (req, res) {
        console.log('/attendance 패스 요청됨.');

        //console.log('req.user의 정보');
        //console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 개인 출석 관리");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var moimTable = new database.MoimTable();
            var attendance = new database.Attendance();
            var Moim = new database.Moim();
            var users = new database.UserModel();

            database.UserModel.find({}).sort({
                _id: +1
            }).exec(function (err, users) {
                if (err) throw err;

                database.Moim.find({
                    moim_id: moimId
                }).sort({
                    createdAt: +1
                }).exec(function (err, Moim) {
                    if (err) throw err;

                    database.MoimTable.find({
                        moim_id: moimId
                    }).sort({
                        num: +1
                    }).exec(function (err, table) {
                        if (err) throw err;

                        database.Attendance.find({
                            moim_id: moimId
                        }).sort({
                            num: +1
                        }).exec(function (err, attendance) {
                            if (err) throw err;

                            database.MoimList.findOne({
                                _id: moimId
                            }, function (err, moim) {
                                if (err) throw err;
                                console.log("--attendance로그 출력--");
                                console.log(attendance);
                                if (Array.isArray(req.user)) {
                                    res.render('moim/attendance.ejs', {
                                        user: req.user[0]._doc,
                                        moim: moim,
                                        table: table,
                                        attendance: attendance,
                                        users: users
                                    });
                                } else {
                                    res.render('moim/attendance.ejs', {
                                        user: req.user,
                                        moim: moim,
                                        table: table,
                                        attendance: attendance,
                                        users: users
                                    });
                                }
                            });
                        });
                    });
                });
            });
        }
    });

    // 모임 게시판 인덱스 (get)
    router.route('/moim/boardIndex').get(function (req, res) {
        console.log('/boardIndex 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 모임 게시판");

            var database = req.app.get('database');
            var moim = new database.MoimList();

            database.Board.find({
                moim_id: moimId
            }).sort({
                date: -1
            }).exec(function (err, board) {
                if (err) throw err;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;


                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/boardIndex.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            board: board
                        });
                    } else {
                        res.render('moim/boardIndex.ejs', {
                            user: req.user,
                            moim: moim,
                            board: board
                        });
                    }

                });
            });
        }
    });

    // 모임 게시글 쓰기 (get)
    router.route('/moim/boardWrite').get(function (req, res) {
        console.log('/boardWrite 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var moimId = req.param('id');
            console.log(moimId + " 모임 게시글 쓰기");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var Moim = new database.Moim();

            database.Board.find({
                moim_id: moimId
            }).sort({
                date: -1
            }).exec(function (err, board) {
                if (err) throw err;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;


                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/boardWrite.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            board: board
                        });
                    } else {
                        res.render('moim/boardWrite.ejs', {
                            user: req.user,
                            moim: moim,
                            board: board
                        });
                    }
                });
            });
        }
    });

    // 모임 게시글 쓰기 (post)
    router.route('/moim/boardWrite').post(function (req, res) {
        console.log('/boardWrite 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var moimId = req.body.moimid;
            var writer = req.body.writer;
            var title = req.body.title;
            var content = req.body.content;

            console.log(moimId + "모임 회차 세부 수정");

            var database = req.app.get('database');

            var newWrite = new database.Board({
                moim_id: moimId,
                title: title,
                writer: writer,
                content: content
            });
            newWrite.save(function (err) {
                if (err) {
                    throw err;
                }
                console.log("게시글 추가함.");
            });

            res.redirect('/moim/boardIndex?id=' + moimId);
        }
    });

    // 모임 게시글 보기 (get)
    router.route('/moim/boardView').get(function (req, res) {
        console.log('/boardView 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var boardId = req.param('id');
            console.log(boardId + " 모임 게시글 보기");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var Moim = new database.Moim();
            var moimId;

            database.Board.findOne({
                _id: boardId
            }, function (err, board) {
                if (err) throw err;
                board.count += 1;
                board.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("조회수 변경");
                });

                moimId = board.moim_id;
                console.log(moimId);

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;

                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/boardView.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            board: board
                        });
                    } else {
                        res.render('moim/boardView.ejs', {
                            user: req.user,
                            moim: moim,
                            board: board
                        });
                    }
                });
            });
        }
    });

    // 모임 게시글 댓글 달기 (post)
    router.route('/moim/boardView').post(function (req, res) {

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var boardId = req.body.boardid;
            var moimId = req.body.moimid;
            var writer = req.body.writer;
            var comment = req.body.comment;
            var date = req.body.date;

            console.log(comment);
            console.log(boardId);

            console.log(boardId + "게시글 댓글 달기");

            var database = req.app.get('database');

            var board = new database.Board();
            database.Board.findOne({
                _id: boardId
            }, function (err, board) {
                if (err) throw err;

                board.comments.push({
                    writer: writer,
                    contents: comment
                });
                board.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("댓글 추가함.");
                });
            });

            res.redirect('/moim/boardView?id=' + boardId);
        }
    });

    // 모임 게시글 수정하기 (get)
    router.route('/moim/boardEdit').get(function (req, res) {
        console.log('/boardEdit 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.render('/', {
                login_success: false
            });
        } else {
            var boardId = req.param('id');
            console.log(boardId + "게시글 수정");

            var database = req.app.get('database');
            var moim = new database.MoimList();
            var Moim = new database.Moim();
            var moimId;

            database.Board.findOne({
                _id: boardId
            }, function (err, board) {
                if (err) throw err;
                moimId = board.moim_id;

                database.MoimList.findOne({
                    _id: moimId
                }, function (err, moim) {
                    if (err) throw err;


                    if (err) throw err;

                    if (Array.isArray(req.user)) {
                        res.render('moim/boardEdit.ejs', {
                            user: req.user[0]._doc,
                            moim: moim,
                            board: board
                        });
                    } else {
                        res.render('moim/boardEdit.ejs', {
                            user: req.user,
                            moim: moim,
                            board: board
                        });
                    }
                });
            });
        }
    });

    // 모임 게시글 수정하기 (post)
    router.route('/moim/boardEdit').post(function (req, res) {
        console.log('/boardEdit 패스 요청됨.');

        console.log('req.user의 정보');
        console.dir(req.user);

        // 인증 안된 경우
        if (!req.user) {
            console.log('사용자 인증 안된 상태임.');
            res.redirect('/');

        } else {
            console.log('사용자 인증된 상태임.');

            var boardId = req.body.boardid;
            var moimId = req.body.moimid;
            var title = req.body.title;
            var content = req.body.content;
            var updatedAt = req.body.updatedAt;

            console.log(boardId + "모임 게시글 수정");

            var database = req.app.get('database');

            var board = new database.Board();
            database.Board.findOne({
                _id: boardId
            }, function (err, board) {
                if (err) throw err;
                moimId = board.moim_id;
                board.title = title;
                board.content = content;
                board.updatedAt = updatedAt;

                board.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log("게시글 추가함.");
                });
            });

            res.redirect('/moim/boardIndex?id=' + moimId);
        }
    });
    // 로그아웃
    router.route('/logout').get(function (req, res) {
        console.log('/logout 패스 요청됨.');
        var database = req.app.get('database');
        var date = new Date();
        console.log(date.getTime());
        database.db.collection("users").updateOne({
            'email': req.user.email
        }, {
            $set: {
                updated_at: date
            }
        });
        req.logout();
        res.redirect('/');
    });
    // 로그인 화면
    router.route('/login').get(function (req, res) {
        console.log('/login 패스 요청됨.');
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // 회원가입 화면
    router.route('/signup').get(function (req, res) {
        console.log('/signup 패스 요청됨.');
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // 로그인 인증
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // 회원가입 인증
    // 회원가입 후 홈화면 아니라 인증메일 안내 페이지로
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect: '/signup_mail',
        failureRedirect: '/signup',
        failureFlash: true
    }));

};
