var applyCount;
var password;
var expressType;
var kindAmountmoney;
var canGoldCount;
var mobile;
var totalFinanceAccountFee;
var goldProductId;
var addressId;
var deliveryAddress;
var bindCardWinName = "bindCardWin";
var payPasswordWinName = "payPasswordWin";
var header = "../common/header";
var params;
var token = "";
var goldPrice;
var goldPriceFlag = false;
var oldgoldPrice;
var src = 1;	//1:随心金，2：安心金，3：红包黄金
var orderId;
var amount;
var diffMoney = 0;
var money = 0;
var totalPayFee = 0;
var payPwd;

apiready = function(){
	src = api.pageParam.src;
	if(src === 2){
		//安心金
		$api.removeCls($api.byId('priceDiv'), 'hide');
		$api.removeCls($api.byId('periodDiv'), 'hide');
		
		orderId = api.pageParam.orderId;
		oldgoldPrice = api.pageParam.oldgoldPrice;
		amount = api.pageParam.amount;
		money = api.pageParam.money;
		
		$api.html($api.byId('surplusEm'), amount);
		$api.html($api.byId('oldGlodPriceEm'), oldgoldPrice);
		$api.html($api.byId('moneyEm'), global.formatNumber(calculate.mul(amount, oldgoldPrice),2));
				
		showGoldPrice();
		initPayTimer('intervalEm', 300);
		window.setInterval("refresh();", 300000);
		
		canGoldCount = amount;
		$api.html($api.byId('activeBalance'), global.formatNumber(canGoldCount,3));
		$api.removeCls($api.byId('proAnprompt'), 'hide');
	}else if(src === 3){
		//红包金
		$api.removeCls($api.byId('proSuiprompt'), 'hide');
		showGoldRedpacket();
	}else if(src === 4){
		//天天金
		$api.removeCls($api.byId('proAnprompt'), 'hide');
		$api.removeCls($api.byId('priceDiv'), 'hide');
		$api.removeCls($api.byId('periodDiv'), 'hide');
		
		orderId = api.pageParam.orderId;
		oldgoldPrice = api.pageParam.oldgoldPrice;
		amount = api.pageParam.amount;
		money = api.pageParam.money;
		
		$api.html($api.byId('surplusEm'), amount);
		$api.html($api.byId('oldGlodPriceEm'), oldgoldPrice);
		$api.html($api.byId('moneyEm'), global.formatNumber(calculate.mul(amount, oldgoldPrice),2));

		canGoldCount = amount;
		$api.html($api.byId('activeBalance'), global.formatNumber(canGoldCount,3));
		showGoldPrice();

		initPayTimer('intervalEm', 300);
		window.setInterval("refresh();", 300000);
	}else{
		//随心金
		$api.removeCls($api.byId('proSuiprompt'), 'hide');
		var goldAccountResult = $api.getStorage("goldAccountResult");

		if (goldAccountResult) {
			showGoldAccountBalance(goldAccountResult);
		} else {
			api.sendEvent({
				name : 'goldAccountRefresh'
			});
		}
	}
	
	loadUseBalance();
	initEvent();
    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('passwordDialog'), 'hide')){
            event.preventDefault();
        }
    }, false);
}

function initEvent(){
	api.addEventListener({
		name : 'addressSelectEvent'
	}, function(ret) {
		if (ret) {
			var data = ret.value;
			deliveryAddress = data.deliveryAddress;
			var name = data.name;
			mobile = data.mobile;
			addressId = data.id;


			if(data.sourceSrc != 'addressChoice'){
				var defaultDeliveryAddress = {
					'consignee': name,
					'consigneeMobile':mobile,
					'addressDetail': data.deliveryAddress,
					'id':data.id
				};

				$api.setStorage("defaultDeliveryAddress", defaultDeliveryAddress);
			}

			

			if (deliveryAddress) {
				$api.addCls($api.byId('deliveryAddress'), 'input-span-sm');
				$api.html($api.byId('deliveryAddress'), '<h3><em>' + name  + ' ' + mobile +'</em></h3>' + '<p><em class="mui-pb10">' + deliveryAddress + '</em></p>');
			}
		}
	});

	api.addEventListener({
		name : 'addressInitEvent'
	}, function(ret) {
		$api.rmStorage('defaultDeliveryAddress');
		if (ret) {
			var id = ret.value.id;
			if (!addressId || id == addressId) {
				findDefaultDeliveryAddress();
			}
		}
	});

	api.addEventListener({
		name : 'goldAccountRefreshSuccess'
	}, function(ret) {
		var goldAccountResult = $api.getStorage("goldAccountResult");
		if(src === 1){
			showGoldAccountBalance(goldAccountResult);
		}
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
	    name:'getGoldAccountDataRefreshSuccess'
    },function(ret,err){
    	if(ret ){
    		if(src === 3){
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
			applyWithdrawGold();
		}
    });

}

function showGoldRedpacket(){
	var goldAccountResult = $api.getStorage("getGoldAccountDataResult");

	if (goldAccountResult) {
		// 红包金可用克重
		canGoldCount = goldAccountResult.envelopeAmount;
		$api.html($api.byId('activeBalance'), global.formatNumber(canGoldCount,3));
	} 
}


// 选择提金方式
function goodStyle(expressStyle) {

	if(expressStyle == 1){
		expressType = 1;
		$api.html($api.byId('expressTypeSpan'), '自提');
		$api.addCls($api.byId('selectAddressDiv'), 'hide');
		$api.removeCls($api.byId('addressDiv'), 'hide');
		$api.addCls($api.byId('style1'), 'active');
		$api.removeCls($api.byId('style2'), 'active');
	}else if(expressStyle == 2){
		expressType = 2;
		$api.html($api.byId('expressTypeSpan'), '快递');
		$api.addCls($api.byId('addressDiv'), 'hide');
		$api.removeCls($api.byId('selectAddressDiv'), 'hide');
		$api.addCls($api.byId('style2'), 'active');
		$api.removeCls($api.byId('style1'), 'active');

		var defaultDeliveryAddress = $api.getStorage("defaultDeliveryAddress");

		if(defaultDeliveryAddress){
			mobile = defaultDeliveryAddress.consigneeMobile;
			addressId = defaultDeliveryAddress.id;
			$api.addCls($api.byId('deliveryAddress'), 'input-span-sm');
			$api.html($api.byId('deliveryAddress'), '<h3><em>' + defaultDeliveryAddress.consignee  + ' ' + mobile +'</em></h3>' + '<p><em class="mui-pb10">' + defaultDeliveryAddress.addressDetail + '</em></p>');
		}else{
			
			findDefaultDeliveryAddress();
		}
	}

	selectExpressType(); 

	if (kindAmountmoney) {
		keyup();
	}

}


// 提金方式
function selectExpressType(){

	if($api.hasCls($api.byId('expressType'), 'hide')){
        $api.removeCls($api.byId('expressType'), 'hide');
        $api.removeCls($api.byId('expressTypeDiv'), 'hide');
    }else{
        $api.addCls($api.byId('expressType'), 'hide');
        $api.addCls($api.byId('expressTypeDiv'), 'hide');
    }
}

function findDefaultDeliveryAddress(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/delivery-addresses/find/default-address',
		headers : global.getRequestToken()
	}, function(ret, err) {

		if (ret) {
			var consignee = ret.consignee;
			mobile = ret.hideMobile;
			addressId = ret.id;
			var addressDetail = ret.region.province.name + "省" + ret.region.regionName + "市" + ret.addressDetail;
			var id = ret.id;

			var defaultDeliveryAddress = {
					'consignee': consignee,
					'consigneeMobile':mobile,
					'addressDetail': addressDetail,
					'id':id
				};
			$api.setStorage("defaultDeliveryAddress", defaultDeliveryAddress);

			$api.addCls($api.byId('deliveryAddress'), 'input-span-sm');
			$api.html($api.byId('deliveryAddress'), '<h3><em>' + consignee  + ' ' + mobile +'</em></h3>' + '<p><em class="mui-pb10">' + addressDetail + '</em></p>');

		} else {
			$api.removeCls($api.byId('deliveryAddress'), 'input-span-sm');
			$api.html($api.byId('deliveryAddress'), "请选择收货地址");
			mobile="";
			addressId="";
			//global.setToast('暂无默认收货地址');
		}
	});
}

function showGoldAccountBalance(ret) {
	canGoldCount = ret.activeBalance;
	$api.html($api.byId('activeBalance'), global.formatNumber(canGoldCount,3));
}

function selectAddress(){
	global.openHybridWin('addressWin','../common/adv_header', global.getH5url() + '/html/member/deliveryAddressChoice.html?source=goldExtraction&addressId='+addressId, '收货地址',0,'');

}

function selectGoldType(){
	showGoldType();
}

// 弹出实物金条选择框
function showGoldType(){
	if($api.hasCls($api.byId('kindType'), 'hide')){
		$api.removeCls($api.byId('kindType'), 'hide');
		$api.removeCls($api.byId('kindTypeDiv'), 'hide');
	}else{
		$api.addCls($api.byId('kindType'), 'hide');
		$api.addCls($api.byId('kindTypeDiv'), 'hide');
	}
}

//确认选择金条规格
function confirm(kindAmount){
	kindAmountmoney = kindAmount;
	if(kindAmount == 10){
		$api.html($api.byId('goldType'), "平安金" + kindAmount + "克/条");
		$api.addCls($api.byId('paj'), 'current');
		$api.removeCls($api.byId('jhj'), 'current');
		$api.removeCls($api.byId('ghj'), 'current');
		goldProductId = 1;
	} else if(kindAmount == 50){
		$api.html($api.byId('goldType'), "建行金" + kindAmount + "克/条");
		$api.addCls($api.byId('jhj'), 'current');
		$api.removeCls($api.byId('paj'), 'current');
		$api.removeCls($api.byId('ghj'), 'current');
		goldProductId = 2;
	} else {
		$api.html($api.byId('goldType'), "工行金" + kindAmount + "克/条");
		$api.addCls($api.byId('ghj'), 'current');
		$api.removeCls($api.byId('paj'), 'current');
		$api.removeCls($api.byId('jhj'), 'current');
		goldProductId = 3;
	}
	keyup();
	showGoldType();
}

// 数量加减符号
function computCount(num){
	if (!kindAmountmoney) {
		global.setToast('请选择金条规格');
		return;
	}

	var temp = $api.val($api.byId('applyCount'));
	if(!temp){
		temp = 0;
	}
	temp = (num > 0 ? parseInt(temp) + 1 : eval(temp - 1));
	if(temp < 0 || temp > 500){
		return;
	}

	$api.val($api.byId('applyCount'), temp);
	applyCount = temp;
	keyup();
}

// 键盘监听事件
function keyup() {
	if (!kindAmountmoney) {
		global.setToast('请选择金条规格');
		return;
	}

	applyCount = $api.val($api.byId('applyCount'));
	if(!validate.number(applyCount)){
		global.setToast('请输入有效的数字');
		return;
	}
	
	var expressFee = 0.00;
	var insuredFee = 0.00;
	var serviceFee = kindAmountmoney*applyCount * 12;
	$api.html($api.byId('serviceFee'), global.formatNumber(serviceFee,2));
	if(expressType == 2){
		insuredFee = kindAmountmoney*applyCount * 1.5;
		if(applyCount > 0){
			expressFee = 20;
		}
		
	}
	totalFinanceAccountFee = serviceFee + insuredFee + expressFee;
	$api.html($api.byId('expressFee'), global.formatNumber(expressFee,2));
	$api.html($api.byId('insuredFee'), global.formatNumber(insuredFee,2));
	$api.html($api.byId('totalFee'), global.formatNumber(totalFinanceAccountFee,2));
	$api.html($api.byId('amount'), calculate.mul(kindAmountmoney, applyCount));
	$api.html($api.byId('totalPayFee'), global.formatNumber(totalFinanceAccountFee,2));

	// 总支付费用
	totalPayFee = totalFinanceAccountFee;
	
	//计算:剩余克重,购金原价,剩余克重回款,提金补差价
	if(src === 2  || src === 4){
		diffMoney = 0;
		if(goldPrice.lastPrice > oldgoldPrice){

			//提金补差价
			diffMoney = calculate.mul(calculate.mul(kindAmountmoney, applyCount), calculate.sub(goldPrice.lastPrice, oldgoldPrice));

			totalPayFee = global.formatNumber(calculate.add(diffMoney, totalFinanceAccountFee),2);

			$api.html($api.byId('differenceEm'), global.formatNumber(diffMoney, 2));
			$api.html($api.byId('totalPayFee'), totalPayFee);
			$api.html($api.byId('totalFee'), totalPayFee);

			
		}
		
		//剩余克重	剩余克重回款
		if(calculate.sub(amount, calculate.mul(kindAmountmoney, applyCount)) >= 0){
			$api.html($api.byId('surplusEm'), calculate.sub(amount, calculate.mul(kindAmountmoney, applyCount)));

			$api.html($api.byId('moneyEm'), global.formatNumber(calculate.sub(money, calculate.mul(oldgoldPrice, calculate.mul(kindAmountmoney, applyCount))),2));
		}else{
			$api.html($api.byId('moneyEm'), '0.00');
		}
	}
}

//交易密码框
function showSubmit(){
	if($api.hasCls($api.byId('passwordDialog'), 'hide')){
		$api.removeCls($api.byId('passwordDialog'), 'hide');
		$api.removeCls($api.byId('passwordDialogDiv'), 'hide');

	}else{
		$api.addCls($api.byId('passwordDialog'), 'hide');
		$api.addCls($api.byId('passwordDialogDiv'), 'hide');
		$api.val($api.byId('password'), '');
	}
}

// 提金提示信息框
function showMessage(){
	if($api.hasCls($api.byId('messageDiv'), 'hide')){
		$api.removeCls($api.byId('messageDiv'), 'hide');
		$api.removeCls($api.byId('messageDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('messageDiv'), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
	}
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', '../common/header', params);
}

//校验信息
function validateData(){
	if (!expressType) {
		global.setToast('请选择提金方式');
		return false;
	}

	if (expressType == 2 && !mobile) {
		global.setToast('请选择收货地址');
		return false;
	}

	if (!kindAmountmoney) {
		global.setToast('请选择金条规格');
		return false;
	}

	if (!(/^[0-9]*[1-9][0-9]*$/).test(applyCount)) {
		global.setToast('金条数量必须为大于0的整数');
		return false;
	}

	if (kindAmountmoney * applyCount > canGoldCount) {
		global.setToast('可提黄金不足');
		return false;
	}

	if(calculate.sub(totalFinanceAccountFee, useBalance) > 0){
		global.setToast('可用余额不足，请先充值');
		return;
	}
	
	return true;
}

// 确认交易密码框
function applyWithdrawGold(){

	if (validate.isEmpty(payPwd)) {
		global.setToast('交易密码不能为空');
		return;
	}

	//$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
	
	var url = global.getRequestUri() + '/withdrow-gold-applies';
	var paramValue = {'amount' : applyCount,'payPwd' : payPwd,'expressType' : expressType,'goldProductId' : goldProductId,'addressId' : addressId,'reqToken' : token };
	if(src === 2){
		url = global.getRequestUri() + '/withdrow-gold-applies/period';
		paramValue = { 'orderId' : orderId, 'priceId' : goldPrice.id, 'goldPrice' : goldPrice.lastPrice, 'amount' : applyCount,'payPwd' : payPwd,'expressType' : expressType,'goldProductId' : goldProductId,'addressId' : addressId,'reqToken' : token };
	}else if(src === 3){
		url = global.getRequestUri() + '/withdrow-gold-applies/envelope';
		paramValue = { 'amount' : applyCount,'payPwd' : payPwd,'expressType' : expressType,'goldProductId' : goldProductId,'addressId' : addressId };
	}else if(src === 4){
		url = global.getRequestUri() + '/withdrow-gold-applies/per-diem';
		paramValue = { 'orderId' : orderId, 'priceId' : goldPrice.id, 'goldPrice' : goldPrice.lastPrice, 'amount' : applyCount,'payPwd' : payPwd,'expressType' : expressType,'goldProductId' : goldProductId,'addressId' : addressId,'reqToken' : token };
	}
	
	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : url,
		data : {
			values : paramValue
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){

				api.sendEvent({
	                name:'goldDetailRefreshEvent'
                });

                api.sendEvent({
	                name:'orderListRefresh'
                });

				global.refreshAsset();

				var tamount = applyCount * kindAmountmoney;
				var url= global.getH5url() + '/html/member/goldExtractionSuccess.html' +'?money='+totalPayFee+'&amount='+tamount;

				global.openHybridWin("goldExtractionWin", "../common/adv_header", url, "提金成功", 1, '');
				
            }else{
            	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
            	global.setToast(ret.message);
            }
		}else{
			$api.removeAttr($api.byId('confirmBtn'), 'disabled');
			global.setToast('提金申请提交失败');
		}

	});
}

//提交提金申请
function applySubmit(){
	if(!validateData()){
		return;
	}

	//实名
	if(!global.getUserIdCard()){
		params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1 };
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

	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/withdrow-gold-applies/check-withdraw-gold-amount',
		data : {
			values : {
				'amount' : applyCount,
				'expressType' : expressType,
				'goldProductId' : goldProductId
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){

				api.openFrame({
				    name: 'checkPayPwdFrame',
				    url: 'payPasswordFrame.html',
				    rect: {
				        x: 0,
				        y: 0
				    },
				    pageParam: {
				    	payMoney: totalPayFee,
				    	optSrc:'goldExtraction'
				    },
	                bgColor:'rgba(255, 255, 255, 0)'
				});

            }else{
            	global.setToast(ret.message);
            }
		}else{
			global.setToast('提金申请提交失败');
		}
	});
	
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/token'
	}, function(ret, err) {
		if(ret){
			if(ret.success){
				token = ret.code;
			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setToast('订单提交失败');
		}
	});
}

function showSub(){
	if($api.hasCls($api.byId('sub'), 'hide')){
		$api.removeCls($api.byId('sub'), 'hide');
		$api.removeCls($api.byId('subDiv'), 'hide');

	}else{
		$api.addCls($api.byId('sub'), 'hide');
		$api.addCls($api.byId('subDiv'), 'hide');
	}
}

function showDifference(){
	$api.removeCls($api.byId('difference'), 'hide');
	$api.removeCls($api.byId('differenceDiv'), 'hide');
	closeFeeDetail();
}

function closeDifference(){
	$api.addCls($api.byId('difference'), 'hide');
	$api.addCls($api.byId('differenceDiv'), 'hide');
	feeDetail();
}

function showGoldPrice(){
 	$api.addCls($api.byId('refreshDiv'), 'animation-rotate');
 	//$api.addCls($api.byId('lastPrice'), 'lastprice-ac');
 	setTimeout("$api.removeCls($api.byId('refreshDiv'), 'animation-rotate');", 1000);
 	//setTimeout("$api.removeCls($api.byId('lastPrice'), 'lastprice-ac');", 1000);

	goldPrice = $api.getStorage('goldPrice');
	if(goldPrice){
		$api.html($api.byId('lastPrice'), goldPrice.lastPrice);
		computeDifference();
	}
}


// 计算提金补差价
function computeDifference(){
	if(kindAmountmoney && applyCount){
		// 天天金，安心金
		if(src === 2  || src === 4){
			diffMoney = 0;
			if(goldPrice.lastPrice > oldgoldPrice){
				//提金补差价
				diffMoney = calculate.mul(calculate.mul(kindAmountmoney, applyCount), calculate.sub(goldPrice.lastPrice, oldgoldPrice));
				$api.html($api.byId('differenceEm'), global.formatNumber(diffMoney, 2));
				$api.html($api.byId('totalPayFee'), global.formatNumber(calculate.add(diffMoney, totalFinanceAccountFee),2));
			}
		}
	}
	
}

function refresh(){
	api.sendEvent({
	    name:'goldPriceRefresh'
    });

    goldPriceFlag = true;
}

function recharge(){
	var params = { "page" : "../member/recharge", "title" : "充值" };
	header = "../common/custom_header";
	global.openWinName('rechargeWin', header, params);
}

function loadUseBalance(){
	var financeAccount = $api.getStorage("financeAccountResult");

	if(financeAccount) {
		useBalance = financeAccount.useBalance;
		$api.html($api.byId('useBalance'), global.formatNumber(useBalance, 2));
	}
}

//兼容苹果手机输入交易密码  页面重新布局
/*var inputTextBox = document.getElementById('password');
setInterval(function(){
    inputTextBox.scrollIntoView(false);
},200)*/

// 提金费用明细
function feeDetail() {
    $api.removeCls($api.byId('feeDetail'), 'hide');
    $api.removeCls($api.byId('feeDetailDiv'), 'hide');
}

function closeFeeDetail(){
	$api.addCls($api.byId('feeDetail'), 'hide');
    $api.addCls($api.byId('feeDetailDiv'), 'hide');
}