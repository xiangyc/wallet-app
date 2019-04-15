var noteDiv;

apiready = function() {
	showResultData();
	initEvent();

    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('totalGoldMoneyDiv'), 'hide')){
            event.preventDefault();
        }
    }, false);
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
	        name:'getGoldAccountDataRefresh'
        });
	});

	api.addEventListener({
        name:'getGoldAccountDataRefreshSuccess'
    },function(ret,err){
		showResultData();
    });
}

function showResultData() {
	var ret = $api.getStorage("getGoldAccountDataResult");
	// 黄金资产
	$api.html($api.byId('totalGoldAmount'), global.formatNumber(ret.totalGoldAmount,3));
	// 黄金现值
	$api.html($api.byId('totalGoldMoney'), global.formatNumber(ret.totalGoldMoney,2));
	// 随心金可用克重
	$api.html($api.byId('activeBalance'),  global.formatNumber(ret.activeBalance,3)); 
	// 提金中(冻结随心+冻结安心+冻结红包金)
	$api.html($api.byId('frozenActiveAmount'), global.formatNumber(ret.frozenActiveAmount + ret.frozenPeriodAmount+ret.frozenEnvelopeAmount+ ret.frozenPerdiemAmount ,3));
	// 安心金可用克重
	$api.html($api.byId('periodGoldAmount'), global.formatNumber(ret.periodGoldAmount,3));
	// 红包金可用克重
	$api.html($api.byId('envelopeAmount'), global.formatNumber(ret.envelopeAmount,3));
	//天天金可用克重
	$api.html($api.byId('daydayAmount'), global.formatNumber(ret.perdiemAmount,3));
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
	switch(type) {
		case 1:
			params = { "page" : "../member/goldExtractionList", "title" : "提金记录" };
			break;
		case 2:
			header = "../redpacket/suiAccountHeader";
			break;
		case 3:
			header = "../redpacket/anAccountHeader";
			break;
		case 4:
			header = "../redpacket/redAccountHeader";
			break;
		case 5:
			header = "../member/dayAccountHeader";
			break;	
	}

	global.openWinName('goldAccountSubWin', header, params);
}

function carryGold(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/withdrow-gold-applies/condition',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
        	if(ret.obj){
				var header = "../common/header";
				params = { "page" : "../member/goldExtraction", "title" : "提金", "src" : 1 };
				global.openWinName('goldAccountSubWin', header, params);
	        }else{
	        	showCarry();
	        }
        }else{
        	global.setErrorToast();
        }
	});
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