var header = "../common/header";
var envelopeAmount,amount,quantity,remark,url,lastPrice,totalSendMoney;
var redpacketType = 2;
var subsidy = 0;

apiready = function() {
	showGoldAccount();
	showGoldPrice();

	showPersonalSubsidy();

	initEvent();

    document.body.addEventListener('touchmove', function (event) {
        if(!$api.hasCls($api.byId('messageDiv'), 'hide')){
            event.preventDefault();
        }
    }, false);

}

function initEvent() {
	api.addEventListener({
	    name:'getGoldAccountDataRefreshSuccess'
    },function(ret,err){
    	showGoldAccount();
    });
}

function showPersonalSubsidy() {
	api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        url : global.getRequestUri() + '/recommend/partnerInfo'
    }, function(ret, err) {
    	if(ret){
    		subsidy = ret.subsidy;
    		$api.html($api.byId('perBt'), ret.subsidy);
    	}
    });

}

function showGoldAccount(){
	var getGoldAccountDataResult = $api.getStorage("getGoldAccountDataResult");
	if (getGoldAccountDataResult) {
        showResultData(getGoldAccountDataResult);
	} else {
		api.sendEvent({
	        name:'getGoldAccountDataRefresh'
        });
	}
}

function showGoldPrice(){
	var goldPrice = $api.getStorage('goldPrice');
	//lastPrice = 278;
	if(goldPrice){
		lastPrice = goldPrice.lastPrice;
	} else{
		api.sendEvent({
	        name:'goldPriceRefresh'
        });
	}
}

function showResultData(ret) {
	envelopeAmount = ret.envelopeAmount;
	// 可用红包金
	//$api.html($api.byId('envelopeAmount'), global.formatNumber(envelopeAmount * 1000,3));
	$api.html($api.byId('envelopeAmount'), (envelopeAmount * 1000).toFixed(0));
}

function changeType(type){
	redpacketType = type;
	if(type == 1){
		$api.html($api.byId('show1'), '单个克重');
		$api.addCls($api.byId('show2'), 'hide');
		$api.removeCls($api.byId('show3'), 'hide');

		$api.val($api.byId('amount'),'');
		$api.val($api.byId('quantity'),'');
		$api.val($api.byId('remark'),'');
	}else{
		$api.html($api.byId('show1'), '总克重');
		$api.addCls($api.byId('show3'), 'hide');
		$api.removeCls($api.byId('show2'), 'hide');

		$api.val($api.byId('amount'),'');
		$api.val($api.byId('quantity'),'');
		$api.val($api.byId('remark'),'');
	}

	$api.html($api.byId('totalaAmount'), 0.000);
	$api.html($api.byId('totalMoney'), "价值约：0.00元");
	$api.html($api.byId('perMoney'), 0.00);
}


function next(){
	if(verifyRedpacketRule()){

		amount = $api.val($api.byId('amount')); // 克重
        quantity = $api.val($api.byId('quantity'));//个数
        var perAmount = amount;
        //手气红包
        if(redpacketType === 2){
            perAmount = calculate.div(amount,quantity);
        }
    	
		showMessage();
	}
}


function confirm(){
	var payPwd = $api.val($api.byId('payPwd'));

	if(validate.isEmpty(payPwd)){
		global.setToast('交易密码不能为空');
		return;
	}

	if(!remark){
        remark = "财源滚滚，日进斗金";
    }

	payPwd = new Base64().encode(payPwd);

	if(redpacketType === 1){
		url = '/goldenvelope/sendGeneralEnvelope';
	} else {
		url = '/goldenvelope/sendSkillingEnvelope';
	}

	$api.removeAttr($api.byId('submitBtn'), 'onclick');

	//reamrk = remark.replaceAll("[^\\u0000-\\uFFFF]", "");

	api.ajax({
        method : 'post',
        cache : false,
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        url : global.getRequestGEUri() + url,
        data : {
            values : {
                'payPwd' : payPwd,
                'amount' : amount,
                'quantity' : quantity,
                'remark' : remark,
                'status' : 2,
                'useage' : 1
            }
        }
    }, function(ret, err) {
        if(ret){
            if(ret.success){
            	showMessage();
            	api.sendEvent({
	                name:'getGoldAccountDataRefresh'
                });

                api.sendEvent({
	                name:'getRedpacketDataRefresh'
                });
                
    			$api.val($api.byId('amount'),'');
				$api.val($api.byId('quantity'),'');
				$api.val($api.byId('remark'),'');
				$api.html($api.byId('totalaAmount'),'0.000');
				$api.html($api.byId('totalMoney'),'0.00');
		
            	if(redpacketType === 1){
            		amount = calculate.mul(amount,quantity);
            	}
            	
                var header = "../common/header";
				var params = { "page" : "../redpacket/redpacketAdv", "title" : "营销红包" ,"amount":amount,"quantity":quantity,"remark":ret.data.remark,"securityCode":ret.data.securityCode,"totalSendMoney":totalSendMoney,"subsidy":subsidy,"endTime":ret.data.endTime};

				global.openWinName('redpacketAdvSubWin', header, params);

            }else{
                global.setToast(ret.message);
            }
        }else{
            global.setToast('营销红包发放失败');
        }
        $api.attr($api.byId('submitBtn'), 'onclick', 'confirm();')
    });
}

function showMessage(){
	//手气红包
	if(redpacketType == 2){
		$api.html($api.byId('showAmount'), global.formatNumber(amount,3) + "毫克");
	} else {
		$api.html($api.byId('showAmount'), global.formatNumber(calculate.mul(amount,quantity),3) + "毫克");
	}

	$api.val($api.byId('payPwd'), '');
	if($api.hasCls($api.byId('messageDiv'), 'hide')){
		$api.removeCls($api.byId('messageDiv'), 'hide');
		$api.removeCls($api.byId('messageDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('messageDiv'), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
	}
}


function verifyRedpacketRule(){
	amount = $api.val($api.byId('amount'));
	quantity = $api.val($api.byId('quantity'));
	remark = $api.val($api.byId('remark'));

	if (validate.isEmpty(amount)) {
		global.setToast('红包克重不能为空');
		return false;
	}
	if (!validate.integer(amount)) {
		global.setToast('无效的红包克重');
		return false;
	}
	if(amount > envelopeAmount * 1000){
		global.setToast('可用克重不足');
		return false;
	}
	if (validate.isEmpty(quantity)) {
		global.setToast('红包个数不能为空');
		return false;
	}
	if(amount < 1){
		global.setToast('发放红包不能少于1毫克');
		return false;
	}
	if(!validate.integer(quantity)){
		global.setToast('无效的红包个数');
		return false;
	}
	if(quantity < 1){
		global.setToast('红包个数不能少于1个');
		return false;
	}

	//手气红包
	if(redpacketType == 2){

		if(calculate.div(amount,quantity) < 1){
			global.setToast('单个红包最小克重为1毫克');
			return false;
		}
		
	} else{

		if(amount < 1){
			global.setToast('单个红包最小克重为1毫克');
			return false;
		}
	}
	return true;

}

function calAmount(){
	amount = $api.val($api.byId('amount'));
	quantity = $api.val($api.byId('quantity'));

	//手气红包
	if (redpacketType == 2) {
		if(validate.integer(amount)){
			totalSendMoney = calculate.div(calculate.mul(amount,lastPrice),1000);
			$api.html($api.byId('totalaAmount'), global.formatNumber(amount,3));
			$api.html($api.byId('totalMoney'), "价值约："+ global.formatNumber(totalSendMoney,2) +"元");
			if(validate.integer(quantity)){
				$api.html($api.byId('perMoney'), global.formatNumber(calculate.div(totalSendMoney,quantity),2));
			} else {
				$api.html($api.byId('perMoney'), 0.00);
			}
			
		} else {
			$api.html($api.byId('totalaAmount'), 0.000);
			$api.html($api.byId('totalMoney'), "价值约：0.00元");
			$api.html($api.byId('perMoney'), 0.00);
		}

	} else {
		if(validate.integer(amount)){
			$api.html($api.byId('perMoney'), global.formatNumber(calculate.div(calculate.mul(amount,lastPrice),1000),2));
			if(validate.integer(quantity)){
				totalSendMoney = calculate.div(calculate.mul(calculate.mul(amount,quantity),lastPrice),1000);
				$api.html($api.byId('totalaAmount'), global.formatNumber(calculate.mul(amount,quantity),3));
				$api.html($api.byId('totalMoney'), "价值约："+ global.formatNumber(totalSendMoney,2) + "元");
			} else {
				$api.html($api.byId('totalaAmount'), 0.000);
				$api.html($api.byId('totalMoney'), "价值约：0.00元");
			}
		} else {
			$api.html($api.byId('totalaAmount'), 0.000);
			$api.html($api.byId('totalMoney'), "价值约：0.00元");
			$api.html($api.byId('perMoney'), 0.00);
		}
	}
	
}

function buyGold(){
	var params = { "page" : "../redpacket/buy", "title" : "买红包金" };
	global.openWinName("redpacketSubWin", header, params);
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', header, params);
}