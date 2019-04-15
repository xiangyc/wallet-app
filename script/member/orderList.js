var orderType = 1;
var period = 5;
var maxResults = 10;
var url = global.getRequestUri() + '/investment-orders';
var optSrc;//卖金来源  首页卖随心金

apiready = function(){
 	optSrc = api.pageParam.optSrc;

 	if(optSrc && optSrc == 'sellActiveGold'){
		queryOrder(2);
 	}else{
 		queryOrder(orderType);
 	}

	initEvent();
	
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryOrder(orderType);
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
		queryOrder(orderType);
	});
}


function queryOrder(type) {
    orderType = type
	var params = '?orderType=' + orderType + '&period=5&start=0&maxResults=10';
	page.init(maxResults, 'order-content', 'order-template', url, params, true, 'no-records');
}


function showOrderDetail(type,id,statusValue, productCategory, isWithdraw, money){
	if (type==1) {
		goldBuyDetail(id, statusValue, productCategory, isWithdraw, money);
	} else if(type==2) {
		goldSellDetail(id);
	} else if(type==3) {
		goldExtractionDetail(id);
	}
}

function goldExtractionDetail(id){
	var header = '../common/header';
	var params =  { "page" : "../member/goldExtractionDetail", "title" : "提金记录详情","id" : id};

	global.openWinName('extractionWin', header, params);
}

function goldBuyDetail(id, statusValue, productCategory, isWithdraw, money){
	var header = '../member/goldBuyDetailHeader';
	var params =  { "page" : "../member/goldBuyDetailHeader", "title" : "买金记录详情","id" : id, "statusValue" : statusValue, "productCategory" : productCategory, "isWithdraw" : isWithdraw, "money" : money };

	global.openWinName('buyWin', header, params);
}

function goldSellDetail(id){
	var header = '../common/header';
	var params =  { "page" : "../member/goldSellDetail", "title" : "卖金记录详情","id" : id};

	global.openWinName('sellWin', header, params);
}