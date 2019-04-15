
var url = global.getRequestUri() + '/investment-orders/per-diem';

apiready = function(){
	initEvent();
	query();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		query();
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
        name:'dayGoldSellRefresh'
    },function(ret,err){
        query();

    });

    api.addEventListener({
        name:'financeAccountRefreshSuccess'
    },function(ret,err){
        query();
    });
	
}

function query() {
	var params = '?start=0&maxResults=5';
	page.init(5, 'order-content', 'order-template', url, params, true, 'no-records');
}

function detail(id, status, productCategory, isWithdraw, money){

	var header = '../member/goldBuyDetailHeader';
	var params =  { "page" : "../member/goldBuyDetailHeader", "title" : "买金记录详情","id" : id, "statusValue" : status, "productCategory" : productCategory, "isWithdraw" : isWithdraw, "money" : money };

	global.openWinName('buyWin', header, params);
}