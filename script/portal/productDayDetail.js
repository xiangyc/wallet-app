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
var categoryId=3;
var activationMoney;//合伙人激活金额
var optSrc;//操作来源 1=待激活买金
var desc;

apiready = function() {
	id = api.pageParam.id;
	//categoryId = api.pageParam.categoryId;
	optSrc = api.pageParam.optSrc;
	desc = api.pageParam.desc;
	activationMoney = api.pageParam.activationMoney;

	getProduct();

	getDayDayGold();
	question();
	initEvent();
}

function initEvent(){
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
		hasBuy();
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
		name : 'getGoldAccountDataRefreshSuccess'
	}, function(ret, err) {
		getDayDayGold();
	});

}


function getDayDayGold() {
	if(global.isValidUser()){
		var ret = $api.getStorage("getGoldAccountDataResult");
		//天天金可用克重
		if(ret && ret.perdiemAmount){
			$api.removeCls($api.byId('dayGoldAmountDiv'), 'hide');
			$api.html($api.byId('perdiemAmount'), global.formatNumber(ret.perdiemAmount,3));
		}else{
			$api.addCls($api.byId('dayGoldAmountDiv'), 'hide');
		}
		
	}
}

function sale(){
   var header = "./common/header";
   var params = { "page" : "../member/dayAccountListFrame", "title" : "选择订单"};

   global.openWinName('daydayGoldIncome', header, params);
}

function getProduct(){
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		url : global.getRequestUri() + '/investment-products/' + id,
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers: global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		
		if (ret) {
			$api.attr($api.byId('submitBtn'), 'onclick', 'buy();');
			$api.removeAttr($api.byId('submitBtn'), 'disabled');

			productName = ret.name;
			period = ret.period;
			profitRate = ret.profitRate;
			periodUnit = ret.periodUnit;
			$api.html($api.byId('profitRate'), profitRate);

			if(categoryId === 3){
				$api.html($api.byId('period'), '随买随卖');
				$api.html($api.byId('purchaseSpan'), '1毫克');
			}else{
				$api.html($api.byId('purchaseAmount'), ret.purchaseAmount/1000);
				$api.html($api.byId('period'), period);
				if(periodUnit === 3){
					$api.append($api.byId('period'), '小时');
				}else{
					$api.append($api.byId('period'), '天');	
				}
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
					$api.html($api.byId('rewardRate'), '+' + ret.productStrategys[0].profitRate);
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
				$api.html($api.byId('noteP'), '年化赠金：' + profitRate + '%');
				if(reward && reward > 0){
					$api.append($api.byId('noteP'), '+' + reward + '%');
				}
				if(ret.productStrategys[0].totalLimit){
					$api.append($api.byId('noteP'), '，发售总量：' + ret.productStrategys[0].totalLimit/1000 + '克');
				}

				if(ret.productStrategys[0].rushPurchaseBalance){
					$api.append($api.byId('noteP'), '，剩余：' + ret.rushPurchaseBalance/1000 + '克');
				}
				
				if(ret.productStrategys[0].personalLimit){
					$api.append($api.byId('noteP'), '，每人限额：' + ret.productStrategys[0].personalLimit/1000 + '克。');
				}
				if(ret.productStrategys[0].personalTimesLimit){
					$api.append($api.byId('noteP'), '，限购次数：' + ret.productStrategys[0].personalTimesLimit + '次。');
				}
				if(ret.productStrategys[0].everyTimeLimit){
					$api.append($api.byId('noteP'), '，每次限额：' + ret.productStrategys[0].everyTimeLimit/1000 + '克。');
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
		params = { "title" : "登录" };
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

	if(categoryId === 3){//天天金
		params = { "page" : "../productBuy", "title" : productName, "id" : id, "period" : period, "profitRate" : profitRate, "reward" : reward, "periodUnit" : periodUnit, "rushPurchase" : rushPurchase, "canUseCoupon" : canUseCoupon, "categoryId" : categoryId };

	}else{//安心金
		params = { "page" : "../productBuyOne", "title" : productName, "id" : id, "period" : period, "profitRate" : profitRate, 
		"reward" : reward, "periodUnit" : periodUnit, "rushPurchase" : rushPurchase, "canUseCoupon" : canUseCoupon, 
		"categoryId" : categoryId, "optSrc" : optSrc, "desc" : desc,"activationMoney" : activationMoney};

	}
	global.openWinName('productBuy', header, params);
}

function question(){

	api.ajax({
        url: global.getRequestUri() + '/help/listByTag?id=302' ,
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
