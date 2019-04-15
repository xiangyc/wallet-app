var lastPrice = 0;
var params;

apiready = function() {
	operateSrc =  api.pageParam.operateSrc;//来源  1=天天金详情页面
	showGoldAccount();
	initEvent();
}

function initEvent(){
    api.addEventListener({
        name : 'financeAccountRefresh'
    }, function(ret, err) {
        showGoldAccount();
    });
}

// 红包金数据
function showGoldAccount(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/gold-accounts/my-gold-account',
		headers : global.getRequestToken()
	}, function(ret, err) {
		if(ret){
			if(ret.success && ret.obj){
				$api.setStorage("getGoldAccountDataResult", ret.obj);

				showRedResultData(ret.obj);

			}
		}
	});
}

function showRedResultData(ret) {
	envelopeAmount = ret.envelopeAmount;

	var goldPrice = $api.getStorage('goldPrice');
	if(goldPrice){
		lastPrice = goldPrice.lastPrice;
		// 黄金现值= 实时金价 * 克重
		$api.html($api.byId('envelopeMoney'), global.formatCurrency(lastPrice * envelopeAmount));
	} else{
		api.sendEvent({
			name:'goldPriceRefresh'
		});
	}

	// 可用红包金
	$api.html($api.byId('envelopeAmount'), global.formatNumber(envelopeAmount,3) + '克');
	// 黄金现值= 实时金价 * 克重
	$api.html($api.byId('envelopeMoney'), global.formatCurrency(lastPrice * envelopeAmount));
}


// 红包金交易明细
function doRedList(){
	params = { "page" : "../redpacket/redTradeLog", "title" : "交易明细"};
	global.openWinName('redTradeLogHeader', '../redpacket/redTradeLogHeader', params);
}
// 红包记录
function myRecord(){
	var header = "../redpacket/myrecordHeader";
	params = { "page" : "../redpacket/myrecord", "title" : "我的黄金红包"};
	global.openWinName('myrecord', header, params);
}

// 提红包金
function carryRedGold(){
	var header = "../common/header";
	params = { "page" : "../member/goldExtraction", "title" : "提红包金", "src" : 3 };
	global.openWinName('goldRedAccountSubWin', header, params);
}

function openSubWin(type){
	var header = "../common/header";
	var params = {};
	var openWinName ="";

	switch(type) {
		case 5:
			params = { "page" : "../member/goldSell", "title" : "卖红包金", "src" : 2 };
			openWinName = "goldRedAccountSubWin";
			break;
		case 6:
			params = { "page" : "../redpacket/buy", "title" : "买红包金" };
			openWinName = "goldRedAccountSubWin";
			break;
	}

	global.openWinName(openWinName, header, params);
}