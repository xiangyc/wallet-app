var goldPrice,payPwd;
var goldPriceFlag = true;
var balance = 0;
var useBalance = 0;
var agreementFlag = true;
var buyWayFlag = 1;//购买方式 默认1是克重，2是金额购买

apiready = function() {
	loadUseBalance();
	showGoldPrice();
	switchToBuyWay();
	initEvent();
}

function initEvent(){
	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
    	if(ret && ret.value && goldPriceFlag){
    		showGoldPrice();
		}
    });

    api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	loadUseBalance();
    });

    api.addEventListener({
	    name:'payPwdSuccessEvent'
    },function(ret,err){
    	api.closeFrame({
    		name: 'checkPayPwdFrame'
        });
		if(ret && ret.value){			
			payPwd = ret.value.key1;
			buy();
		}
    });
}

function showGoldPrice(){
 	$api.addCls($api.byId('refreshDiv'), 'animation-rotate');
 	//$api.addCls($api.byId('lastPrice'), 'lastprice-ac');
 	setTimeout("$api.removeCls($api.byId('refreshDiv'), 'animation-rotate');", 1000);
 	//setTimeout("$api.removeCls($api.byId('lastPrice'), 'lastprice-ac');", 1000);

	goldPrice = $api.getStorage('goldPrice');
	if(goldPrice){
		$api.html($api.byId('lastPrice'), goldPrice.lastPrice);
		computeBalance();
	}
}

function loadUseBalance(){
	var financeAccount = $api.getStorage("financeAccountResult");

	if(financeAccount) {
		useBalance = financeAccount.useBalance;
		$api.html($api.byId('useBalance'), global.formatNumber(useBalance, 2));
	}
}

function refresh(){	
	api.sendEvent({
	    name:'goldPriceRefresh'
    });

    goldPriceFlag = true;
}


function showMessage(){
	if($api.hasCls($api.byId('messageDiv'), 'hide')){
		$api.removeCls($api.byId('messageDiv'), 'hide');
		$api.removeCls($api.byId('messageDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('messageDiv'), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
	}
}

function submitOrder(){
	if(!goldPrice){
		global.setToast('数据加载中，请稍后');
		return;
	}
	
	var amount = $api.val($api.byId('amount'));
	var money = $api.val($api.byId('money'));
	var balance = $api.val($api.byId('formatBalance'));


	if(!agreementFlag){
		global.setToast('请同意购买黄金租赁服务协议');
		return;
	}

	if(buyWayFlag==1){
				
		if (validate.isEmpty(amount)) {
			global.setToast('买入克重不能为空');
			return;
		}
		
		if (!validate.buyNumber(amount)) {
			global.setToast('买入克重无效');
			return;
		}
		
		if(amount <=0){
			global.setToast('买入克重无效');
			return;
		}
	}else if(buyWayFlag==2){
		if (validate.isEmpty(money)) {
			global.setToast('购买金额不能为空');
			return;
		}
		if (!validate.money(money)) {
			global.setToast('请输入正确的金额');
			return;
		}
	}	
		
	if(calculate.sub(balance, useBalance) > 0){
		global.setToast('可用余额不足，请先充值');
		return;
	}

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/envelope/buy/check',
		data : {
			values : {
				'amount' : amount * 1000,
				'priceId' : goldPrice.id,
				'goldPrice' : goldPrice.lastPrice,
				'type' : buyWayFlag,
				'money' :balance
			}
		}
	}, function(ret, err) {
		if(ret && ret.success){
			api.openFrame({
			    name: 'checkPayPwdFrame',
			    url: '../member/payPasswordFrame.html',
			    rect: {
			        x: 0,
			        y: 0
			    },
			    pageParam: {
			    	payMoney: balance,
			    	intervalTime:30,
			    	optSrc:'buyRedgold'
			    },
		        bgColor:'rgba(255, 255, 255, 0)'
			});

			initPayTimer('intervalSpan', 30);
		} else {
			global.setToast(ret.message);
		}

	});

	
}

function buy(){

	var amount = $api.val($api.byId('amount'));
	var balance = $api.val($api.byId('formatBalance'));
		
	if (validate.isEmpty(payPwd)) {
		global.setToast('交易密码不能为空');
		return;
	}

	//$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/envelope/buy',
		data : {
			values : {
				'priceId' : goldPrice.id,
				'goldPrice' : goldPrice.lastPrice,
				'amount' : amount * 1000,
				'payPwd' : payPwd,
				'type' : buyWayFlag,
				'money' :balance
			}
		}
	}, function(ret, err) {
		showGoldPrice();
		if(ret){
			if(ret.success){
				switchTo();

				global.refreshAsset();
				global.setToast('购买成功');
				setTimeout("api.closeWin();", 2000);
            }else{
            	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
            	global.setToast(ret.message);
            }
		}else{
			$api.removeAttr($api.byId('confirmBtn'), 'disabled');
			global.setToast('购买失败');
		}

	});
}

function agreement(){
	var agree = $api.byId('argeeId');
	if(agreementFlag){
		$api.removeCls($api.byId('argeeId'), 'current');
		agreementFlag = false;

	}else{
		$api.addCls($api.byId('argeeId'), 'current');
		agreementFlag = true;
	}
}

function recharge(){
	var params = { "page" : "../member/recharge", "title" : "充值" };
	global.openWinName('rechargeWin', '../common/custom_header', params);
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', '../common/header', params);
}

function openAgreement(){
	var params = { "page" : "../statics/buyRedProtocol", "title" : "红包金购买协议"};
	global.openWinName('activeProtocolSubWin', '../common/header', params);
}

function openOrderList(){
	var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1 };
	global.openWinName('orderListHeader', '../member/orderListHeader', params);
}

function switchToBuyWay(){
		
	if(buyWayFlag==1){

		$api.html($api.byId('switchToBuyWayStrId'), '按克重买');

		$api.addCls($api.byId('amount'), 'hide');
		$api.removeCls($api.byId('money'), 'hide');

		$api.html($api.byId('balanceType'), '克');	
		$api.html($api.byId('balanceStr'), '购买克重：');
		
		buyWayFlag =2;
	}else if(buyWayFlag==2){

		$api.html($api.byId('switchToBuyWayStrId'), '按金额买');

		$api.removeCls($api.byId('amount'), 'hide');
		$api.addCls($api.byId('money'), 'hide');

		$api.html($api.byId('balanceType'), '元');
		$api.html($api.byId('balanceStr'), '预计金额：');
		
		buyWayFlag =1;		
	}

	switchTo();
}

function switchTo(){
	$api.val($api.byId('amount'),'');
	$api.val($api.byId('money'),'');
	$api.html($api.byId('balance'), '0.00');	
	$api.val($api.byId('formatBalance'), 0);

	$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');

}

function computeMoney(){
	var money = $api.val($api.byId('money'));
	var amountT = calculate.div(money, goldPrice.lastPrice);
	
	var num = amountT.toString();
	if(num.lastIndexOf('.') !== -1){
		num = num.substr(0, eval(num.lastIndexOf('.') + (3 + 1)));
		num = window.parseFloat(num).toString();
	}
	$api.val($api.byId('amount'), num);
	$api.html($api.byId('balance'), global.formatNumber(amountT, 3));

	computeBalance();
}


function computeBalance(){
	var amount = $api.val($api.byId('amount'));

	if(buyWayFlag==1){
		var balance = global.formatCarry(calculate.mul(amount, goldPrice.lastPrice));

		$api.html($api.byId('balance'), global.formatNumber(balance, 2));
		$api.val($api.byId('formatBalance'), balance);

		if(amount >0){
			$api.removeAttr($api.byId('submitBtn'), 'disabled');
		}else {
			$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');
		}
	}else if(buyWayFlag==2){

		var money = $api.val($api.byId('money'));
		var amountT = calculate.div(money, goldPrice.lastPrice);

		var num = amountT.toString();
		if(num.lastIndexOf('.') !== -1){
			num = num.substr(0, eval(num.lastIndexOf('.') + (3 + 1)));
			num = window.parseFloat(num).toString();
		}
		$api.val($api.byId('amount'), num);
		$api.html($api.byId('balance'), global.formatNumber(amountT, 3));
		$api.val($api.byId('formatBalance'), money);
	
		if (validate.isEmpty(money)) {
			$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');
		}else{
			$api.removeAttr($api.byId('submitBtn'), 'disabled');
		}	
	}
}

function allBuyGold(){

	if(buyWayFlag==1){
		var amountT = calculate.div(useBalance, goldPrice.lastPrice);
		$api.val($api.byId('amount'),global.substrDecimal(amountT,3));
		computeBalance();
	}else if(buyWayFlag==2){
		$api.val($api.byId('money'), useBalance);
		computeMoney();
	}
}