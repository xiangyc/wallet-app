var id;
var preOrderId = 0;
var goldPrice;
var goldPriceFlag = false;
var useBalance = 0;
var agreementFlag = true;
var couponAmount = 0;
var couponIds = '';
var couponCount = 0;
var rushPurchase = false;
var buyWayFlag = 1;//购买方式 默认1是克重，2是金额购买
var payPwd = '';//支付密码

apiready = function() {
	id = api.pageParam.id;
	profitRate = api.pageParam.profitRate;
	rushPurchase = api.pageParam.rushPurchase;
	$api.html($api.byId('startTime'), global.formatDate(new Date().getTime(), 'yyyy-MM-dd'));
	$api.html($api.byId('profitRate'), profitRate + '%');

	initEvent();
	loadUseBalance();
	//showGoldPrice();
	goldPrice = { "lastPrice" : api.pageParam.lastPrice, "id" : api.pageParam.priceId };
	$api.html($api.byId('lastPrice'), goldPrice.lastPrice);
	showCoupon();
	//initPayTimer('intervalEm', 300);
	window.setInterval("refresh();", 5000);

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
        if(!document.getElementById("amount").focus()){
            event.preventDefault();
        }
    }, false);
}

function initEvent(){
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
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	loadUseBalance();
    });

    api.addEventListener({
	    name:'selectCouponSuccess'
    },function(ret,err){
    	if(ret && ret.value){
    		loadSelectCoupon(ret.value.initPrice,ret.value.price,ret.value.incomeMoney, ret.value.names);
    		couponIds = ret.value.ids;
    		api.closeWin({
					name: 'selectCouponWin'
			});
    	}
    });

    api.addEventListener({
	    name:'timeOutEvent'
    },function(ret,err){
    	preOrderId = 0;    	
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
		computeBalance();
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

function refresh(){	
	api.sendEvent({
	    name:'goldPriceRefresh'
    });

    goldPriceFlag = true;
}

function computeBalance(){
	var amount = $api.val($api.byId('amount'));

	if(amount >= 0.001){
		//$api.html($api.byId('balance'), global.formatNumber(calculate.mul(amount, goldPrice.lastPrice),2));
		//$api.html($api.byId('payAmount'), $api.html($api.byId('balance')));

		if(buyWayFlag==1){

			var balance = global.formatCeil(calculate.mul(amount, goldPrice.lastPrice));
			//alert(calculate.mul(amount, goldPrice.lastPrice) + '----' + balance);
			$api.html($api.byId('balance'), global.formatNumber(balance, 2));
			$api.html($api.byId('payAmount'), $api.html($api.byId('balance')));
		}else if(buyWayFlag==2){
			//$api.html($api.byId('balance'), amount);
			var money = $api.val($api.byId('money'));
			var amountT = calculate.div(money, goldPrice.lastPrice);
			$api.html($api.byId('balance'), global.formatNumber(amountT, 3));

			$api.html($api.byId('payAmount'), $api.val($api.byId('money')));

			$api.html($api.byId('realityBalance'), $api.val($api.byId('money')));
		}

	}else{
		$api.html($api.byId('balance'), '0.00');
	}

	couponAmount = 0
	$api.html($api.byId('couponEm'), '');
	$api.addCls($api.byId('couponEm'), 'hide');

	$api.addCls($api.byId('realityCouponEm'), 'hide');

	showCoupon();
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
//
//		$api.removeCls($api.byId('carryonDiv'), 'hide');
//  	$api.addCls($api.byId('overtimedDiv'), 'hide');
//	}else{
//		$api.addCls($api.byId('submitDiv'), 'hide');
//		$api.addCls($api.byId('submitDropDiv'), 'hide');
//		$api.val($api.byId('password'), '');
//		preOrderId = 0;
//
//		$api.addCls($api.byId('carryonDiv'), 'hide');
//  	$api.removeCls($api.byId('overtimedDiv'), 'hide');
//	}
	
	preOrderId = 0;
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
		if (!validate.buyNumber(amount)) {
			global.setToast('无效的买入克重');
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
	if(!amount){
		amount =0;
	}

	var balance = calculate.mul(amount, goldPrice.lastPrice);
	if(couponAmount && couponAmount > 0){
		balance = calculate.sub(balance, couponAmount);
	}
	if(calculate.sub(balance, useBalance) > 0){
		global.setToast('可用余额不足，请先充值');
		return;
	}

	//$api.html($api.byId('payAmount'), global.formatNumber(balance, 2));
	$api.removeAttr($api.byId('submitBtn'), 'onclick');
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
				'isWithdraw' : 1
			}
		}
	}, function(ret, err) {
	//console.log(JSON.stringify(ret));
		if(ret){
			if(ret.success){
				
//				$api.removeCls($api.byId('submitDiv'), 'hide');
//				$api.removeCls($api.byId('submitDropDiv'), 'hide');
//
//				$api.removeCls($api.byId('carryonDiv'), 'hide');
//  			$api.addCls($api.byId('overtimedDiv'), 'hide');
//				
//				initPayTimer('intervalSpan', 30);
				
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
				    	payMoney: showMoney,
				    	intervalTime:30,
				    	optSrc:'buyActive'
				    },
	                bgColor:'rgba(255, 255, 255, 0)'
				});				

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
		if (validate.isEmpty(password)) {
			global.setToast('交易密码不能为空');
			return;
		}

		//password = new Base64().encode(password);
		//$api.removeAttr($api.byId('confirmBtn'), 'onclick');
		$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');

		api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/investment-orders/current',
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
					$api.val($api.byId('password'), '');
					$api.html($api.byId('balance'), '0.00');
					$api.val($api.byId('amount'), '');
					$api.val($api.byId('money'), '');
					

					$api.html($api.byId('realityBalance'), '0.00');
					$api.addCls($api.byId('realityCouponEm'), 'hide');

					showSubmit();

					global.refreshAsset();

					api.confirm({
						title : '提示',
						msg : '订单提交成功',
						buttons : ['关闭', '查看订单']
				    },function(ret,err){
						if (ret.buttonIndex === 2) {
							openOrderList();
						}else{
							api.closeToWin({
								name:"root"
							});
						}
				    });
                }else{
                	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
                	
                	if(ret.code && ret.code ==1102){
						pwdErrInput();
						
						$api.html($api.byId('errPwdInfo'), ret.message);	            		
					}else {	            	
						global.setToast(ret.message);
					}
	
                }
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

function recharge(){
	var params = { "page" : "../member/recharge", "title" : "充值" };
	global.openWinName('rechargeWin', './common/custom_header', params);
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', './common/header', params);
}

function errOpenPayPassword(){	
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
	$api.addCls($api.byId('errPwdDiv'), 'hide');
	$api.addCls($api.byId('pwdDropDiv'), 'hide');
}

function openAgreement(){
	var params = { "page" : "../statics/buyActiveProtocol", "title" : "随心金购买协议"};
	global.openWinName('activeProtocolSubWin', './common/header', params);
}

function openOrderList(){
	var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1 };
	global.openWinName('orderListHeader', './member/orderListHeader', params);
}

function showCoupon(){
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
					$api.html($api.byId('couponSpan'), couponCount + '张可用优惠券');
					$api.setStorage('coupon', ret);
				}
			}else{
				$api.html($api.byId('couponSpan'), '暂无可用优惠券');
				couponCount = 0;
			}
	});

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
			global.setToast('买入克重不能为空');
			return;
		}
		if (!validate.buyNumber(amount)) {
			global.setToast('无效的买入克重');
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

	var params = { "page" : "../member/selectCoupon", "title" : title,"id" :id,"originalPrice" : originalPrice,"couponIds":couponIds,"amount":amount};
	global.openWinName('selectCouponWin', './common/header', params);
}

function loadSelectCoupon(initPrice,price,incomeMoney, names){
	if(incomeMoney && incomeMoney > 0){
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
		$api.html($api.byId('income'), global.formatNumber(incomeMoney, 2));
	}else{
		computeBalance();
	}
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
	$api.html($api.byId('income'), '0.00');
	$api.addCls($api.byId('couponEm'), 'hide');
	showCoupon();
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

	computeBalance();
}
