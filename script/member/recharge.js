var amount = 0;
var interval = 120;
var interval;
var timer;
var header = "../common/header";
var refreshStatus = 0;
var bankStatus = 1;
var maxSingleQuota = 0;

apiready = function(){
	// var ret = $api.getStorage("bankAccount");
	// if(ret){
	// 	loadBankAccount();
	// }else{
	// 	getBankCard();
	// }
	getBankCard();
	
	getAccountBalance();
	initEvent();
}

function getAccountBalance(){
	var ret = $api.getStorage("financeAccountResult");
    if(ret){
	    $api.html($api.byId('accountBalance'), global.formatCurrency(ret.accountBalance));
    }
}

function getBankCard() {
	api.showProgress({
		title: '数据加载中...',
		modal: false
	});
	api.ajax({
		url : global.getRequestUri() + '/bank-accounts/',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			if(ret.obj && ret.obj.status === 2){
				$api.html($api.byId('unBundlingName'), '解绑中');
		    	$api.removeAttr($api.byId('unBundlingId'), 'onclick');

		    	$api.removeCls($api.byId('bindCardTip'), 'hide');
				$api.removeCls($api.byId('bindCardTipDiv'), 'hide');
		    }else{
		    	$api.html($api.byId('unBundlingName'), '解绑');
		    	$api.attr($api.byId('unBundlingId'), 'onclick', 'unBundling();');
		    }
	    
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){		
				global.setToast(ret.message);
				api.sendEvent({
			   	   name:'invalidTokenEvent'
		    	});
			}else if(ret.status ==0){
				forbid();
				
			}else{
				loadBankAccount(ret);
			}

		}else{
			forbid();
		}
	});
}


function initEvent(){
	api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	getAccountBalance();
    });
    
    api.addEventListener({
	    name:'continueRechargeEvent'
    },function(ret,err){
    	$api.val($api.byId('amount'), '');
    	$api.val($api.byId('smsCode'), '');
    	api.closeWin({
    		name : 'rechargeSuccessWin'
        });
    });
    
    api.addEventListener({
	    name:'closeRechargeEvent'
    },function(ret,err){
    	api.closeWin({
    		name : 'rechargeSuccessWin'
        });
        
        api.closeWin();
    });
    
    api.addEventListener({
		name : 'bankUndoCardDataEvent'
	}, function(ret, err) {
	    $api.html($api.byId('unBundlingName'), '解绑中');
	    $api.removeAttr($api.byId('unBundlingId'), 'onclick');
	});
}

function forbid(){
	global.setToast('请先绑定银行卡，才能充值！');			
	$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
	$api.html($api.byId('account'), '您还未绑定银行卡');
}

function loadBankAccount(ret){
	ret = ret.obj;
	if(ret){
		$api.html($api.byId('name'), ret.member.hideName);
		$api.html($api.byId('account'), ret.hideBankAccount.substr(ret.hideBankAccount.length - 4,4));
		$api.html($api.byId('bankName'), ret.bankInfo.bankName);
		$api.val($api.byId('mobile'), ret.hideBankMobile);

		
		var maxQuota  = ret.bankInfo.maxQuota/10000;
		maxSingleQuota = ret.bankInfo.maxSingleQuota/10000;

		if(ret.bankInfo.maxQuota%10000 >0){
			 maxQuota = (ret.bankInfo.maxQuota/10000).toFixed(4);
		}
		if(ret.bankInfo.maxSingleQuota%10000 >0){
			 maxSingleQuota = (ret.bankInfo.maxSingleQuota/10000).toFixed(4);
		}

		bankStatus = ret.bankInfo.status;

		//ret.bankInfo["abroad"] = 1;
		if(ret.bindType === 2){
			//境外用户
			$api.addCls($api.byId('bankInfoDiv'), 'hide');	
			$api.removeCls($api.byId('abroadDiv'), 'hide');			
		}else{
			//正常流程实名用户
			if(bankStatus == 2){
				$api.html($api.byId('maintenP'), ret.bankInfo.bankName + "正在维护中...");
				$api.removeCls($api.byId('stopDiv'), 'hide');
				$api.removeCls($api.byId('stopIconDiv'), 'hide');				
			}else{
				$api.removeCls($api.byId('normalDiv'), 'hide');	
			}
			
			$api.html($api.byId('quotaName'), '单日限额:'+ maxQuota +'万,单笔限额:'+ maxSingleQuota+'万' );	
		}

		if(ret.bankInfo.icon){
			var iconName = ret.bankInfo.icon;
			$api.attr($api.byId('icon'), 'src', '../../image/member/bank-icon/' + iconName);
			$api.addCls($api.byId('backDiv'), iconName.substring(0, iconName.indexOf('.')));
		}
	}
}

function gainCode() {
	if(bankStatus ==2){
		global.setToast('银行维护中' );
		return;
	}
	amount = $api.val($api.byId('amount'));

	if (validate.isEmpty(amount)) {
		global.setToast('充值金额不能为空');
		return;
	}

	if (!validate.number(amount)) {
		global.setToast('请输入正确的充值金额');
		return;
	}

/*	if (!validate.amount(amount)) {
		global.setToast('请输入正确的充值金额');
		return;
	}*/

	if (amount < 10) {
		global.setToast('充值金额最少10元');
		return;
	}

	api.ajax({
		method : "post",
		url : global.getRequestUri() + "/pay/yee/recharge",
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		data : {
			values : {
				'money' : amount
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){
				global.setToast("验证码已发送");
				$api.attr($api.byId('sendSms'), 'disabled', 'disabled');
				$api.val($api.byId('sendSms'), 'value', interval + "秒后重发");

				timer = window.setInterval("msgInterval();", 1000);
			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setToast("验证码发送失败");
		}
	});
}

function resetInterval(){
	$api.val($api.byId('sendSms'), '获取验证码');
	$api.removeAttr($api.byId('sendSms'), 'disabled');
	$api.attr($api.byId('sendSms'), 'click', 'gainCode');

	interval = 120;
	window.clearInterval(timer);
}


function msgInterval() {
	if (eval(interval < 1)) {
		resetInterval();

		return false;
	}
	if (isNaN(interval - 1) || isNaN(interval)) {
		$api.val($api.byId('sendSms'), 'value', '获取验证码');
	} else {
		$api.val($api.byId('sendSms'), interval + "秒后重发");
	}

	interval = interval - 1;
}

function rechargeSubmit() {
	var smsCode = $api.val($api.byId('smsCode'));
	amount = $api.val($api.byId('amount'));

	if (validate.isEmpty(amount)) {
		global.setToast('充值金额不能为空');
		return;
	}
	if (!validate.money(amount)) {
		global.setToast('请输入正确的充值金额');
		return;
	}

	if (amount <10) {
		global.setToast('充值金额最少10元');
		return;
	}

	if (validate.isEmpty(smsCode)) {
		global.setToast('验证码不能为空');
		return;
	}

	$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/pay/yee/recharge-confirm',
		data : {
			values : {
				'smsCode' : smsCode
			}
		}
	}, function(ret, err) {
		if (ret) {
			if(ret.success){
				$api.removeCls($api.byId('message'), 'hide');
				$api.removeCls($api.byId('messageDropDiv'), 'hide');

				refreshStatus = 0;
				payTimer = window.setInterval("callPay('" + ret.message + "');", 5000);
			}else{
				if(ret.message){
					global.setToast('充值失败：' + ret.message);
				}else{
					global.setToast('充值失败');
				}
			}
		}else{
			global.setToast('充值失败');
		}

		$api.attr($api.byId('confirmBtn'), 'onclick', 'rechargeSubmit();')
	});
}

function callPay(orderNo){
	if(refreshStatus >= 4){
		$api.addCls($api.byId('message'), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
		return;
	}

	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/pay/yee/recharge-status?orderNo=' + orderNo
	}, function(ret, err) {
		if (ret) {
			if(ret.success){
				resetInterval();
				window.clearInterval(payTimer);
				global.setToast('充值成功');
				
				$api.addCls($api.byId('message'), 'hide');
				$api.addCls($api.byId('messageDropDiv'), 'hide');
				$api.val($api.byId('smsCode'), '');
				$api.val($api.byId('amount'), '');

				global.refreshAsset();

//				api.confirm({
//					title : '充值提示',
//					msg : '充值成功',
//					buttons : ['继续充值', '关闭']
//			    },function(ret,err){
//					if (ret.buttonIndex === 2) {
//						api.closeWin();
//					}
//			    });

				var h5Url = '/html/system/rechargesuccess.html?amount=' + amount + '&orderNo=' + orderNo;
				global.openH5Win('rechargeSuccessWin','../common/h5_common_header', h5Url , '充值成功');
			}else{
				if(refreshStatus > 0){
					resetInterval();
					window.clearInterval(payTimer);
					if(ret.message){
						global.setToast(ret.message);
					}else{
						global.setToast('充值失败');
					}

					$api.addCls($api.byId('message'), 'hide');
					$api.addCls($api.byId('messageDropDiv'), 'hide');
					refreshStatus = 0;
				}
				
				refreshStatus = refreshStatus + 1;
			}
		}
	});
}

// function openlargeRecharge(){
//     global.openH5Win("largeRecharge","../common/h5_header", h5UrllargeRecharge, '更多充值方式');
// }

function bankList(){
    global.openH5Win("bankList","../common/h5_header", h5UrlBankList, '银行限额表');
}

function checkAmount(){
	var amountValue = $api.val($api.byId('amount'));
	if(amountValue.length>10){
		amountValue = amountValue.slice(0,10);
		$api.val($api.byId('amount'), amountValue);
	}

	// if((maxSingleQuota > 0 && (maxSingleQuota*10000) < amountValue) || (amountValue >= 10000)){
	// 	$api.removeCls($api.byId('rechargeTip'), 'hide');
	// }else{
	// 	$api.addCls($api.byId('rechargeTip'), 'hide');
	// }
}

function unBundling(){
	var params = { "page" : "../member/bankUndoCardData", "title" : "解绑银行卡" };

	global.openWinName('bankUndoCardDataWin', "../common/header", params);
}

function checkLength(){
	var smsCodeValue = $api.val($api.byId('smsCode'));
	if(smsCodeValue.length>6){
		smsCodeValue = smsCodeValue.slice(0,6);
		$api.val($api.byId('smsCode'), smsCodeValue);
	}

}