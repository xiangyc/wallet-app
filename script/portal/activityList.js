
apiready = function(){
	initEvent();
 	list();

}
    
function list() {

	var url = global.getRequestUri() + '/activities';
	var params = '?start=0&maxResults=10';
	page.init(10, 'activity-content', 'activity-template', url, params, true, 'no-records');
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		list();
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
}

function detail(id, type, title, subTitle, linkSrc, isShare){
	var	params = {"title" : "活动详情", "title": title, "subTitle": subTitle, "linkSrc": linkSrc, id: id, isShare:isShare};
	global.openWinName('activityWebWin', './activity/activityWebHeader',  params);

/*	var header = 'common/header';
	var	params = { "page" : "../activityDetail", "title" : "活动详情", "id" : id };

	if(type==4){//抽奖
		header = './activity/activityHeader';
		params = { "page" : "../activity/prize", "title" : "抽奖", "id" : id };		
		global.openWinName('activityPrizeSubWin', header, params);
	}else if(type ==8){//排行榜
		header = './activity/activityHeader';
		params = { "page" : "../activity/activityRanking", "title" : "富豪排行榜", "id" : id };
		global.openWinName('activityRankingSubWin', header, params);
	}else{
		header = './activity/activityHeader';
		global.openWinName('activityDetailSubWin', header, params);
    }*/
}
