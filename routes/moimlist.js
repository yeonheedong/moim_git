
module.exports = function(router, MoimList) {

    
    console.log('moimlist 호출됨.');

    
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
        
        database.Moim.find({user_id:userid, state:'waiting', member_type:'manager'})
                     .sort("-createdAt")
                     .exec(function(err, Moim){
            if(err) throw err;
        });
    
        res.render('mymoim.ejs', Moim);
                
      
                
    });
    
    


};

