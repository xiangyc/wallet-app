
apiready = function(){
	initEvent();
 	list();
 	updateReadNoticeTime();
}
    
function list() {
	var url = global.getRequestUri() + '/notices'
	var params = '?start=0&maxResults=10';
	page.init(10, 'notice-content', 'notice-template', url, params, true, 'no-records');
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


function detail(id){
	var header = 'common/header';

	var	params = { "page" : "../noticeDetail", "title" : "公告详情", "id" : id };

	global.openWinName('noticeDetailSubWin', header, params);
	
}

function updateReadNoticeTime(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/notices/updateReadNoticeTime',
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret) {
			var readNoticeTime = ret.lastReadTime;
			var publishTime = ret.publishTime;
			global.setReadNoticeTime(readNoticeTime);
			global.setPublishTime(publishTime);
			api.sendEvent({
			    name:'showNoticeCss'
		    });
		} else {
			global.setErrorToast();
		}
	});
}
