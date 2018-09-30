var ObjectID = require('mongodb').ObjectID;
module.exports = function(router, MoimList) {

    
    console.log('moimlist 호출됨.');
    
    // 로그인 전 인덱스 화면
    router.route('/').get(function(req, res) {
        console.log('/ 패스 요청됨.');
        
        var database = req.app.get('database'); 
        
        console.log("모든 모임 정보 출력");
        
        var searchMoim = new database.Moim();
        
        database.Moim.find({}).sort({createdAt:-1}).exec(function(err, searchMoim){
            if(err) throw err;
                res.render("index.ejs", {Moim:searchMoim});                          
            });
    });
    
    // 로그인 후 인덱스 화면
    router.route('/home').get(function(req, res) {
        console.log('/home 패스 요청됨.');
        
        var database = req.app.get('database'); 
        
        console.log("모든 모임 정보 출력");
        
        var searchMoim = new database.Moim();
        
        database.Moim.find({}).sort({createdAt:-1}).exec(function(err, searchMoim){
            if(err) throw err;
                res.render("home.ejs", {Moim:searchMoim});                          
            });
    });

    
    // 새로운 모임 만들기 화면
    router.route('/new').post(function(req, res) {
        console.log('/new 패스 요청됨.');
        
        
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
        
        res.render('new_complete.ejs', newMoimList);
        
    });
    
    
    // 나의 모임 조회 화면
    router.route('/mymoim').get(function(req, res) {
        console.log('/mymoim 패스 요청됨.');
        
        var database = req.app.get('database'); 
        
        var userid = req.user._id;
        
        console.log(userid+"의 모임 정보 출력");
        
        var searchMoim = new database.Moim();
        
        database.Moim.find({user_id:userid}).sort({createdAt:-1}).exec(function(err, searchMoim){
            if(err) throw err;
                res.render("mymoim.ejs", {Moim:searchMoim});                          
            });
    });
    
    // 모임 상세보기
    router.route('/moimdetail').get(function(req, res){
        console.log('moimDetail 패스 요청됨');
        
        var moimId = req.param('id');
        console.log(moimId+"의 모임 정보 출력");
        
        var database = req.app.get('database'); 
        var searchMoim = new database.MoimList();
        var moim = new database.Moim();

        database.MoimList.findOne({_id:moimId}, function(err, searchMoim){
            if(err) throw err;
              res.render("moimDetail.ejs", {Moim:searchMoim});  
        });  
        
    });
    
    // 모임 모집 참여하기
    router.route('/moimJoin').get(function(req, res){
        console.log('moimJoin 패스 요청됨');
        
        var moimId = ObjectID.createFromHexString(req.params.id);
        console.log(moimId+"모임에 참여자 추가");
        
        var database = req.app.get('database'); 
        
        databases.MoimList.findOne({_id: moimId}, function(err, moim){
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
		      console.log(moimId+"모임 사용자 추가함.");
        });
        
        

        res.render("moimJoin.ejs");
        
    });
        



};
                    

