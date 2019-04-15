var noteDiv,envelopeAmount;
var lastPrice = 0;

apiready = function() {
	showGoldAccount();
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
		showGoldAccount();
	});

	api.addEventListener({
        name:'getGoldAccountDataRefreshSuccess'
    },function(ret,err){
		showGoldAccount();
    });
}

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

        		showResultData(ret.obj);

        	}
        }
	});
}

function showGoldAccount2(){
	var getGoldAccountDataResult = $api.getStorage("getGoldAccountDataResult");
	if (getGoldAccountDataResult) {
        showResultData(getGoldAccountDataResult);
	} else {
		api.sendEvent({
	        name:'getGoldAccountDataRefresh'
        });
	}
}

function showResultData(ret) {
	envelopeAmount = ret.envelopeAmount;

	var goldPrice = $api.getStorage('goldPrice');
    if(goldPrice){
        lastPrice = goldPrice.lastPrice;
        // 黄金现值= 实时金价 * 克重
		$api.html($api.byId('envelopeMoney'), global.formatNumber(lastPrice * envelopeAmount,2));
    } else{
        api.sendEvent({
            name:'goldPriceRefresh'
        });
    }

	// 可用红包金
	$api.html($api.byId('envelopeAmount'), global.formatNumber(envelopeAmount,3));
	// 黄金现值= 实时金价 * 克重
	$api.html($api.byId('envelopeMoney'), global.formatNumber(lastPrice * envelopeAmount,2));

}

function openSubWin(type){
	var header = "../common/header";
	var params = {};
	
	if(type === 1 || type === 4 || type === 5){
		//实名
		if(!global.getUserIdCard()){
			params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1  };
			header = "../common/custom_header";
			return global.validIdCardTooltip("goldWin", header, params);
		}
		//绑卡
		if(global.getUserBindCard() === '0'){
			params = { "page" : "../member/bindNewBankCard", "title" : "绑定银行卡" };
			header = "../common/custom_header";
			return global.validBindCardTooltip("goldWin", header, params);
		}
		//交易密码
		if(global.getUserPayPassword() === '0'){
			params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
			return global.validPayPasswordTooltip("goldWin", header, params);
		}
	}
	
	var winName = "goldRedAccountSubWin";
	switch(type) {
		case 1:
			winName = "redpacketSendWin";
			header = "../redpacket/prepareHeader";
			params = "";
			break;
		case 2:
			params = { "page" : "../redpacket/redUnderstand", "title" : "一分钟了解红包金" };
			break;
		case 3:
			params = { "page" : "../redpacket/redUnderstand", "title" : "一分钟了解红包金" };
			break;
		case 4:
			params = { "page" : "../member/goldSell", "title" : "卖红包金", "src" : 2 };
			break;
		case 5:
			params = { "page" : "../redpacket/buy", "title" : "买红包金" };
			break;
        case 6:
       		header = "../redpacket/recordAdvHeader";
            var params = { "page" : "../redpacket/recordAdv", "title" : "我的黄金红包" };
            break;
	}

	global.openWinName(winName, header, params);
}

function carryGold(){
	var header = "../common/header";
	params = { "page" : "../member/goldExtraction", "title" : "提红包金", "src" : 3 };
	global.openWinName('goldRedAccountSubWin', header, params);
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