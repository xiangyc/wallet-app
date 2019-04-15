var intervalTime = 30;//倒计时时间

apiready = function() {
	if(api.pageParam.optSrc){
		if(api.pageParam.optSrc == 'buyActive' || api.pageParam.optSrc == 'buyRedgold'){//购买随心金
			intervalTime = api.pageParam.intervalTime;
			initPayTimer('intervalEm', intervalTime);
			$api.removeCls($api.byId('timeoutInfo1'), 'hide');
		} else if (api.pageParam.optSrc == 'buyRed') {// 发红包
			$api.removeCls($api.byId('amountDiv'), 'hide');
			$api.addCls($api.byId('payDiv'), 'hide');
			$api.html($api.byId('showAmount'), api.pageParam.payMoney + "毫克");	
		} else if(api.pageParam.optSrc == 'goldExtraction'){// 提金
			$api.removeCls($api.byId('totalPayDiv'), 'hide');
			$api.addCls($api.byId('payDiv'), 'hide');
			$api.html($api.byId('totalPayFee'), '¥'+global.formatNumber(api.pageParam.payMoney,2));	
		} else if (api.pageParam.optSrc == 'goldsell') {//卖出随心金，红包金
			intervalTime = api.pageParam.intervalTime;
			initPayTimer('intervalEm', intervalTime);
			$api.removeCls($api.byId('timeoutInfo1'), 'hide');

			$api.removeCls($api.byId('reciveAmountDiv'), 'hide');
			$api.addCls($api.byId('payDiv'), 'hide');
			$api.html($api.byId('reciveAmount'), '¥'+api.pageParam.payMoney);	
		} else if(api.pageParam.optSrc == 'withdrawApply'){// 提现
			$api.removeCls($api.byId('withdrawAmountDiv'), 'hide');
			$api.addCls($api.byId('payDiv'), 'hide');
			$api.html($api.byId('withdrawAmount'), '¥'+global.formatNumber(api.pageParam.payMoney,2));	
		}	
	}
	
	$api.html($api.byId('payAmount'), '¥'+global.formatNumber(api.pageParam.payMoney, 2));		
	
	setTimeout(function(){
		//console.log("setTimeout");
		document.getElementById('password').focus();

		if(api.systemType === 'ios'){
			$api.addCls($api.byId('submitDiv'), 'bomb-box-jr');
			$api.addCls($api.byId('errPwdDiv'), 'bomb-box-jr');
		}
	
	}, 2000);		

	initEvent();
}

function initEvent(){    
    api.addEventListener({
	    name:'timeOutEvent'
    },function(ret,err){
    	showRefreshDiv();
    });
}

function showRefreshDiv(){
	if(api.pageParam.optSrc){
		if(api.pageParam.optSrc == 'buyActive' || api.pageParam.optSrc == 'goldsell' || api.pageParam.optSrc == 'buyRedgold'){//购买随心金
			$api.removeCls($api.byId('timeoutInfo2'), 'hide');
			$api.addCls($api.byId('timeoutInfo1'), 'hide');
		}
	}
	
}

function openPayPassword(){
	$api.addCls($api.byId('errPwdDiv'), 'hide');
	$api.addCls($api.byId('errDropDiv'), 'hide');
	$api.val($api.byId('password'), '');

	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', "../common/header", params);
}

function reInputPwd(){	
	$api.addCls($api.byId('errPwdDiv'), 'hide');
	$api.addCls($api.byId('errDropDiv'), 'hide');
	$api.val($api.byId('password'), '');
	setTimeout(function(){
		document.getElementById('password').focus();
	}, 1000);
}

function confirm(){
	var password = $api.val($api.byId('password'));

	if (password.length === 0) {
		global.setToast('交易密码不能为空');
		return;
	}
		
	password = new Base64().encode(password);
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
	api.ajax({
		method : 'POST',
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/finance-accounts/checkPayPwd',
		headers : global.getRequestToken(),
		data : {
			values : {
				'payPwd' : password
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				if(api.pageParam.optSrc === 'buyRedgold'){
					api.sendEvent({
		                name:'payPwdSuccessEvent',
		                extra: {
		                	key1: password
		                }
	                });
				}else{
					api.sendEvent({
		                name:'checkPayPwdSuccessEvent',
		                extra: {
		                	payPwd: password
		                }
	                });
                }
			} else {
				$api.removeAttr($api.byId('confirmBtn'), 'disabled');
				$api.html($api.byId('errPwdInfo'), ret.message);
				$api.removeCls($api.byId('errPwdDiv'), 'hide');
				$api.removeCls($api.byId('errDropDiv'), 'hide');
				
				$api.html($api.byId('password'), '');				
			}
		} else {
			global.setErrorToast();
		}
	});
}

function closeFrame(){

	api.sendEvent({
        name:'closePwdFrameEvent'
    });

	api.closeFrame();

}