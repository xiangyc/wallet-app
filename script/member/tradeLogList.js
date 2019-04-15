var tradeType = '';
var period = 4;
var maxResults = 10;
var url = global.getRequestUri() + '/trade-logs/finance';

apiready = function(){
	initEvent();
	if(api.pageParam && api.pageParam.tradeType){
		tradeType = api.pageParam.tradeType;
	}
	queryTradeLogType();
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

function queryTradeLogType() {
	api.ajax({
            url: global.getRequestUri() + '/options?name=TradeLogTypeGroup&type=1',
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers: global.getRequestToken()
        },function(ret,err){
            if (ret) {
                var template = $api.byId('tradeLogType-template').text;
                var tempFun = doT.template(template);
                $api.html($api.byId('tradeLogTypeUl'), tempFun(ret));
            }
     });
}

function showCondition(){
	if($api.hasCls($api.byId('conditionDiv'), 'hide')){
		$api.removeCls($api.byId('conditionDiv'), 'hide');
		$api.removeCls($api.byId('conditionDropDiv'), 'hide');
		
	}else{
		$api.addCls($api.byId('conditionDiv'), 'hide');
		$api.addCls($api.byId('conditionDropDiv'), 'hide');
	}
}

function selectTradeLogType(id, el){
	tradeType = id;
	
	var lis = $api.domAll($api.byId('tradeLogTypeUl'), 'li');
	for(var i = 0; i < lis.length; i++){
		$api.removeCls(lis[i], 'mui-active');
	}
	
	$api.addCls(el, 'mui-active');
	showCondition();
	queryTradeLog();
}

function selectPeriod(id, el){
	period = id;
	
	if(period === 3){
		$api.html($api.byId('periodEm'), '三个月内');
	}else if(id === 4){
		$api.html($api.byId('periodEm'), '半年内');
	}else{
		$api.html($api.byId('periodEm'), '一年内');
	}
	
	var lis = $api.domAll($api.byId('periodUl'), 'li');
	for(var i = 0; i < lis.length; i++){
		$api.removeCls(lis[i], 'mui-active');
	}
	
	$api.addCls(el, 'mui-active');
	showCondition();
	queryTradeLog();
}

function queryTradeLog() {
	var params = '?tradeType=' + tradeType + '&period=' + period + '&start=0&maxResults=10';
	page.init(maxResults, 'tradeLog-content', 'tradeLog-template', url, params, true, 'no-records');
}