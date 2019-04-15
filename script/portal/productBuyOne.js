var id;
var period;
var profitRate =0;
var periodUnit;
var preOrderId;
var goldPrice;
var goldPriceFlag = false;
var rushPurchase = false;
var useBalance = 0;
var header = './common/header';
var agreementFlag = true;
var buyWayFlag = 1;//购买方式 默认1是克重，2是金额购买
var comeType = 0;	//0：还本付息，1：提金
var title ='';
var desc ;
var optSrc;//操作来源 1=合伙人待激活买金
var activationMoney;//合伙人激活金额
var periodType =1;//1=安心金 2=新手金
var maxPurchaseAmount =0;//新手金限购克重
var minPurchaseMoney = 0;//安心金起购金额
var purchaseAmount = 0;//起购克重

apiready = function() {

	id = api.pageParam.id;
	period = api.pageParam.period;
	profitRate = api.pageParam.profitRate;
	title = api.pageParam.title;
	rushPurchase = api.pageParam.rushPurchase;
	optSrc = api.pageParam.optSrc;
	desc = api.pageParam.desc;
	activationMoney = api.pageParam.activationMoney;
	periodType =  api.pageParam.periodType;
	maxPurchaseAmount = api.pageParam.maxPurchaseAmount;
	minPurchaseMoney = api.pageParam.minPurchaseMoney;
	purchaseAmount = api.pageParam.purchaseAmount;

	if(optSrc && optSrc ==1){
		$api.removeCls($api.byId('descId'), 'hide');
		$api.html($api.byId('descId'), '激活机构合伙人，需购买'+activationMoney/10000 +'万元以上安心金365天');
	}

	$api.removeCls($api.byId('periodDiv'), 'hide');
	
	if(api.pageParam.reward){
		profitRate = profitRate + api.pageParam.reward;
	}

	$api.html($api.byId('profitRate'), profitRate+'%');

	periodUnit = api.pageParam.periodUnit;

	if(periodUnit === 3){
		$api.html($api.byId('startTime'), global.formatDate(new Date().getTime(), 'yyyy-MM-dd'));
	}else{
		$api.html($api.byId('startTime'), global.formatDate(new Date().getTime() + 1000*60*60*24*period, 'yyyy-MM-dd'));
	}

	initEvent();
	loadUseBalance();
	showGoldPrice();
	
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
			showGoldPrice();
		}

		goldPriceFlag = false;
    });
    
    api.addEventListener({
	    name:'goldPriceBuyRefreshEvent'
    },function(ret,err){
    	showGoldPrice();

    	api.closeWin({name:'productBuyOne'});
    	
    });

    api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	loadUseBalance();
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
}

function showGoldPrice(){

	goldPrice = $api.getStorage('goldPrice');

	if(goldPrice){
		$api.html($api.byId('lastPrice'), goldPrice.lastPrice);
		computeBalance(true);
		//computeMoney();
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

function recharge(){
	var params = { "page" : "../member/recharge", "title" : "充值" };

	header = './common/custom_header';
	global.openWinName('rechargeWin', header, params);
}

function submitOrder(){
	if(!goldPrice){
		global.setToast('数据加载中，请稍后');
		return;
	}

	var amount = 0;
	var money = 0.0;

	var balance = $api.val($api.byId('formatBalance'));

	if(!agreementFlag){
		global.setToast('请同意购买黄金租赁服务协议');
		return;
	}

	if(buyWayFlag==1){
		amount = $api.val($api.byId('amount'));
		
		if (validate.isEmpty(amount)) {
			global.setToast('买入克重不能为空');
			return;
		}
		
		if(purchaseAmount ==0){//判断起购金额
			if(calculate.sub(amount * goldPrice.lastPrice,minPurchaseMoney) < 0){
				global.setToast('安心金起购金额为'+global.formatNumber(minPurchaseMoney, 2)+'元');
			
					return;
				}
		}else{//判断起购克重
			if(amount < purchaseAmount/1000){
				global.setToast('安心金'+purchaseAmount/1000+'克起购');
				
				return;
			}
		}
		
	   if(periodType ==2){
			if(amount > maxPurchaseAmount/1000){
				global.setToast('超出最大买金克重限制');
				
				return;
			}			
		}
		
		if (!validate.buyNumber(amount) || amount < 1) {
			global.setToast('买入克重无效');
			return;
		}
	}else if(buyWayFlag==2){
		money = $api.val($api.byId('money'));
		amount = $api.html($api.byId('balance2'));
		if (validate.isEmpty(money)) {
			global.setToast('购买金额不能为空');
			return;
		}
		if (!validate.money(money)) {
			global.setToast('请输入正确的金额');
			return;
		}

		if(purchaseAmount ==0){//判断起购金额
			if(calculate.sub(money,minPurchaseMoney) < 0){
				global.setToast('安心金起购金额为'+global.formatNumber(minPurchaseMoney, 2)+'元');
			
					return;
				}
		}else{//判断起购克重
			if(amount < purchaseAmount/1000){
				global.setToast('安心金'+purchaseAmount/1000+'克起购');
				
				return;
			}
		}
		
	   if(periodType ==2){
			if(calculate.sub(money, maxPurchaseAmount/1000 * goldPrice.lastPrice) > 0){
				global.setToast('超出最大买金克重限制');
				
				return;
			}			
		}

		//amount = amount.replace(",","");
		amount = amount.replace(/,/g,"");
	}

//	if(calculate.sub(balance, useBalance ) > 0){
//	 	global.setToast('可用余额不足，请先充值');
//	 	return;
//	 }
	
	if(optSrc && optSrc ==1 && calculate.sub(balance, activationMoney)<0){//激活机构合伙人 提示
		closeActivation();
		return;
	}
	
	var params = { "page" : "../productBuyTwo", "title" : title, "productId":id ,'priceId' : goldPrice.id,'goldPrice' : goldPrice.lastPrice,
				'amount' : amount,'money' : balance, 'balance':balance,'buyWayFlag' : buyWayFlag,
				'comeType' : comeType,'rushPurchase':rushPurchase,'optSrc':optSrc};

	global.openWinName('productBuyOne', header, params);

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

function openAgreement(){
	var params = { "page" : "../statics/buyPeriodProtocol", "title" : "安心金购买协议"};
	
	global.openWinName('periodProtocolSubWin', header, params);
}

function switchToBuyWay(){
	$api.val($api.byId('formatBalance'), 0);

	if(buyWayFlag==1){

		$api.html($api.byId('switchToBuyWayStrId'), '按克重买');
		
		$api.removeCls($api.byId('amountDiv'), 'hide');
		$api.addCls($api.byId('moneyDiv'), 'hide');
				
		$api.addCls($api.byId('amount'), 'hide');
		$api.removeCls($api.byId('money'), 'hide');

		buyWayFlag =2;
	}else if(buyWayFlag==2){

		$api.html($api.byId('switchToBuyWayStrId'), '按金额买');

		$api.removeCls($api.byId('amount'), 'hide');
		$api.addCls($api.byId('money'), 'hide');

		$api.removeCls($api.byId('moneyDiv'), 'hide');
		$api.addCls($api.byId('amountDiv'), 'hide');

		buyWayFlag =1;		
	}

	computeBalance(true);
	//switchTo();
}

function switchTo(){
	$api.val($api.byId('amount'),'');
	$api.val($api.byId('money'),'');

	$api.html($api.byId('balance'), '0.00');

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
	//$api.val($api.byId('amount'), num);
	//$api.html($api.byId('balance'), global.formatNumber(amountT, 3));

	computeBalance(true);
}

function computeBalance(refreshCoupon){

	if(buyWayFlag==1){
		var amount = $api.val($api.byId('amount'));
		var balance = global.formatCarry(calculate.mul(amount, goldPrice.lastPrice));

		$api.html($api.byId('balance1'), global.formatNumber(balance, 2));

		$api.val($api.byId('formatBalance'), balance);
		
		if (validate.isEmpty(amount)) {
			$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');
		}else{
			$api.removeAttr($api.byId('submitBtn'), 'disabled');
		}
	
	}else if(buyWayFlag==2){
		var money = $api.val($api.byId('money'));
	 
		var amountT = calculate.div(money, goldPrice.lastPrice);

		$api.html($api.byId('balance2'), global.formatNumber(amountT, 3));		
			
		$api.val($api.byId('formatBalance'), money);
		
		if (validate.isEmpty(money)) {
			$api.attr($api.byId('submitBtn'), 'disabled', 'disabled');
		}else{
			$api.removeAttr($api.byId('submitBtn'), 'disabled');
		}
	}	
}

function checkMoney(obj){
	  var regStrs = [
		['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
		['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
		['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
		['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
	];
	  for(i=0; i<regStrs.length; i++){
		var reg = new RegExp(regStrs[i][0]);
		obj.value = obj.value.replace(reg, regStrs[i][1]);
	}
}

function checkAmount(obj){
	  var regStrs = [
		['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
		['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
		['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
		['^(\\d+\\.\\d{3}).+', '$1'] //禁止录入小数点后两位以上
	];
	  for(i=0; i<regStrs.length; i++){
		var reg = new RegExp(regStrs[i][0]);
		obj.value = obj.value.replace(reg, regStrs[i][1]);
	}
}

function cancelDrop(){
	if($api.hasCls($api.byId('comeDropDiv'), 'hide')){
		$api.removeCls($api.byId('comeDropDiv'), 'hide');
		$api.removeCls($api.byId('comeDiv'), 'hide');

	}else{
		$api.addCls($api.byId('comeDropDiv'), 'hide');
		$api.addCls($api.byId('comeDiv'), 'hide');
	}
}

function closeActivation(){
	if($api.hasCls($api.byId('buyGoldActivationDropDiv'), 'hide')){
		$api.removeCls($api.byId('buyGoldActivationDropDiv'), 'hide');
		$api.removeCls($api.byId('buyGoldActivationDiv'), 'hide');

		$api.html($api.byId('activationDesc'), '购买≥'+activationMoney/10000+'万元安心金365天才能激活机构合伙人。');

	}else{
		$api.addCls($api.byId('buyGoldActivationDropDiv'), 'hide');
		$api.addCls($api.byId('buyGoldActivationDiv'), 'hide');
	}
}

function selectComeType(type, text){
	cancelDrop();
	comeType = type;
	$api.html($api.byId('comeSpan'), text);
	
	if(type === 0){
		$api.addCls($api.byId('come1Li'), 'mui-selected');
		$api.removeCls($api.byId('come2Li'), 'mui-selected');

	}else{
		$api.removeCls($api.byId('come1Li'), 'mui-selected');
		$api.addCls($api.byId('come2Li'), 'mui-selected');

	}
}

function allBuyGold(){

	if(buyWayFlag==1){
		var amountT = calculate.div(useBalance, goldPrice.lastPrice);
		$api.val($api.byId('amount'),global.substrDecimal(amountT,3));
		computeBalance(true);
	}else if(buyWayFlag==2){
		$api.val($api.byId('money'), useBalance);
		computeMoney();
	}
}