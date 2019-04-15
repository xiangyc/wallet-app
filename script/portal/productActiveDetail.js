var id ='';
var profitRate;
var loginWinName = "loginWin";
var bindCardWinName = "bindCardWin";
var payPasswordWinName = "payPasswordWin";
var header = "./common/header";
var params;
var rushPurchase = false;
var goldPrice;

apiready = function() {
	getProduct();
	question();
	getActiveGold();
	initEvent();
}

function initEvent(){
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
		api.closeWin({
			name: loginWinName
        });
	});

	api.addEventListener({
		name : 'userBindCardRefresh'
	}, function(ret, err) {
		if(global.getUserPayPassword() === '1'){
			api.closeWin({
				name : bindCardWinName
			});
		}
	});

	api.addEventListener({
		name : 'payPasswordRefresh'
	}, function(ret, err) {
		api.closeWin({
			name : payPasswordWinName
		});
	});
	
	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
		showGoldPrice();
    });

    api.addEventListener({
		name : 'getGoldAccountDataRefreshSuccess'
	}, function(ret, err) {
		getActiveGold();
	});
}

function showGoldPrice(){
	goldPrice = $api.getStorage('goldPrice');
	if(goldPrice){
		$api.html($api.byId('lastPrice'), goldPrice.lastPrice);
	}
}

function getActiveGold() {
	if(global.isValidUser()){
		var ret = $api.getStorage("getGoldAccountDataResult");
		//天天金可用克重
		if(ret && ret.activeBalance){
			$api.removeCls($api.byId('activeGoldAmountDiv'), 'hide');
			$api.html($api.byId('activeBalance'), global.formatNumber(ret.activeBalance,3));
		}else{
			$api.addCls($api.byId('activeGoldAmountDiv'), 'hide');
		}
	}
}

function getProduct(){
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		url : global.getRequestUri() + '/investment-products/active-products',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers: global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			id = ret.id;
			profitRate = ret.profitRate;
			$api.html($api.byId('profitRate'), ret.profitRate);
			$api.html($api.byId('purchaseAmount'), ret.purchaseAmount);
			if(ret.descriptionApp){
				$api.html($api.byId('descriptionApp'), ret.descriptionApp);
			}

			//$api.attr($api.byId('submitBtn'), 'onclick', 'buy();');

			if(ret.rushPurchase && ret.productStrategys && ret.productStrategys.length > 0){
					rushPurchase = true;
					profitRate = ret.productStrategys[0].profitRate;
					$api.html($api.byId('profitRate'), profitRate);
			}
		}
	});
}

function question(){

	api.ajax({
        url: global.getRequestUri() + '/help/listByTag?id=301' ,
        method: 'get',
        timeout: 30,
        dataType: 'json',
        returnAll: false
    },function(ret,err){
		if (ret) {
			var template = $api.byId('helpCategory-template').text;
			var tempFun = doT.template(template);
	      	$api.html($api.byId('helpCategory-content'), tempFun(ret));
		}else{
			global.setErrorToast();
		}
    });
} 

function showContent(qid){
	 if($api.hasCls($api.byId('li'+qid), 'mui-active')){
		$api.removeCls($api.byId('li'+qid), 'mui-active');

	 }else{
	 	$api.addCls($api.byId('li'+qid), 'mui-active');
	 }
}

function showTips(){
	 api.openFrame({
        name: 'productDetailFrame',
        url: 'productDetailFrame.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto',
        },
        pageParam: {
        	type: 2        	
   		},
        bounces: false,
        vScrollBarEnabled: false
    });
}

function sale(){

	isCanBuyOrSellGold(1);
}

function buy(){
	if(id ==''){
		global.setToast('数据加载中，请稍后');
		return;
	}

	if (!global.isValidUser()) {
		params = {  "title" : "登录" };
		global.openWinName(loginWinName, "./member/login", params);
		return;
	}

	//实名
	if(!global.getUserIdCard()){
		params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1  };
		header = "./common/custom_header";
		return global.validIdCardTooltip(bindCardWinName, header, params);
	}
	//绑卡
	if(global.getUserBindCard() === '0'){
		params = { "page" : "../member/bindNewBankCard", "title" : "绑定银行卡" };
		header = "./common/custom_header";
		return global.validBindCardTooltip(bindCardWinName, header, params);
	}
	//交易密码
	if(global.getUserPayPassword() === '0'){
		params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
		return global.validPayPasswordTooltip(bindCardWinName, header, params);
	}

	isCanBuyOrSellGold(2);

}

function isCanBuyOrSellGold(type){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/investment-orders/time-rule'
	}, function(ret, err) {	
		if(ret){
			if(ret.success){
				if(type ==1){
					var params = { "page" : "../member/goldSell", "title" : "卖金" };
					global.openWinName('goldSellSubWin', './common/header', params);
				}else if(type ==2){						
					params = { "page" : "../productActivelBuy", "title" : "随心金订单", "id" : id, "profitRate" : profitRate, "rushPurchase" : rushPurchase, "priceId" : goldPrice.id,
								"lastPrice" : goldPrice.lastPrice };
					global.openWinName('productActivelBuy', header, params);
				}
	
			}else{
				global.setToast('随心金买卖时间：周一至周五（上午7:00-次日2:30）');
			}
		}
	});	
}
