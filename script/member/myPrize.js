
var url = global.getRequestUri() + '/prize-draw-record';

apiready = function(){
	initEvent();
	queryOrder();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryOrder();
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

function queryOrder() {
	var params = '?start=0&maxResults=10';
	page.init(10, 'myPrize-content', 'myPrize-template', url, params, true, 'no-records');
}

