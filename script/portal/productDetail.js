var id;
var period;
var profitRate;
var reward = 0;
var periodUnit;
var loginWinName = "loginWin";
var bindCardWinName = "bindCardWin";
var payPasswordWinName = "payPasswordWin";
var header = "./common/header";
var params;
var rushPurchase = false;
var canUseCoupon = true;
var countdownTimer;
var remainSec = 0;
var productName = '';
var categoryId;
var activationMoney;//合伙人激活金额
var optSrc;//操作来源 1=待激活买金
var desc;
var periodType =1;//1=安心金 2=新手金
var maxPurchaseAmount =0;//新手金限购克重
var minPurchaseMoney = 0;//起购金额
var purchaseAmount = 0;//起购克重

apiready = function() {
	id = api.pageParam.id;
	categoryId = api.pageParam.categoryId;
	optSrc = api.pageParam.optSrc;
	desc = api.pageParam.desc;
	activationMoney = api.pageParam.activationMoney;

	$api.attr($api.byId('imgId'), 'src', global.getImgUri()+'/info/image/income-contrast.jpg');

	getProduct();
	//hasBuy();
	
	initEvent();
}

function initEvent(){
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
		//hasBuy();
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
		name : 'financeAccountRefresh'
	}, function(ret, err) {
		getProduct();
	});
	
}

function hasBuy(){
	if(global.isValidUser()){
		api.ajax({
			url : global.getRequestUri() + '/investment-products/purchase-condition?productId=' + id,
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers: global.getRequestToken()
		}, function(ret, err) {
			if (ret && ret.success) {
				$api.attr($api.byId('submitBtn'), 'onclick', 'buy();');
				$api.removeAttr($api.byId('submitBtn'), 'disabled');
			}else if(ret && ret.success === false && ret.code != '2120' && ret.code != 500){
				$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');
				$api.html($api.byId('submitBtn'), '您已购金,不再享受此优惠');
			}else{
				$api.attr($api.byId('submitBtn'), 'onclick', 'buy();');
				$api.removeAttr($api.byId('submitBtn'), 'disabled');
			}
		});
	}else{
		$api.removeCls($api.byId('submitBtn'), 'hide');
		$api.attr($api.byId('submitBtn'), 'onclick', 'buy();');
		$api.removeAttr($api.byId('submitBtn'), 'disabled');
	}
}

function getProduct(){
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
    
    var url = global.getRequestUri() + '/investment-products/' + id;
//  if(global.isValidUser()){
//  	url = global.getRequestUri() + '/investment-products/login/' + id;
//  }
	api.ajax({
		url : url,
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers: global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		
		$api.removeCls($api.byId('submitBtn'), 'hide');

		if (ret) {
			periodType = ret.type;
			
			question();
			
			productName = ret.name;
			period = ret.period;
			profitRate = ret.profitRate;
			periodUnit = ret.periodUnit;
			minPurchaseMoney = ret.minPurchaseMoney;
			purchaseAmount = ret.purchaseAmount;
			
			$api.html($api.byId('profitRate'), profitRate);
			
			if(periodType){
				if(periodType ==1){
				   $api.html($api.byId('periodTypeName'), '风险等级');
				   $api.removeCls($api.byId('periodTypeDiv1'), 'hide');
				   $api.addCls($api.byId('periodTypeDiv2'), 'hide');
				}else if(periodType ==2){	
				   maxPurchaseAmount = ret.maxPurchaseAmount;
				   				
				   $api.html($api.byId('periodTypeName'), '限购克重');
				   $api.addCls($api.byId('periodTypeDiv1'), 'hide');
				   $api.removeCls($api.byId('periodTypeDiv2'), 'hide');
				   $api.html($api.byId('maxPurchaseAmount'), maxPurchaseAmount/1000);
				}
				
			}

			if(categoryId === 3){
				$api.html($api.byId('period'), '随买随卖');
				$api.html($api.byId('purchaseSpan'), '1毫克');
			}else{
				//$api.html($api.byId('purchaseAmount'), ret.purchaseAmount/1000);
				
				if(ret.purchaseAmount ==0){
					$api.html($api.byId('minPurchaseMoney'), global.formatNumber(minPurchaseMoney, 2) +'元');
					$api.html($api.byId('buyName'), '起购金额');
					
				}else{
					$api.html($api.byId('minPurchaseMoney'), purchaseAmount/1000 +'克');
					$api.html($api.byId('buyName'), '起购克重');
				}				
				
				$api.html($api.byId('period'), period);
				if(periodUnit === 3){
					$api.append($api.byId('period'), '小时');
				}else{
					$api.append($api.byId('period'), '天');	
				}
			}

			if(ret.memberCouponsCount && ret.memberCouponsCount >0){
				$api.removeCls($api.byId('periodGoldLi'), 'hide');
				$api.html($api.byId('vaildCouponCount'), ret.memberCouponsCount  +'张优惠券可用');
			}

			if(ret.descriptionApp){
				$api.html($api.byId('descriptionApp'), ret.descriptionApp);
			}
			// if(ret.reward){
			// 	reward = ret.reward;
			// 	$api.html($api.byId('rewardRate'), '+' + ret.reward);
			// 	$api.removeCls($api.byId('rewardEm'), 'hide');
			// }

			if(ret.rushPurchase){				
				if(ret.rushPurchase && ret.startActivity){
					rushPurchase = true;
					//profitRate = ret.productStrategys[0].profitRate;
					canUseCoupon = ret.productStrategys[0].canUseCoupon;
					reward = ret.productStrategys[0].profitRate;
					$api.html($api.byId('rewardRate'), '+' + ret.productStrategys[0].profitRate +'%');
					$api.removeCls($api.byId('rewardEm'), 'hide');

					//$api.html($api.byId('activityEm'), profitRate);
					//$api.removeCls($api.byId('activityI'), 'hide');
					//$api.addCls($api.byId('normalI'), 'old-rate');
					remainSec = ret.productStrategys[0].remainSec;
					if(!countdownTimer){
						countdownTimer = window.setInterval("countdownInterval();", 1000);
					}
				}else if(ret.rushPurchase){
					$api.html($api.byId('timeEm'), '预计' + global.formatDate(ret.productStrategys[0].startTime, 'yyyy-MM-dd hh:mm') + '开始');
				}
				
				$api.removeCls($api.byId('activityDiv'), 'hide');
				$api.html($api.byId('nameI'), ret.productStrategys[0].name);

				$api.html($api.byId('noteP'), '');
				if(reward && reward > 0){
					$api.append($api.byId('noteP'), '<em>年化赠金：' + profitRate + '%+' + reward + '%</em>');
				}else{
					$api.html($api.byId('noteP'), '<em>年化赠金：' + profitRate + '%</em>');
				}
				if(ret.productStrategys[0].totalLimit){
					$api.append($api.byId('noteP'), '<em>发售总量：' + ret.productStrategys[0].totalLimit/1000 + '克</em>');
				}

				if(ret.productStrategys[0].rushPurchaseBalance){
					$api.append($api.byId('noteP'), '<em>剩余：' + ret.rushPurchaseBalance/1000 + '克</em>');
				}
				
				if(ret.productStrategys[0].personalLimit){
					$api.append($api.byId('noteP'), '<em>每人限额：' + ret.productStrategys[0].personalLimit/1000 + '克</em>');
				}
				if(ret.productStrategys[0].personalTimesLimit){
					$api.append($api.byId('noteP'), '<em>限购次数：' + ret.productStrategys[0].personalTimesLimit + '次</em>');
				}
				if(ret.productStrategys[0].everyTimeLimit){
					$api.append($api.byId('noteP'), '<em>每次限额：' + ret.productStrategys[0].everyTimeLimit/1000 + '克</em>');
				}
			}
		}
	});
}

function countdownInterval() {
	remainSec = remainSec - 1;
	var day = Math.floor(remainSec/(60*60*24)); 
	var hour= Math.floor((remainSec-day*24*60*60)/3600); 
	var minute = Math.floor((remainSec-day*24*60*60-hour*3600)/60); 
	var second = Math.floor(remainSec-day*24*60*60-hour*3600-minute*60); 

	if(day <= 0 && hour <= 0 && minute <= 0 && second <= 0){
		window.clearInterval(countdownTimer);
		$api.html($api.byId('timeEm'), '已结束');
		//getProduct();
		$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');
		
		api.sendEvent({
	        name:'activityEnd'
        });
	}else{
		$api.html($api.byId('dayI'), day);
		$api.html($api.byId('hourI'), hour);
		$api.html($api.byId('minuteI'), minute);
		$api.html($api.byId('secondI'), second);
	}
}

function buy(){
	if (!global.isValidUser()) {
		winName = "loginWin";
		// params = { "page" : "../member/login", "title" : "登录" };
		// global.openWinName(loginWinName, "./member/loginHeader", params);

		params = {  "title" : "登录" };
		global.openWinName(loginWinName, "./member/login", params);
		return;
	}

	if(productName ==''){
		global.setToast('数据加载中，请稍后');
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

	if(categoryId === 3){//天天金
		params = { "page" : "../productBuy", "title" : productName, "id" : id, "period" : period, "profitRate" : profitRate, "reward" : reward,
		 "periodUnit" : periodUnit, "rushPurchase" : rushPurchase, "canUseCoupon" : canUseCoupon, "categoryId" : categoryId };

	}else{//安心金
		params = { "page" : "../productBuyOne", "title" : productName, "id" : id, "period" : period, "profitRate" : profitRate, 
		"reward" : reward, "periodUnit" : periodUnit, "rushPurchase" : rushPurchase, "canUseCoupon" : canUseCoupon, 
		"categoryId" : categoryId, "optSrc" : optSrc, "desc" : desc,"activationMoney" : activationMoney,"periodType" : periodType,
		"maxPurchaseAmount" : maxPurchaseAmount,"minPurchaseMoney":minPurchaseMoney,"purchaseAmount":purchaseAmount};

	}
	global.openWinName('productBuy', header, params);
}

function question(){
	var quesUrl = global.getRequestUri() + '/help/listByTag?id=300';
	
	if(periodType){
		if(periodType ==2){
			quesUrl = global.getRequestUri() + '/help/listByTag?id=309';
		}
	}			

	api.ajax({
        url: quesUrl ,
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
        	type: 1        	
   		},
        bounces: false,
        vScrollBarEnabled: false
    });
}

function selectCoupon(){
	 api.openFrame({
        name: 'productDetailCouponFrame',
        url: 'productDetailCouponFrame.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto',
        },
        pageParam: {
        	id: id        	
   		},
        bounces: false,
        vScrollBarEnabled: false
    });
}

function selectCoupon2(){
	var mo=function(e){e.preventDefault();};
	document.body.style.overflow='hidden';        
    document.addEventListener("touchmove",mo,false);

    $api.removeAttr($api.byId('submitBtn'), 'onclick');

	api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/coupon-records/new/product/' + id,
			data : {
				values : {
					'amount' : 2147483647,
					'originalPrice' : 2147483647
				}
			}
		}, function(ret, err) {
			//alert(JSON.stringify(ret));
			if(ret && ret.length > 0){
				if(ret.code && (ret.code =='2119' || ret.code =='2122')){		
					global.setToast(ret.message);
					api.sendEvent({
				   	   name:'invalidTokenEvent'
			    	});
				}else{
					showCouponList(ret);
				}
			}
	});
}

function showCouponList(data) {
	if(data){	

	    var template1 = $api.byId('coupon-template').text;
	    var tempFun1 = doT.template(template1);
		$api.byId('coupon-content').innerHTML = tempFun1(data);

		api.parseTapmode();

	}

	$api.removeCls($api.byId('couponsDiv'), 'hide');
	$api.removeCls($api.byId('couponsDropDiv'), 'hide');

	$api.removeCls($api.byId('confirmCouponBtn'), 'hide');
}

function closeCoupon(){
	var mo=function(e){e.preventDefault();};
	document.body.style.overflow='';//出现滚动条
    document.removeEventListener("touchmove",mo,false);   
       
	$api.addCls($api.byId('couponsDiv'), 'hide');
	$api.addCls($api.byId('couponsDropDiv'), 'hide');

	$api.addCls($api.byId('confirmCouponBtn'), 'hide');

	setTimeout(function(){
		$api.attr($api.byId('submitBtn'), 'onclick', 'buy();');
      
    }, 1000);

}
