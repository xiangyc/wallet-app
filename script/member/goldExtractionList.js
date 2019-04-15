var maxResults = 10;
var url = global.getRequestUri() + '/withdrow-gold-applies';

apiready = function(){
	initEvent();
	queryWithdrawGoldLog();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryWithdrawGoldLog();
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
		name : 'orderListRefresh'
	}, function(ret) {
		queryWithdrawGoldLog();
	});
}

function queryWithdrawGoldLog() {
	var params = '?start=0&maxResults=10';
	page.init(maxResults, 'goldExtractionLog-content', 'goldExtractionLog-template', url, params, true, 'no-records');
}

function goldExtractionDetail(id){
	var header = '../common/header';
	var params =  { "page" : "../member/goldExtractionDetail", "title" : "提金记录详情","id" : id};

	global.openWinName('addressWin', header, params);
}
