var tradeType = 0;
var period = 2;
var maxResults = 10;
var url = global.getRequestUri() + '/perdiem-income/income-record';

apiready = function(){
	initEvent();
	queryTradeLog();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryTradeLog();
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

function queryTradeLog() {
	var params = '?start=0&maxResults=10';
	page.init(maxResults, 'tradeLog-content', 'tradeLog-template', url, params, true, 'no-records');
}