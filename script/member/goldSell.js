var goldPrice;
var goldPriceFlag = false;
var amount;
var fee;
var totalGoldAmount;
var header = "../common/header";
var payPasswordWinName = "payPasswordWin";
var token = "";
var bindCardWinName="bindCardWin";
var preOrderId = 0;
var src = 1;//1.黄金账户   2：红包黄金账户

var totalSellMoney;

var payPwd;
var timeoutFlag = false;//超时标志 

apiready = function() {
	initEvent();
	showGoldPrice();
	
	src = api.pageParam.src;
	
	if(src === 2){
		$api.removeCls($api.byId('goldTipDiv'), 'hide');
		$api.html($api.byId('redOrSui'), '红包金');
		showGoldRedpacket();
	}else{
		$api.removeCls($api.byId('activeTipDiv'), 'hide');
		showTotalGoldAmount();
	}
	//initPayTimer('intervalEm', 300);
	window.setInterval("refresh();", 5000);
    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('submitDiv'), 'hide')){
            event.preventDefault();
        }
    }, false);

    document.body.addEventListener('touchmove', function (event) {
        if(!document.getElementById("amount").focus()){
            event.preventDefault();
        }
    }, false);



}

function initEvent(){
	
	api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {  
    	showGoldPrice(); 
        
    });

	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
    	if(ret && ret.value && goldPriceFlag && preOrderId === 0){
    		//initPayTimer('intervalEm', 300);
    		showGoldPrice();
		}

		goldPriceFlag = false;
    });

    api.addEventListener({
	    name:'goldAccountRefreshSuccess'
    },function(ret,err){
    	if(src !== 2){
    		showTotalGoldAmount();
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
		name : 'userBindCardRefresh'
	}, function(ret, err) {
		if(global.getUserPayPassword() === '1'){
			api.closeWin({
				name : bindCardWinName
			});
		}
	});
	
	api.addEventListener({
	    name:'getGoldAccountDataRefreshSuccess'
    },function(ret,err){
    	if(ret ){
    		if(src === 2){
    			showGoldRedpacket();
    		}
		}
    });

    api.addEventListener({
	    name:'checkPayPwdSuccessEvent'
    },function(ret,err){
    	api.closeFrame({
    		name: 'checkPayPwdFrame'
        });
		if(ret && ret.value){
			
			payPwd = ret.value.payPwd;
			sell();
		}
    });

    api.addEventListener({
	    name:'timeOutEvent'
    },function(ret,err){
    	//showGoldPrice();
    	timeoutFlag = true;

    	$api.addCls($api.byId('carryonDiv'), 'hide');
    	$api.removeCls($api.byId('overtimedDiv'), 'hide');
    });

    api.addEventListener({
	    name:'closePwdFrameEvent'
    },function(ret,err){
    	
    	if(timeoutFlag){
			showGoldPrice();

			timeoutFlag = false;
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
		$api.html($api.byId('lastPrice'), global.formatNumber(goldPrice.lastPrice, 2));
		computeFee();
	}
}

function showTotalGoldAmount(){
	var goldAccountResult = $api.getStorage("goldAccountResult");

	if(goldAccountResult){
		totalGoldAmount = goldAccountResult.activeBalance;
		$api.html($api.byId('totalGoldAmount'), global.formatNumber(totalGoldAmount, 3));
	}
}

function showGoldRedpacket(){
	var goldAccountResult = $api.getStorage("getGoldAccountDataResult");
	if (goldAccountResult) {
		totalGoldAmount = goldAccountResult.envelopeAmount;
		$api.html($api.byId('totalGoldAmount'), global.formatNumber(totalGoldAmount,3));
	} else {
		api.sendEvent({
            name: 'getGoldAccountDataRefresh'
        });
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

function computeFee(){
	amount = $api.val($api.byId('amount'));
	if(amount >= 0.001){
		fee = global.substrDecimal(calculate.mul(amount, 0.7), 2);
		if(fee < 0.01){
			fee = 0.01;
		}
		
		totalSellMoney = global.formatNumber(calculate.sub(calculate.mul(amount, goldPrice.lastPrice), fee),2);

		$api.html($api.byId('fee'), global.formatNumber(fee,2));
		$api.html($api.byId('totalMoney'), totalSellMoney);
		$api.html($api.byId('messageEm'), '已扣除' +  global.formatNumber(fee,2) + '元手续费');
		$api.removeCls($api.byId('messageEm'), 'hide');
		$api.html($api.byId('payAmount'), $api.html($api.byId('totalMoney')));
	}else{
		fee = 0;
		$api.html($api.byId('fee'), '0.00');
		$api.html($api.byId('totalMoney'), '0.00');
		$api.html($api.byId('messageEm'), '');
		$api.addCls($api.byId('messageEm'), 'hide');
	}
}

function showSubmit(){
	if($api.hasCls($api.byId('submitDiv'), 'hide')){
		$api.removeCls($api.byId('submitDiv'), 'hide');
		$api.removeCls($api.byId('submitDropDiv'), 'hide');

		$api.removeCls($api.byId('carryonDiv'), 'hide');
    	$api.addCls($api.byId('overtimedDiv'), 'hide');	
	
	}else{
		$api.addCls($api.byId('submitDiv'), 'hide');
		$api.addCls($api.byId('submitDropDiv'), 'hide');
		$api.val($api.byId('password'), '');
		preOrderId = 0;

		$api.addCls($api.byId('carryonDiv'), 'hide');
    	$api.removeCls($api.byId('overtimedDiv'), 'hide');
	}
}

function submitOrder(){
	amount = $api.val($api.byId('amount'));

	if (validate.isEmpty(amount)) {
		global.setToast('卖出克重不能为空');
		return;
	}
	if (!validate.buyNumber(amount)) {
		global.setToast('无效的卖出克重');
		return;
	}
	
	if(amount <=0){
		global.setToast('无效的卖出克重');
		return;
	}

	if(amount > totalGoldAmount){
		global.setToast('可卖出黄金不足');
		return;
	}
	
	//实名
	if(!global.getUserIdCard()){
		params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1  };
		header = "../common/custom_header";
		return global.validIdCardTooltip(bindCardWinName, header, params);
	}
	//绑卡
	if(global.getUserBindCard() === '0'){
		params = { "page" : "../member/bindNewBankCard", "title" : "绑定银行卡" };
		header = "../common/custom_header";
		return global.validBindCardTooltip(bindCardWinName, header, params);
	}
	//交易密码
	if(global.getUserPayPassword() === '0'){
		params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
		return global.validPayPasswordTooltip(bindCardWinName, header, params);
	}

	$api.removeAttr($api.byId('submitBtn'), 'onclick');
	$api.removeCls($api.byId('carryonDiv'), 'hide');
	$api.addCls($api.byId('overtimedDiv'), 'hide');
	//initPayTimer('intervalSpan', 30);
	if(src === 2){
		var payMoney = global.formatNumber(calculate.sub(calculate.mul(amount, goldPrice.lastPrice), fee), 2);

		api.openFrame({
		    name: 'checkPayPwdFrame',
		    url: 'payPasswordFrame.html',
		    rect: {
		        x: 0,
		        y: 0
		    },
		    pageParam: {
		    	payMoney: payMoney,
		    	intervalTime:30,
		    	optSrc:'goldsell'
		    },
            bgColor:'rgba(255, 255, 255, 0)'
		});
    	
		preOrderId = 1;
	}else{
		api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/sell-orders/check/sellquota?amount=' + amount
		}, function(ret, err) {
			if(ret){
				if(ret.success){
					token = ret.code;
					var payMoney = global.formatNumber(calculate.sub(calculate.mul(amount, goldPrice.lastPrice), fee), 2);

					api.openFrame({
					    name: 'checkPayPwdFrame',
					    url: 'payPasswordFrame.html',
					    rect: {
					        x: 0,
					        y: 0
					    },
					    pageParam: {
					    	payMoney: payMoney,
					    	intervalTime:30,
					    	optSrc:'goldsell'
					    },
		                bgColor:'rgba(255, 255, 255, 0)'
					});

					
					preOrderId = 1;
					//initPayTimer('intervalSpan', 30);
	            }else{
	            	global.setToast(ret.message);
	            }
			}else{
				global.setToast('订单提交失败');
			}
			$api.attr($api.byId('submitBtn'), 'onclick', 'sell();')
		});
	}
}

function sell(){
	//var password = $api.val($api.byId('password'));

	if (validate.isEmpty(amount)) {
		global.setToast('卖出克重不能为空');
		return;
	}
	if (!validate.buyNumber(amount)) {
		global.setToast('无效的卖出克重');
		return;
	}
	if (validate.isEmpty(payPwd)) {
		global.setToast('交易密码不能为空');
		return;
	}
	if (eval(payInterval < 1)) {
		global.setToast('已超时，请重新提交订单');
		return;
	}

	if(src === 2){
		$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
		api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/envelope/sell',
			data : {
				values : {
					'amount' : amount,
					'goldPrice' : goldPrice.lastPrice,
					'priceId' : goldPrice.id,
					'payPwd' : payPwd
				}
			}
		}, function(ret, err) {
			if(ret){
				if(ret.success){
					$api.val($api.byId('password'), '');
					$api.val($api.byId('amount'), '');
					$api.html($api.byId('fee'), '0.00');
					$api.html($api.byId('totalMoney'), '0.00');
					$api.addCls($api.byId('messageEm'), 'hide');
					
					preOrderId = 0;
					//showSubmit();
	
					global.refreshAsset();
					global.setToast('卖金成功');
					setTimeout("api.closeWin();", 2000);
	            }else{
	            	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
	            	global.setToast(ret.message);
	            	if(ret.code && ret.code == '1400'){
	            		showGoldPrice();
	            	}
	            }
			}else{
				$api.removeAttr($api.byId('confirmBtn'), 'disabled');
				global.setToast('卖金失败');
			}
			
		});
	}else{

		$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
	
		api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/gold-accounts/sell',
			data : {
				values : {
					'amount' : amount,
					'goldPrice' : goldPrice.lastPrice,
					'priceLogId' : goldPrice.id,
					'payPwd' : payPwd,
					'reqToken' : token
				}
			}
		}, function(ret, err) {
			if(ret){
				if(ret.success){
					$api.val($api.byId('password'), '');
					$api.val($api.byId('amount'), '');
					$api.html($api.byId('fee'), '0.00');
					$api.html($api.byId('totalMoney'), '0.00');
					$api.addCls($api.byId('messageEm'), 'hide');
					
					preOrderId = 0;
	
					global.refreshAsset();

					var url= global.getH5url() + '/html/system/goldSellSuccess.html' +'?money='+totalSellMoney+'&amount='+amount;

					global.openHybridWin("goldSuccessWin", "../common/adv_header", url, "卖金成功", 1, '');

	            }else{
	            	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
	            	global.setToast(ret.message);
	            	if(ret.code && ret.code == '1400'){
	            		showGoldPrice();
	            	}
	            }
			}else{
				$api.removeAttr($api.byId('confirmBtn'), 'disabled');
				global.setToast('订单提交失败');
			}
			
		});
	}
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', header, params);
}

function recharge(){
	var params = { "page" : "../member/recharge", "title" : "充值" };
	header = "../common/custom_header";
	global.openWinName('rechargeWin', header, params);
}

function openOrderList(){
	var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1, "optSrc" : 'sellActiveGold'  };
	global.openWinName('orderListHeader', '../member/orderListHeader', params);
}

// 全部卖出红包金
function allRedSell(){
	$api.val($api.byId('amount'),totalGoldAmount);
	computeFee();
}