var productIdStr = [];
apiready = function() {

	getPeriodGoldAccountData();

	getProductIdStr();

	initEvent();
}

function initEvent() {
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function() {
		api.refreshHeaderLoadDone();
		getPeriodGoldAccountData();
	});

	api.addEventListener({
        name:'getPeriodGoldAccountDataRefresh'
    },function(ret,err){
    	getPeriodGoldAccountData();
    });

}

function getPeriodGoldAccountData(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account/period',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
        	if(ret.success){
        		showResultData(ret);
        	}
        }else{
        	global.setErrorToast();
        }
	});
}

function showResultData(ret) {
	// 安心金可用克重
	$api.html($api.byId('periodGoldAmount'), global.formatNumber(ret.obj.periodGoldAmount,3));
	// 待收购金款
	$api.html($api.byId('totalPeriodMoney'),  global.formatNumber(ret.obj.totalPeriodMoney,2)); 
	// 待收赠金
	$api.html($api.byId('collectIncome'),  global.formatNumber(ret.obj.collectIncome,2)); 
	// 待提金克重
	$api.html($api.byId('waitWithDrawPeriod'),  global.formatNumber(ret.obj.waitWithDrawPeriod,3)); 
	// 累计赠金
	$api.html($api.byId('periodTotalIncome'),  global.formatNumber(ret.obj.periodTotalIncome,2)); 

}

function openSubWin(type){
	var header = "../common/header";
	var params = {};
	switch(type) {
		case 1:
			params = { "page" : "../member/goldExtractionList", "title" : "提金记录" };
			break;
		case 2:
			params = { "page" : "../productActivityList", "title" : "买金" ,"productIdStr" : productIdStr};
			break;
		case 3:
			header = "../redpacket/anAccountHeader";
			break;
		case 4:
			header = "../redpacket/redAccountHeader";
			break;
	}

	global.openWinName('goldAnAccountSubWin', header, params);
}


function getProductIdStr(){
	api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-products/period?start=0&maxResults=10',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
         	for (var i = 0;i < ret.recordCount;i++) {
			 	productIdStr.push(ret.items[i].id);
			}
			$api.removeCls($api.byId('anHide'), 'hide');
        }else{
        	global.setErrorToast();
        }
	});
}