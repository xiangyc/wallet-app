var noteDiv,buyAvgPrice,activeBalance;
var lastPrice = 0;

apiready = function() {
	initEvent();
	getActiveGoldAccountData();
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
		api.sendEvent({
	        name:'goldAccountRefresh'
        });
		getActiveGoldAccountData();
	});

	api.addEventListener({
        name:'goldPriceRefreshSuccess'
    },function(ret,err){
        if(ret && ret.value){
            lastPrice = ret.value.value.lastPrice;
            // 浮动盈亏=（实时金价-买入均价）* 克重
			$api.html($api.byId('profitMoney'), global.formatNumber((lastPrice-buyAvgPrice) * activeBalance,2));
        }
    });

    api.addEventListener({
        name:'getActiveGoldAccountDataRefresh'
    },function(ret,err){
    	getActiveGoldAccountData();
    });

}

function getActiveGoldAccountData(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account/active',
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
	activeBalance = ret.obj.activeBalance;
	buyAvgPrice = ret.obj.buyAvgPrice;

	var goldPrice = $api.getStorage('goldPrice');
    if(goldPrice){
        lastPrice = goldPrice.lastPrice;
        // 浮动盈亏=（实时金价-买入均价）* 克重
		$api.html($api.byId('profitMoney'), global.formatNumber((lastPrice-buyAvgPrice) * activeBalance,2));
    } else{
        api.sendEvent({
            name:'goldPriceRefresh'
        });
    }

	// 可用随心金
	$api.html($api.byId('activeBalance'), global.formatNumber(activeBalance,3));
	// 历史盈亏
	$api.html($api.byId('totalActiveIncome'), global.formatNumber(ret.obj.totalActiveIncome,2));
	// 随心金买入均价
	$api.html($api.byId('buyAvgPrice'),  global.formatNumber(ret.obj.buyAvgPrice,3)); 
	// 随心金累计赠金
	$api.html($api.byId('activeIncome'), global.formatNumber(ret.obj.activeIncome,2));

}

function showMessage(id) {
	if(id){
		noteDiv = id;
	}
	
	if($api.hasCls($api.byId(noteDiv), 'hide')){
		$api.removeCls($api.byId(noteDiv), 'hide');
		$api.removeCls($api.byId('messageDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId(noteDiv), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
	}
}



function openSubWin(type){
	var header = "../common/header";
	var params = {};
	var openWinName ="";
	switch(type) {
		case 1:
			params = { "page" : "../member/goldSell", "title" : "卖金" };
			openWinName = "goldSellSubWin";
			break;
		case 2:
			params = { "page" : "../productActiveDetail", "title" : "随心金" };
			openWinName = "goldActiveSubWin";
			break;
		case 3:
			header = "../redpacket/anAccountHeader";
			break;
		case 4:
			header = "../redpacket/redAccountHeader";
			break;
	}

	//global.openWinName("productActiveDetail", header, params);
	global.openWinName(openWinName, header, params);
}

function carryGold(){
	var header = "../common/header";
	params = { "page" : "../member/goldExtraction", "title" : "提金", "src" : 1 };
	global.openWinName('goldSuiAccountSubWin', header, params);
}

function showCarry() {
	if($api.hasCls($api.byId('carryDiv'), 'hide')){
		$api.removeCls($api.byId('carryDiv'), 'hide');
		$api.removeCls($api.byId('carryDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('carryDiv'), 'hide');
		$api.addCls($api.byId('carryDropDiv'), 'hide');
	}
}

// function openSubWin(type, id, name){
// 	var header = "./common/header";
// 	var params;

// 	if(type === 1){
// 		//活期
// 		params = { "page" : "../productActiveDetail", "title" : name };
// 		global.openWinName("productActiveDetail", header, params);
// 	}else if(type === 2 ){
// 		//定期
// 		params = { "page" : "../productDetail", "title" : name, "id" : id };
// 		global.openWinName("productDetail", header, params);
// 	}
// }