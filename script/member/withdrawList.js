
var maxResults = 10;
var url = global.getRequestUri() + '/finance-accounts/withdraw/list';
var header = "../common/header";
var status = "";

apiready = function(){
	status = api.pageParam.status;
	initEvent();
	queryWithdrawList();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryWithdrawList();
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


function queryWithdrawList() {
	var params = '?start=0&maxResults=10&status='+ status;
	page.init(maxResults, 'withdrawList-content', 'withdrawList-template', url, params, true, 'no-records');
}

function detail(id) {
	var params = { "page" : "../member/withdrawDetail", "title" : "提现详情","id":id };
	global.openWinName('withdrawDetailWin', header, params);
}