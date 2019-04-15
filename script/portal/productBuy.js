var id;
var period;
var profitRate;
var periodUnit;
var preOrderId;
var goldPrice;
var goldPriceFlag = false;
var useBalance = 0;
var header = './common/header';
var couponAmount = 0;
var couponIds = '';
var couponCount = 0;
var agreementFlag = true;
var rushPurchase = false;
var canUseCoupon = true;
var buyWayFlag = 1;//购买方式 默认1是克重，2是金额购买
var comeType = 0;	//0：还本付息，1：提金
var categoryId = 0;
var pwdFlag =1 ; //1=交易密码输入正确 2=交易密码输入错误
var payPwd = '';//支付密码

apiready = function() {
	id = api.pageParam.id;
	period = api.pageParam.period;
	profitRate = api.pageParam.profitRate;
	rushPurchase = api.pageParam.rushPurchase;
	canUseCoupon = api.pageParam.canUseCoupon;
	categoryId = api.pageParam.categoryId;

	if(categoryId === 3){
		$api.addCls($api.byId('comeItemDiv'), 'hide');
		$api.addCls($api.byId('incomeListUl'), 'hide');
		$api.addCls($api.byId('incomePlandiv'), 'hide');
		$api.addCls($api.byId('couponDiv'), 'hide');
		$api.removeCls($api.byId('dayDiv'), 'hide');
		$api.removeCls($api.byId('dayIncomeDiv'), 'hide');

		period = 1;
		$api.attr($api.byId('amount'), 'placeholder', '1毫克起购');
	}else{		
		$api.removeCls($api.byId('periodDiv'), 'hide');
	}
	if(api.pageParam.reward){
		profitRate = profitRate + api.pageParam.reward;
	}

	periodUnit = api.pageParam.periodUnit;

	var endTime;
	if(periodUnit === 3){
		$api.html($api.byId('startTime'), global.formatDate(new Date().getTime(), 'yyyy-MM-dd'));
		endTime = global.formatDate(new Date().getTime() + eval(1000*60*60 + 1000*60*period), 'yyyy-MM-dd');
	}else{
		$api.html($api.byId('startTime'), global.formatDate(new Date().getTime() + 1000*60*60*24, 'yyyy-MM-dd'));
		endTime = global.formatDate(new Date().getTime() + eval(1000*60*60*24*period), 'yyyy-MM-dd');
	}
	$api.html($api.byId('endTime'), endTime);

	initEvent();
	loadUseBalance();
	showGoldPrice();
	initPayTimer('intervalEm', 300);
	window.setInterval("refresh();", 300000);

	switchToBuyWay();

    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('submitDiv'), 'hide')){
            event.preventDefault();
        }
    }, false);

    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('messageDiv'), 'hide')){
            event.preventDefault();
        }
    }, false);

    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('comeDiv'), 'hide')){
            event.preventDefault();
        }
    }, false);

//  document.body.addEventListener('touchmove', function (event) {
//      if(!document.getElementById("amount").focus()){
//          event.preventDefault();
//      }
//  }, false);

}

function initEvent(){
	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
    	if(ret && ret.value && goldPriceFlag){
    		initPayTimer('intervalEm', 300);
			showGoldPrice();
		}

		goldPriceFlag = false;
    });

    api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	loadUseBalance();
    });

    api.addEventListener({
	    name:'selectCouponSuccess'
    },function(ret,err){
    	if(ret && ret.value){
    	    couponIds = ret.value.ids;
    		loadSelectCoupon(ret.value.initPrice,ret.value.price,ret.value.incomeMoney, ret.value.names);

    		api.closeWin({
					name: 'selectCouponWin'
			});
    	}
    });
    
    api.addEventListener({
	    name:'timeOutEvent'
    },function(ret,err){
    	pwdFlag =1 ;
    	showGoldPrice();
    });
    
    api.addEventListener({
	    name:'closeRechargeEvent'
    },function(ret,err){

    	api.closeWin({
			name: 'rechargeWin'
		});
		
		api.closeWin({
			name: 'rechargeSuccessWin'
		});			
    });
    
    api.addEventListener({
	    name:'checkPayPwdSuccessEvent'
    },function(ret,err){
    	api.closeFrame({
    		name: 'checkPayPwdFrame'
        });
		if(ret && ret.value){
			
			payPwd = ret.value.payPwd;
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
		computeBalance(true);
		if(preOrderId){
		
			submitOrder();
		}
	}
}

function loadUseBalance(){
	var financeAccount = $api.getStorage("financeAccountResult");

	if(financeAccount) {
		useBalance = financeAccount.useBalance;
		$api.html($api.byId('useBalance'), global.formatNumber(useBalance, 2));
	}
}


function computeBalance(refreshCoupon){
	var amount = $api.val($api.byId('amount'));
	var income = 0.00;
	couponAmount = 0;

	if(refreshCoupon){
		showCoupon();
	}

	if (amount < 1 && categoryId !== 3) {
		if(buyWayFlag==1){
			$api.html($api.byId('balance'), '0.00');
		}
		$api.html($api.byId('couponEm'), '0.00');
		
		
		$api.removeCls($api.byId('noIncome1'), 'hide');
		$api.addCls($api.byId('noIncome2'), 'hide');
		$api.html($api.byId('income'), '0.00');

		$api.addCls($api.byId('couponEm'), 'hide');
		$api.html($api.byId('realityBalance'), '0.00');
		$api.addCls($api.byId('realityCouponEm'), 'hide');

		$api.html($api.byId('incomeListUl'), '<li><span>回款日期</span><span>购金款及赠金（元）</span></li>');
		return;
	}

	if(buyWayFlag==1){
		var balance = global.formatCeil(calculate.mul(amount, goldPrice.lastPrice));

		$api.html($api.byId('balance'), global.formatNumber(balance, 2));
		$api.html($api.byId('payAmount'), $api.html($api.byId('balance')));
	}else if(buyWayFlag==2){

		var money = $api.val($api.byId('money'));
		var amountT = calculate.div(money, goldPrice.lastPrice);

		$api.html($api.byId('balance'), global.formatNumber(amountT, 3));

		$api.html($api.byId('payAmount'), $api.val($api.byId('money')));
	}

	if($api.val($api.byId('money'))){
		$api.html($api.byId('realityBalance'), $api.val($api.byId('money')));
	}else{
		$api.html($api.byId('realityBalance'), '0.00');
	}

	var incomeTmp = 0.0;
	if(periodUnit === 3){
		if(buyWayFlag==1){
			incomeTmp = (global.formatCarry(amount * goldPrice.lastPrice) * profitRate/100/365 * period)/24;
			income = global.formatNumber(eval(incomeTmp), 2);
		}else if(buyWayFlag==2){
			incomeTmp = ($api.val($api.byId('money')) * profitRate/100/365 * period)/24;
			income = global.formatNumber(eval(incomeTmp), 2);
		}
	}else{
		if(buyWayFlag==1){
			incomeTmp = global.formatCarry(amount * goldPrice.lastPrice) * profitRate/100/365 * period;
			income = global.formatNumber(eval(incomeTmp), 2);
		}else if(buyWayFlag==2){
			incomeTmp = $api.val($api.byId('money')) * profitRate/100/365 * period;
			income = global.formatNumber(eval(incomeTmp), 2);
		}
	}

	if(incomeTmp <0.01){
		$api.addCls($api.byId('noIncome1'), 'hide');
		$api.removeCls($api.byId('noIncome2'), 'hide');
	}else{
		$api.addCls($api.byId('noIncome2'), 'hide');
		$api.removeCls($api.byId('noIncome1'), 'hide');
		$api.html($api.byId('income'), income);
	}

	$api.html($api.byId('couponEm'), '');
	$api.addCls($api.byId('couponEm'), 'hide');

	$api.html($api.byId('realityCouponEm'), '');
	$api.addCls($api.byId('realityCouponEm'), 'hide');

	buildIncomePlan();
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

function showSubmit(){
//	if($api.hasCls($api.byId('submitDiv'), 'hide')){
//		$api.removeCls($api.byId('submitDiv'), 'hide');
//		$api.removeCls($api.byId('submitDropDiv'), 'hide');
//	}else{
//		$api.addCls($api.byId('submitDiv'), 'hide');
//		$api.addCls($api.byId('submitDropDiv'), 'hide');
//		$api.val($api.byId('password'), '');
//		preOrderId = '';
//	}
	
	preOrderId = '';
}

function submitOrder(){
	if(!goldPrice){
		global.setToast('数据加载中，请稍后');
		return;
	}

	var amount = $api.val($api.byId('amount'));
	var money = $api.val($api.byId('money'));

	if(!agreementFlag){
		global.setToast('请同意购买黄金租赁服务协议');
		return;
	}

	if(buyWayFlag==1){
		if (validate.isEmpty(amount)) {
			global.setToast('买入克重不能为空');
			return;
		}
		if (!validate.buyNumber(amount) || amount < 0.001) {
			global.setToast('买入克重无效');
			return;
		}
		if(amount < 0.001){
			global.setToast('天天金1毫克起购');
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

		if(calculate.sub(money * 1000, goldPrice.lastPrice) < 0){
			global.setToast('天天金1毫克起购');
			return;
		}		

	}

	
	perBuy(amount, money);
//	if(couponCount > 0 && couponIds.length === 0){
//		api.confirm({
//			title : '提示',
//			msg : '您有可用优惠券，确认不使用？',
//			buttons : ['去选择', '不使用']
//	    },function(ret,err){
//			if (ret.buttonIndex === 1) {
//				selectCoupon();
//			}else{
//				perBuy(amount, money);
//			}
//		});
//	}else{
//		perBuy(amount, money);
//	}
}

function perBuy(amount, money){
	var balance = calculate.mul(amount, goldPrice.lastPrice);
	if(couponAmount && couponAmount > 0){
		balance = calculate.sub(balance, couponAmount);
	}
	if(calculate.sub(balance, useBalance) > 0){
		global.setToast('可用余额不足，请先充值');
		return;
	}
	if(!amount){
		amount =0;
	}

	$api.removeAttr($api.byId('submitBtn'), 'onclick');
	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/pre-products',
		data : {
			values : {
				'priceId' : goldPrice.id,
				'goldPrice' : goldPrice.lastPrice,
				'amount' : amount,
				'money' : money,
				'type' : buyWayFlag,
				'productId' : id,
				'couponIds' : couponIds,
				'rushPurchase' : rushPurchase,
				'isWithdraw' : comeType
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){
				if(pwdFlag ==1){
				
						var showMoney = 0;
				
						if(buyWayFlag==1){						
							showMoney = global.formatNumber(global.formatCeil(calculate.mul(amount, goldPrice.lastPrice)), 2);
						}else if(buyWayFlag==2){
							showMoney = money;
						}
				
						api.openFrame({
						    name: 'checkPayPwdFrame',
						    url: './member/payPasswordFrame.html',
						    rect: {
						        x: 0,
						        y: 0
						    },
						    pageParam: {
						    	payMoney: showMoney
						    },
			                bgColor:'rgba(255, 255, 255, 0)'
						});
				
//					$api.removeCls($api.byId('submitDiv'), 'hide');
//					$api.removeCls($api.byId('submitDropDiv'), 'hide');
//
//					document.getElementById('password').focus();
				}
				preOrderId = ret.code;
			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setErrorToast();
		}
		$api.attr($api.byId('submitBtn'), 'onclick', 'submitOrder();');
	});
}

function buy(){
	if(preOrderId){
		//var password = $api.val($api.byId('password'));
		var password = payPwd;
		
		if (validate.isEmpty(payPwd)) {
			global.setToast('交易密码不能为空');
			return;
		}

		//password = new Base64().encode(password);
		//$api.removeAttr($api.byId('confirmBtn'), 'onclick');
		$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');

		var requestUrl = global.getRequestUri() + '/investment-orders/regular';
		if(categoryId === 3){
			requestUrl = global.getRequestUri() + '/investment-orders/order/perdiem';
		}

		api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : requestUrl,
			data : {
				values : {
					'preOrderId' : preOrderId,
					'payPwd' : password,
					'couponIds' : couponIds
				}
			}
		}, function(ret, err) {
			if(ret){
				if(ret.success){
					pwdFlag =1;
					
					$api.val($api.byId('money'), '');
					$api.val($api.byId('password'), '');
					$api.html($api.byId('balance'), '0.00');
					$api.val($api.byId('amount'), '');
					
					$api.removeCls($api.byId('noIncome1'), 'hide');
					$api.addCls($api.byId('noIncome2'), 'hide');
					$api.html($api.byId('income'), '0.00');
					
					$api.addCls($api.byId('couponEm'), 'hide');

					$api.html($api.byId('realityBalance'), '0.00');
					$api.addCls($api.byId('realityCouponEm'), 'hide');				

					showSubmit();

					global.refreshAsset();

					forwardSuccessPage(id, ret.obj);
	            }else{
	            	pwdFlag = 2;
	            	
	            	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
	            	
	            	if(ret.code && ret.code ==1102){
						pwdErrInput();
						
						$api.html($api.byId('errPwdInfo'), ret.message);	            		
					}else {	            	
						global.setToast(ret.message);
					}
	            }

	            showGoldPrice();
			}else{
				$api.removeAttr($api.byId('confirmBtn'), 'disabled');
				global.setToast('订单提交失败');
			}

		});
	}
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
function forwardSuccessPage(productId, orderId){
	var params = { "page" : "../productBuySuccess", "title" : "购买成功", "productId":productId ,"orderId" : orderId };

	global.openWinName('productBuySuccess', header, params);
}

function recharge(){
	var params = { "page" : "../member/recharge", "title" : "充值" };
	header = './common/custom_header';
	global.openWinName('rechargeWin', header, params);
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', header, params);
}

function errOpenPayPassword(){	
	pwdFlag = 1;
	$api.addCls($api.byId('errPwdDiv'), 'hide');
	$api.addCls($api.byId('pwdDropDiv'), 'hide');
	
	openPayPassword();
}

function reInputPwd(){
	$api.removeCls($api.byId('submitDiv'), 'hide');
	$api.removeCls($api.byId('submitDropDiv'), 'hide');
	$api.val($api.byId('password'), '');
	
	$api.addCls($api.byId('errPwdDiv'), 'hide');
	$api.addCls($api.byId('pwdDropDiv'), 'hide');
}

function pwdErrInput(){

	$api.addCls($api.byId('submitDiv'), 'hide');
	$api.addCls($api.byId('submitDropDiv'), 'hide');
	$api.val($api.byId('password'), '');
	
	$api.removeCls($api.byId('errPwdDiv'), 'hide');
	$api.removeCls($api.byId('pwdDropDiv'), 'hide');
}

function hiddenErrPwd(){
	pwdFlag = 1;
	$api.addCls($api.byId('errPwdDiv'), 'hide');
	$api.addCls($api.byId('pwdDropDiv'), 'hide');
}

function openAgreement(){
	var params = { "page" : "../statics/buyPeriodProtocol", "title" : "安心金购买协议"};
	if(categoryId ==3){//天天金
		 params = { "page" : "../statics/buyDayProtocol", "title" : "天天金购买协议"};
	}
	
	global.openWinName('periodProtocolSubWin', header, params);
}

function openOrderList(){
	var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1 };
	global.openWinName('orderListHeader', './member/orderListHeader', params);
}

function showCoupon(){
	if(!canUseCoupon){
		$api.html($api.byId('couponSpan'), '暂无可用优惠券');
		return;
	}
	
	var amount = $api.val($api.byId('amount'));
	var originalPrice = 0;

	if(!amount){
		amount = 0;
	}

	originalPrice = calculate.mul(amount, goldPrice.lastPrice);
	api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/coupon-records/new/product/' + id,
			data : {
				values : {
					'amount' : amount,
					'originalPrice' : originalPrice
				}
			}
		}, function(ret, err) {
			couponIds = '';
			if(ret && ret.length > 0){
				if(ret.code && (ret.code =='2119' || ret.code =='2122')){		
					global.setToast(ret.message);
					api.sendEvent({
				   	   name:'invalidTokenEvent'
			    	});
				}else{

					couponCount = ret.length;
					$api.html($api.byId('couponSpan'), couponCount + '张优惠券');
					//$api.setStorage('coupon', ret);
				}
			}else{
				$api.html($api.byId('couponSpan'), '暂无可用优惠券');
				couponCount = 0;
			}
	});

}

function loadSelectCoupon(initPrice,price,incomeMoney, names){
	if(incomeMoney && incomeMoney.length > 0){
		couponAmount = calculate.sub(initPrice,price);
		if(buyWayFlag==1){
			if(couponAmount > 0){
				$api.removeCls($api.byId('couponEm'), 'hide');
			} else {
				$api.addCls($api.byId('couponEm'), 'hide');
			}

			$api.html($api.byId('couponEm'), '已优惠' + global.formatNumber(couponAmount, 2) + '元');
			$api.html($api.byId('balance'), global.formatNumber(price, 2));
			$api.html($api.byId('payAmount'), $api.html($api.byId('balance')));
		}else if(buyWayFlag==2){		
			if(couponAmount > 0){
				$api.removeCls($api.byId('realityCouponEm'), 'hide');
			} else {
				$api.addCls($api.byId('realityCouponEm'), 'hide');
			}	
			$api.html($api.byId('realityCouponEm'), '已优惠' + global.formatNumber(couponAmount, 2) + '元');
			$api.html($api.byId('realityBalance'), global.formatNumber(price, 2));
			$api.html($api.byId('payAmount'), global.formatNumber(price, 2));
		}

		$api.html($api.byId('couponSpan'), names);
		//$api.html($api.byId('income'), global.formatNumber(incomeMoney, 2));
		//填充还款计划
	    $api.html($api.byId('incomeListUl'), '<li><span>回款日期</span><span>购金款及赠金（元）</span></li>');
    	for(var j=0; j<incomeMoney.length; j++){
    		$api.append($api.byId('incomeListUl'), '<li><span>' + global.formatDate(incomeMoney[j].incomeTime, 'yyyy-MM-dd') + '</span><span>' + 
    		global.formatCurrency(calculate.add(incomeMoney[j].incomeMoney,incomeMoney[j].capitalMoney)) + '</span></li>');
    	}
	}else{
		computeBalance(true);
	}
}

function selectCoupon(){
	if(couponCount === 0){
		global.setToast('暂无可用优惠券');
		return;
	}
	var amount = $api.val($api.byId('amount'));
	var title = "选择优惠券";
	var originalPrice = 0;
	if(buyWayFlag==1){
	
		if (validate.isEmpty(amount)) {
			amount = 0;
			title = "查看优惠券";
			global.setToast('请先输入购金克重，再选择优惠券');
			return;
		}
		if (!validate.buyNumber(amount)) {
			global.setToast('买入克重无效');
			return;
		}

		originalPrice = calculate.mul(amount, goldPrice.lastPrice);

	}else if(buyWayFlag==2){
		var money = $api.val($api.byId('money'));
		if (validate.isEmpty(money)) {
			global.setToast('购买金额不能为空');
			return;
		}
		if (!validate.money(money)) {
			global.setToast('请输入正确的金额');
			return;
		}

		originalPrice = money;
	}

	var params = { "page" : "../member/selectCoupon", "title" : title,"id" :id,"originalPrice" : originalPrice,"couponIds":couponIds,"amount":amount , "comeType" : comeType };
	global.openWinName('selectCouponWin', './common/header', params);
}

function switchToBuyWay(){
	if(buyWayFlag==1){
		$api.html($api.byId('buyWayStrId'), '买入金额');
		$api.html($api.byId('switchToBuyWayStrId'), '切换为按克重购买');

		$api.addCls($api.byId('amount'), 'hide');
		$api.removeCls($api.byId('money'), 'hide');

		$api.html($api.byId('balanceStr'), '购买克重');
		$api.html($api.byId('balanceType'), '克');	

		$api.removeCls($api.byId('realityDiv'), 'hide');		

		buyWayFlag =2;
	}else if(buyWayFlag==2){
		$api.html($api.byId('buyWayStrId'), '买入克重');
		$api.html($api.byId('switchToBuyWayStrId'), '切换为按金额购买');

		$api.removeCls($api.byId('amount'), 'hide');
		$api.addCls($api.byId('money'), 'hide');

		$api.html($api.byId('balanceStr'), '付款金额');
		$api.html($api.byId('balanceType'), '元');

		$api.addCls($api.byId('realityDiv'), 'hide');		

		buyWayFlag =1;		
	}

	switchTo();
}

function switchTo(){
	$api.val($api.byId('amount'),'');
	$api.val($api.byId('money'),'');

	$api.html($api.byId('balance'), '0.00');
	$api.html($api.byId('couponEm'), '0.00');

	$api.removeCls($api.byId('noIncome1'), 'hide');
	$api.addCls($api.byId('noIncome2'), 'hide');
	$api.html($api.byId('income'), '0.00');

	$api.addCls($api.byId('couponEm'), 'hide');
	//showCoupon();
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

	computeBalance(true);
}

function buildIncomePlan(){
	var amount = $api.val($api.byId('amount'));
	if(!amount){
		amount = 0;
	}
	var originalPrice = 0;

	if(buyWayFlag == 1){
		originalPrice = calculate.mul(amount, goldPrice.lastPrice);
	}else if(buyWayFlag == 2){
		originalPrice = $api.val($api.byId('money'));
	}
	
	api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/investment-orders/calculate',
			data : {
				values : {
					ids : couponIds,
					productId : id,
					amount : amount,
					originalPrice : originalPrice,
					isWithdraw : comeType
				}
			}
		}, function(ret, err) {
		    //填充还款计划
		    $api.html($api.byId('incomeListUl'), '<li><span>回款日期</span><span>购金款及赠金（元）</span></li>');
		    if(ret.obj && ret.obj.incomeMoney){
		    	for(var j=0; j<ret.obj.incomeMoney.length; j++){
		    		$api.append($api.byId('incomeListUl'), '<li><span>' + global.formatDate(ret.obj.incomeMoney[j].incomeTime, 'yyyy-MM-dd') + '</span><span>' + 
		    		global.formatCurrency(calculate.add(ret.obj.incomeMoney[j].incomeMoney,ret.obj.incomeMoney[j].capitalMoney)) + '</span></li>');
		    	}
		    }
	});
}

function showComeType(){
	if($api.hasCls($api.byId('comeDropDiv'), 'hide')){
		$api.removeCls($api.byId('comeDropDiv'), 'hide');
		$api.removeCls($api.byId('comeDiv'), 'hide');

	}else{
		$api.addCls($api.byId('comeDropDiv'), 'hide');
		$api.addCls($api.byId('comeDiv'), 'hide');
	}
}

function selectComeType(type, text){
	showComeType();
	comeType = type;
	$api.html($api.byId('comeSpan'), text);
	computeBalance(false);
	
	if(type === 0){
		$api.addCls($api.byId('come1Li'), 'mui-selected');
		$api.removeCls($api.byId('come2Li'), 'mui-selected');
	}else{
		$api.removeCls($api.byId('come1Li'), 'mui-selected');
		$api.addCls($api.byId('come2Li'), 'mui-selected');
	}
}