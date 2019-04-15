var url = global.getRequestUri() + '/org/tradelog';
var startTime =null;
var endTime =null;

apiready = function(){
    initEvent();
	queryList();
	queryTotal();
}
    
function queryList() {
    var params ;
    if(startTime){
        params = '?start=0&maxResults=10&startTime='+startTime+'&endTime='+endTime;
    }else{
        params = '?start=0&maxResults=10';
    }
    page.init(10, 'detail-content', 'detail-template', url, params, true, 'no-records');
}

function queryTotal() {
    var queryTotalUrl;
    if(startTime){
        queryTotalUrl = global.getRequestUri() + '/org/tradelog/statistics/kind?startTime='+startTime+'&endTime='+endTime;
    }else{
       queryTotalUrl = global.getRequestUri() + '/org/tradelog/statistics/kind';
    }

	api.ajax({
		url : queryTotalUrl,
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret) {
			$api.html($api.byId('outSpan'), '¥'+global.formatNumber(ret.disbursementTotal, 2));
			$api.html($api.byId('inSpan'), '¥'+global.formatNumber(ret.incomeTotal, 2));
		}
	});
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        queryTotal();
        queryList();
        api.refreshHeaderLoadDone();
    });

    api.addEventListener({
        name : 'scrolltobottom',
        extra : {
            threshold : 0
        }
    }, function(ret, err) {
        page.scrollRefresh();
    });
    
    api.addEventListener({
	    name:'selectDateEvent'
    },function(ret,err){
    	if(ret && ret.value){
		    startTime = ret.value.startTime;
		    endTime = ret.value.endTime;
		    
		    $api.html($api.byId('detail-content'), '');
	        queryList();
	        queryTotal();
        }
    });  
}

function detail(id,tradeType){
    if(tradeType ==1){//推荐个人佣金
        var winName = "organAchieveDetailWin";
        var params = { "page" : "../partner/personalAchieveDetail", "title" : "详情" ,"tradeType" : tradeType,"id": id};
        global.openWinName(winName, "../common/header", params);
    }else {//奖励分账,邀请奖励
        var winName = "accountDetailWin";
        var params = { "page" : "../partner/invitationrewardDetails", "title" : "详情" ,"tradeType" : tradeType ,"id":id};
        global.openWinName(winName, "../common/header", params);
    }
}

function choice(){
	api.openFrame({
	    name: 'dateSelectFrame',
	    url: './dateFrame.html',
	    rect: {
		    x:0,
		    y:0,
		    w:api.winWidth,
		    h:api.winHeight
	    },
	    pageParam: {
	    	src: 1
	    }
    });
}
