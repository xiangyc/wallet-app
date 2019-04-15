var maxResults = 10;
var url = global.getRequestUri() + '/period-income/recommend-income-detail';

apiready = function(){
	initEvent();
	queryInviteReward();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryInviteReward();
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

function queryInviteReward() {
	var params = '?start=0&maxResults=10';
	page.init(maxResults, 'inviteReward-content', 'inviteReward-template', url, params, true, 'no-records');
}
