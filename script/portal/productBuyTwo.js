var preOrderId;
var preGoldPrice;//上一页的金价
var useBalance = 0;
var header = './common/header';
var couponAmount = 0;
var couponIds = '';
var couponNames ='';
var couponChoice ='';
var couponCount = 0;
var couponFlag = false;//加载优惠券标志
var couponList ;
var rushPurchase = false;
var canUseCoupon = true;
var buyWayFlag = 1;//购买方式 默认1是克重，2是金额购买
var comeType = 0;	//0：还本付息，1：提金
var intervalTime = 300;

var productId;
var priceId;
var amount;
var money;//money与balance一样了，都是预计金额
var balance;//预计金额
var incomeList;//收益列表
var optSrc;//操作来源 1=合伙人待激活买金
var payPwd = '';
var productName;

apiready = function() {

	periodUnit = api.pageParam.periodUnit;

	productId = api.pageParam.productId;
	priceId = api.pageParam.priceId;
	preGoldPrice = api.pageParam.goldPrice;
	amount = api.pageParam.amount;
	money = api.pageParam.money;
	buyWayFlag = api.pageParam.buyWayFlag;
	comeType = api.pageParam.comeType;
	balance = api.pageParam.balance;
	rushPurchase = api.pageParam.rushPurchase;
	optSrc = api.pageParam.optSrc;
	productName = api.pageParam.title;

	initEvent();
	loadInfo();
	loadUseBalance();
	showGoldPrice();
	showCoupon();


	initPayTimer('intervalEm', intervalTime);
	
}

function initEvent(){

    api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	loadUseBalance();
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
    
    api.addEventListener({
	    name:'timeOutEvent'
    },function(ret,err){
    	api.closeFrame({
    		name: 'checkPayPwdFrame'
        });
		$api.removeCls($api.byId('refreshGoldDiv'), 'hide');
		$api.removeCls($api.byId('refreshGoldDropDiv'), 'hide');
    });
}

function showGoldPrice(){
 	$api.addCls($api.byId('refreshDiv'), 'animation-rotate');
 	//$api.addCls($api.byId('lastPrice'), 'lastprice-ac');
 	setTimeout("$api.removeCls($api.byId('refreshDiv'), 'animation-rotate');", 1000);
 	//setTimeout("$api.removeCls($api.byId('lastPrice'), 'lastprice-ac');", 1000);

 	$api.html($api.byId('lastPrice'), preGoldPrice);

}

function showRefreshDiv(){

	if($api.hasCls($api.byId('refreshGoldDropDiv'), 'hide')){
		$api.removeCls($api.byId('refreshGoldDropDiv'), 'hide');
		$api.removeCls($api.byId('refreshGoldDiv'), 'hide');

		$api.removeCls($api.byId('timeoutInfo2'), 'hide');
		$api.addCls($api.byId('timeoutInfo1'), 'hide');
	}else{
		$api.addCls($api.byId('refreshGoldDropDiv'), 'hide');
		$api.addCls($api.byId('refreshGoldDiv'), 'hide');

		$api.removeCls($api.byId('timeoutInfo1'), 'hide');
		$api.addCls($api.byId('timeoutInfo2'), 'hide');
	}

}

function refreshGold(){

	api.sendEvent({
	    name:'goldPriceBuyRefreshEvent'
    });
}

function loadInfo(){
	if(buyWayFlag ==2){
		$api.html($api.byId('amount'), amount);
		$api.html($api.byId('balance'), balance);

		$api.html($api.byId('orderMoney'), balance);
		
	}else{
		$api.html($api.byId('amount'), amount);
		$api.html($api.byId('balance'), money);	

		$api.html($api.byId('orderMoney'), balance);			
	}
	
}

function loadUseBalance(){
	var financeAccount = $api.getStorage("financeAccountResult");

	if(financeAccount) {
		useBalance = financeAccount.useBalance;
		$api.html($api.byId('useBalance'), global.formatNumber(useBalance, 2));
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
//		
//	}
	preOrderId = '';
}

function submitOrder(){
	if(!couponFlag){
	 	global.setToast('优惠券正在加载中...');
	 	return;
	} 

	if(calculate.sub(balance, useBalance + couponAmount ) > 0){
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
				'priceId' : priceId,
				'goldPrice' : preGoldPrice,
				'amount' : amount,
				'money' : money,
				'type' : buyWayFlag,
				'productId' : productId,
				'couponIds' : couponIds,
				'rushPurchase' : rushPurchase,
				'isWithdraw' : comeType
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){
//				$api.removeCls($api.byId('submitDiv'), 'hide');
//				$api.removeCls($api.byId('submitDropDiv'), 'hide');
//
//				document.getElementById('password').focus();
//				$api.html($api.byId('payAmount'), $api.html($api.byId('orderMoney')));		

				api.openFrame({
				    name: 'checkPayPwdFrame',
				    url: './member/payPasswordFrame.html',
				    rect: {
				        x: 0,
				        y: 0
				    },
				    pageParam: {
				    	payMoney: money - couponAmount
				    },
	                bgColor:'rgba(255, 255, 255, 0)'
				});
			
				preOrderId = ret.code;
			}else{
//				if(ret.code === 1400){
//          		$api.removeCls($api.byId('refreshGoldDiv'), 'hide');
//          		$api.removeCls($api.byId('refreshGoldDropDiv'), 'hide');
//          		return;
//          	}      	
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
		if (validate.isEmpty(payPwd)) {
			global.setToast('交易密码不能为空');
			return;
		}

		api.showProgress({
			title: '订单支付中...',
			modal: false
	    });
    
		var requestUrl = global.getRequestUri() + '/investment-orders/regular';
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
					'payPwd' : payPwd,
					'couponIds' : couponIds
				}
			}
		}, function(ret, err) {
			//showGoldPrice();
			api.hideProgress();
			if(ret){
				if(ret.success){
					$api.html($api.byId('balance'), '0.00');
					$api.html($api.byId('amount'), '');

					showSubmit();

					global.refreshAsset();

					api.sendEvent({
	                 	name:'webActivityFreshFrameEvent'
              		});

					if(optSrc && optSrc ==1){
						api.sendEvent({
		                 	name:'activationOrganizationBuyGoldEvent'
	              		});

						global.setOrgActivationStatus(1);
					}

					forwardSuccessPage(productId, ret.obj);
	            }else{
//	            	if(ret.code === 1400){
//	            		$api.removeCls($api.byId('refreshGoldDiv'), 'hide');
//	            		$api.removeCls($api.byId('refreshGoldDropDiv'), 'hide');
//	            		return;
//	            	}      	         	
	            	global.setToast(ret.message);
	            }
			}else{
				$api.removeAttr($api.byId('confirmBtn'), 'disabled');
				global.setToast('订单提交失败');
			}
		});
	}
}

function forwardSuccessPage(productId, orderId){
		
	var orderMoneyT = money - couponAmount;
		
	var url= h5ProductBuySuccess +'?productId='+productId+'&orderId='+orderId+'&money='+orderMoneyT+'&amount='+amount;
	
    global.openH5Win("productBuySuccessH5Win","./common/h5_header", url, '购买成功');
    
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

function showCoupon(){
	var originalPrice = 0;

	if(buyWayFlag ==2){
		originalPrice = balance;
		
	}else{		
		//amount = balance;
		originalPrice = money;
	}

	api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/coupon-records/new/product/' + productId,
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

					couponList = ret;					
					
					$api.removeCls($api.byId('couponChoice'), 'hide');
					$api.html($api.byId('couponChoice'),'已选推荐' );
					
					$api.removeCls($api.byId('couponSpan'),'hide');
					$api.html($api.byId('couponSpan'),ret[0].couponValue +ret[0].unitName+ ret[0].categoryName );
					
					if(ret[0].canUse){
						//1=红利券 2=代金券 3=折扣券
						if(ret[0].categoryId ==2 || ret[0].categoryId ==3){
							$api.html($api.byId('orderMoney'), global.formatCeil(money-ret[0].discount));
							couponAmount = ret[0].discount;
							
							$api.removeCls($api.byId('concession'), 'hide');
							$api.html($api.byId('concession'),  '(已优惠<em>' + couponAmount + '</em>元)');
						}else{
							$api.html($api.byId('orderMoney'), global.formatCeil(money));
						}					
						
						couponIds = ret[0].id;
					}else{
						couponNames = '暂无可用';
						$api.html($api.byId('couponSpan'), couponNames);
						$api.addCls($api.byId('couponSpan'), 'red');
						$api.addCls($api.byId('couponChoice'), 'hide');
						$api.removeCls($api.byId('couponSpan'), 'hide');
						
						couponCount = 0;
					}
				}
			}else{
				couponNames = '暂无可用';
				$api.html($api.byId('couponSpan'), couponNames);
				$api.addCls($api.byId('couponSpan'), 'red');
				$api.addCls($api.byId('couponChoice'), 'hide');
				$api.removeCls($api.byId('couponSpan'), 'hide');
				
				couponCount = 0;
			}
			
			buildIncomePlan();
			couponFlag = true; 
	});

}

function loadSelectCoupon(initPrice,price,incomeMoney, names){
	if(incomeMoney && incomeMoney.length > 0){
		//couponAmount = calculate.sub(initPrice,price);
		couponAmount = initPrice -price;

		if(couponAmount >0){
			//var balance_ =  calculate.sub(balance,couponAmount);

			$api.html($api.byId('orderMoney'), global.formatCeil(money-couponAmount));
		}else{
			$api.html($api.byId('orderMoney'), money);

			couponAmount = 0;
		}			
		if(couponAmount >0){
			$api.removeCls($api.byId('concession'), 'hide');
			$api.html($api.byId('concession'),  '(已优惠<em>' + global.substrDecimal(couponAmount, 2) + '</em>元)');
			 
		}else{
			$api.addCls($api.byId('concession'), 'hide');
		}

		//$api.html($api.byId('couponSpan'), names);

		//填充还款计划
		$api.html($api.byId('incomeListUl'),'');
		var incomeTimeT;
    	for(var j=0; j<incomeMoney.length; j++){
    		incomeTimeT = global.formatDate(incomeMoney[j].incomeTime, 'yyyy-MM-dd');
    		
    		$api.append($api.byId('incomeListUl'), '<li><span>' + incomeTimeT + '</span><em>赠金  ' + 
    		global.formatCurrency(calculate.add(incomeMoney[j].incomeMoney,0)) + '</em></li>');

    	}
    	
    	if(comeType ==0){		    				    		
    		$api.append($api.byId('incomeListUl'), '<li><span>' + incomeTimeT + '</span><em>购金款  ' + 
    		money + '</em></li>');
    	}

		incomeList = incomeMoney;
		calculateTotalIncome();
	}
}

function selectCoupon(){
	
	if(!couponFlag){
	 	global.setToast('优惠券正在加载中...');
	 	return;
	} 

	queryCouponList(couponList);
}

function queryCouponList(data) {
	if(data){	
		var useCoupon=[];
		var unUseCoupon=[];
		var allCoupon =[];

		for(var d in data){
			if(data[d].canUse){
				useCoupon.push(data[d]);
			}else{
				unUseCoupon.push(data[d]);
			}
		}

		if(useCoupon){
			for(var d in useCoupon){
				allCoupon.push(useCoupon[d]);
			}
		}
		
		if(unUseCoupon){
			for(var d in unUseCoupon){
				allCoupon.push(unUseCoupon[d]);
			}
		}

	    var template1 = $api.byId('coupon-template').text;
	    var tempFun1 = doT.template(template1);
		$api.byId('coupon-content').innerHTML = tempFun1(allCoupon);

		if(couponIds){
			var el = $api.byId('radio'+couponIds);
			
			if(el){
				el.checked = true;
			}
		}

		api.parseTapmode();

		if(couponIds){
			window.setTimeout(function(){
				$api.addCls($api.byId('select_cutover' + couponIds), 'hover');
			}, 500);
		}
	}else{
		
		$api.removeCls($api.byId('noCoupons'), 'hide');
	}

	$api.removeCls($api.byId('couponsDiv'), 'hide');
	$api.removeCls($api.byId('couponsDropDiv'), 'hide');

	$api.removeCls($api.byId('confirmCouponBtn'), 'hide');
}


function buildIncomePlan(){
	var originalPrice = 0;

	if(buyWayFlag ==2){
		originalPrice = balance;
		
	}else{
		//amount = balance;
		originalPrice = money;
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
					productId : productId,
					amount : amount,
					originalPrice : originalPrice,
					isWithdraw : comeType
				}
			}
		}, function(ret, err) {
			if(ret.obj && ret.obj.incomeMoney){
				incomeList = ret.obj.incomeMoney;

				calculateTotalIncome();
			}

		    //填充还款计划
		    if(ret.obj && ret.obj.incomeMoney){
		    	$api.html($api.byId('incomeListUl'),'');
				
				var incomeTimeT;
				
		    	for(var j=0; j<ret.obj.incomeMoney.length; j++){
		    		incomeTimeT = global.formatDate(ret.obj.incomeMoney[j].incomeTime, 'yyyy-MM-dd');
		    		
		    		$api.append($api.byId('incomeListUl'), '<li><span>' + incomeTimeT + '</span><em>赠金  ' + 
		    		global.formatCurrency(calculate.add(ret.obj.incomeMoney[j].incomeMoney,0)) + '</em></li>');
		    	}
		    	
		    	if(comeType ==0){		    				    		
		    		$api.append($api.byId('incomeListUl'), '<li><span>' + incomeTimeT + '</span><em>购金款  ' + 
		    		money + '</em></li>');
		    	}
		    }
	});
}

//计算赠金收益
function calculateTotalIncome(){
	var income =0.0;
	for(var j=0; j<incomeList.length; j++){
		income = calculate.add(income,incomeList[j].incomeMoney);
	}

	$api.html($api.byId('totalIncome'), global.formatCurrency(income));
}

//显示回款计划
function showInCome(){
	if($api.hasCls($api.byId('incomeDropDiv'), 'hide')){
		$api.removeCls($api.byId('incomeDropDiv'), 'hide');
		$api.removeCls($api.byId('incomeDiv'), 'hide');

	}else{
		$api.addCls($api.byId('incomeDropDiv'), 'hide');
		$api.addCls($api.byId('incomeDiv'), 'hide');
	}
}

function closeCoupon(){
	$api.addCls($api.byId('couponsDiv'), 'hide');
	$api.addCls($api.byId('couponsDropDiv'), 'hide');

	$api.addCls($api.byId('confirmCouponBtn'), 'hide');
}

function choiceCoupon(id,flag) {
	if(!flag){
		return;
	}
	couponIds = id;

	var items = $api.domAll($api.byId('coupon-content'), '.select_cutover');

	for (var i = 0; i < items.length; i++) {
		if('select_cutover' + id != $api.attr(items[i], 'id')){
			$api.removeCls(items[i], 'hover');
		}
	}

	if($api.hasCls($api.byId('select_cutover' + couponIds), 'hover')){
		$api.removeCls($api.byId('select_cutover' + couponIds), 'hover');
		couponIds = "";
//		if(couponCount && couponCount >0 ){
//			couponNames = couponCount + '张优惠券';
//		}else{
//			couponNames = '暂无可用优惠券';
//		}
		
		$api.html($api.byId('couponSpan'), '不用优惠券');
		$api.removeCls($api.byId('couponSpan'), 'hide');
		$api.removeCls($api.byId('couponSpan'), 'red');		
		$api.addCls($api.byId('couponChoice'), 'hide');
		
		$api.html($api.byId('orderMoney'), money);	
	}else{
		$api.addCls($api.byId('select_cutover' + couponIds), 'hover');
		couponNames = $api.html($api.byId('name' + id)) ;
		
		$api.removeCls($api.byId('couponChoice'), 'hide');
		$api.html($api.byId('couponChoice'),'已选1张' );		
		$api.removeCls($api.byId('couponSpan'),'hide');
		$api.removeCls($api.byId('couponSpan'), 'red');		
		$api.html($api.byId('couponSpan'),couponNames );
	}
}

function confimCoupon() {
	// if(couponIds.length < 1){
	// 	global.setToast('请选择优惠券');
	// 	return;
	// }
	var originalPrice = 0;
	if(buyWayFlag ==2){
		originalPrice = balance;
		//amount = balance;
	}else{
		originalPrice = money;
	}

	// $api.addCls($api.byId('confirmCouponBtn'), 'hide');
	$api.attr($api.byId('confirmCouponBtn'), 'disabled', 'disabled');
	api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/investment-orders/calculate',
			headers : global.getRequestToken(),
			data : {
				values : {
					'ids' : couponIds,
					'productId' : productId,
					'originalPrice' : originalPrice,
					'amount':amount,
					'isWithdraw' : comeType
				}
			}
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					loadSelectCoupon(ret.obj.originalPrice,ret.obj.realPrice,ret.obj.incomeMoney, couponNames);

					$api.addCls($api.byId('couponsDiv'), 'hide');
					$api.addCls($api.byId('couponsDropDiv'), 'hide');
				} else {
					global.setToast(ret.message);

				}
				$api.removeAttr($api.byId('confirmCouponBtn'), 'disabled');
			} else {
				global.setErrorToast();
			}

	});
}