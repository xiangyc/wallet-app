var useBalance = 0;
var header = "../common/header";
var token = "";
var maxWithdrawMoney = 0;
var minWithdrawMoney = 0;
var fee = 0;
var hideBankMobile;
var interval = 60;
var initInterval = 60;
var timer;
var btFlag =0;
var btnId = "sendButton";
var validateStr = '';
var payPwd;

apiready = function(){
	getBankCard();
	loadUseBalance();
	getWithdrawApplyFee();
	getMaxAndMinWithdrawMoney();
	initEvent();
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
			commit();
		}
    });

    api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {  
    	getCountWithdrawApply();  
        
    });


}

//获取银行卡信息
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
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){	
				global.setToast(ret.message);
				api.sendEvent({
			   	   name:'invalidTokenEvent'
		    	});
			}else if(ret.obj.status ==0){//已解绑
				forbid();
			}else if(ret.obj.status ==2){//解绑中
				loadBankAccount(ret);
				$api.removeCls($api.byId('bindCardTip'), 'hide');
				$api.removeCls($api.byId('bindCardTipDiv'), 'hide');
			}else{
				loadBankAccount(ret);
			}
		}else{
			forbid();
		}
	});
}

function forbid(){
	global.setToast('请先绑定银行卡，才能提现！');	
	$api.html($api.byId('account'), '您还未绑定银行卡');
	$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
}

function getMaxAndMinWithdrawMoney() {
	api.ajax({
		url : global.getRequestUri() + '/finance-accounts/withdraw-applies/config',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken()
	}, function(ret, err) {

		if (ret && ret.success) {
			maxWithdrawMoney = ret.obj.max;
			minWithdrawMoney = ret.obj.min;
			$api.html($api.byId('minMoney'), minWithdrawMoney);
			$api.html($api.byId('maxMoney'), calculate.div(maxWithdrawMoney, 10000));
		}
	});
}

// 获取提现处理笔数
function getCountWithdrawApply() {
	api.ajax({
		url : global.getRequestUri() + '/finance-accounts/withdraw-applies/count',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret && ret.success) {
			if(ret.obj.count > 0){
				$api.removeCls($api.byId('showMsg'), 'hide');
				$api.html($api.byId('countWithdraw'), ret.obj.count);
			} else {
				$api.addCls($api.byId('showMsg'), 'hide');
			}
		}
	});
}

// 获取提现手续费
function getWithdrawApplyFee() {
	api.ajax({
		url : global.getRequestUri() + '/finance-accounts/withdraw-applies/fee',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret && ret.success) {
			if(ret.obj > 0){
				fee = ret.obj;
				$api.removeCls($api.byId('feeClass'), 'hide');
			}else{
				$api.addCls($api.byId('feeClass'), 'hide');
			}
			$api.html($api.byId('fee'), global.formatNumber(ret.obj, 2));
		}
	});
}

// 加载银行卡数据
function loadBankAccount(ret){
	if(ret){
		$api.html($api.byId('name'), ret.obj.member.hideName);
		$api.html($api.byId('account'), ret.obj.hideBankAccount.substr(ret.obj.hideBankAccount.length - 4,4));
		$api.html($api.byId('bankName'), ret.obj.bankInfo.bankName);
		hideBankMobile = ret.obj.hideBankMobile;

		if(ret.obj.bankInfo.icon){
			var iconName = ret.obj.bankInfo.icon;
			$api.attr($api.byId('icon'), 'src', '../../image/member/bank-icon/' + iconName);
			$api.addCls($api.byId('backDiv'), iconName.substring(0, iconName.indexOf('.')));
		}
	}
}

// 获取可提现金额
function loadUseBalance(){
	var financeAccount = $api.getStorage("financeAccountResult");

	if(financeAccount) {
		useBalance = financeAccount.withdrawAmount;
		$api.html($api.byId('useBalance'), "<em onclick='showMoneyTip()'></em>" + global.formatNumber(useBalance, 2));
	}
}

// 全部提现
function submitAll() {
	$api.val($api.byId('withdrawAmount'), useBalance);
	computeMoney();
}

function confirm() {
	var withdrawAmount = $api.val($api.byId('withdrawAmount'));

	if (validate.isEmpty(withdrawAmount)) {
		global.setToast('金额不能为空');
		return;
	}
	if (!validate.money(withdrawAmount)) {
		global.setToast('请输入正确的金额');
		return;
	}

	if (withdrawAmount < minWithdrawMoney || withdrawAmount > maxWithdrawMoney) {
		global.setToast("单笔提现最小金额" + minWithdrawMoney + "元，最大金额" + maxWithdrawMoney + "元");
		return;
	}

	if(eval(withdrawAmount > useBalance)){
		global.setToast('提现金额不能大于可提现金额');
		return;
	}

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

				api.openFrame({
				    name: 'checkPayPwdFrame',
				    url: 'payPasswordFrame.html',
				    rect: {
				        x: 0,
				        y: 0
				    },
				    pageParam: {
				    	payMoney: withdrawAmount,
				    	optSrc:'withdrawApply'
				    },
	                bgColor:'rgba(255, 255, 255, 0)'
				});

            }else{
            	global.setToast(ret.message);
            }
		}else{
			global.setToast('提现申请提交失败');
		}
	});

}

//提交提现申请
function commit() {

	if (validate.isEmpty(payPwd)) {
		global.setToast('交易密码不能为空');
		return;
	}

	api.showProgress({
		title: '提交中...',
	 	modal: false
	});

	$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');

	var withdrawAmount = $api.val($api.byId('withdrawAmount'));
	api.ajax({
		method : "post",
		url: global.getRequestUri() + "/finance-accounts/withdraw-applies",
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		data : {
			values : {
				'money' : withdrawAmount, 
				'pwd' : payPwd
			}
		}
	}, function(ret, err) {
		if(ret){
			api.hideProgress();
			if(ret.success){
				global.setToast('提现申请提交成功');

	            api.sendEvent({
		                name:'financeAccountRefresh'
	            });
	            api.sendEvent({
		                name:'accountIncomeRefresh'
	            });

	            $api.val($api.byId('password'), '');
				$api.val($api.byId('withdrawAmount'), '');
				$api.html($api.byId('realMoney'), 0.00);

				forwardSuccessPage(withdrawAmount,ret.obj);
			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setToast('提现申请提交失败');
		}
		$api.removeAttr($api.byId('confirmBtn'), 'disabled');
		$api.attr($api.byId('confirmBtn'), 'onclick', 'confirm();');
	});
}

//实际到账金额
function computeMoney(){
	var withdrawAmount = $api.val($api.byId('withdrawAmount'));
	if(withdrawAmount.length>10){
		withdrawAmount = withdrawAmount.slice(0,10);
		$api.val($api.byId('realMoney'), withdrawAmount);
		$api.val($api.byId('withdrawAmount'), withdrawAmount);
	}
	if(withdrawAmount <= fee){
		$api.html($api.byId('realMoney'), 0.00);
	} else {
		$api.html($api.byId('realMoney'), global.formatNumber(calculate.sub(withdrawAmount,fee), 2));
	}
	
}

function forwardSuccessPage(withdrawAmount,applyId){
	var params = { "page" : "../member/withdrawSuccess", "title" : "申请提现成功","withdrawAmount":withdrawAmount,"id":applyId};
	global.openWinName('withdrawSuccessWin', header, params);
}

function doList(){
	var params = { "page" : "../member/withdrawList", "title" : "提现列表", "status" : 1};
	global.openWinName("withdrawListWin", '../common/header', params);
}

//关闭验证码输入框
function closePasswordWin(){
	$api.addCls($api.byId('passwordDiv'), 'hide');
	$api.addCls($api.byId('showDiv'), 'hide');
	$api.addCls($api.byId('numKey'), 'hide');
}

//倒计时60秒
function msgInterval(btnId) {
	if (eval(interval < 1)) {
		$api.html($api.byId(btnId), '重新发送');

		$api.removeAttr($api.byId(btnId), 'disabled');
		$api.attr($api.byId(btnId), 'onclick', 'sendSmsCode();');

		interval = initInterval;
		window.clearInterval(timer);

		btFlag = 0;
		return false;
	}

	if (isNaN(interval - 1) || isNaN(interval)) {
		btFlag = 0;
		$api.html($api.byId(btnId), '重新发送');
	} else {
		$api.html($api.byId(btnId), interval + "S");
	}

	interval = interval - 1;
}

function clearIntervalTimer(){
	if(timer){
		window.clearInterval(timer);

		initInterval = 60;
		interval =60;

		btFlag = 0;
	}
}

//重新发送验证码
function sendSmsCode(){

	$api.removeAttr($api.byId(btnId), 'onclick');

	api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/validate-code/withdraw-cash',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {

					btFlag = 1;

					if(ret.message ){			
						if(ret.message ==='already_send'){	
							global.setToast('验证码已发送，请勿重复点击!');
							removeDisabled();
						}else{
							global.setToast(ret.message);	
						}
					}else{
						global.setToast('发送成功');
					}

					if(ret.message !='already_send'){

						$api.attr($api.byId(btnId), 'disabled', 'disabled');
						$api.html($api.byId(btnId),  interval + "S");

						if(timer){
							window.clearInterval(timer);
						}

						timer = window.setInterval("msgInterval('"+btnId+"');", 1000);
					}
				} else {
					global.setToast(ret.message);
					removeDisabled();
				}
			} else {
				global.setErrorToast();
				removeDisabled();
			}
		});

}

function removeDisabled() {
	$api.html($api.byId(btnId), '重新发送');

	$api.removeAttr($api.byId(btnId), 'disabled');
	$api.attr($api.byId(btnId), 'onclick', 'sendSmsCode();');

	interval = initInterval;
	window.clearInterval(timer);

	btFlag = 0;
}

function cancelShow(){
	$api.addCls($api.byId('moneyTip'), 'hide');
	$api.addCls($api.byId('moneyTipDiv'), 'hide');
}

function showRule(){
	$api.removeCls($api.byId('messageTipDiv'), 'hide');
	$api.removeCls($api.byId('messageTip'), 'hide');
}

function closeMessageWin(){
	$api.addCls($api.byId('messageTipDiv'), 'hide');
	$api.addCls($api.byId('messageTip'), 'hide');
}

function showMoneyTip(){
	$api.removeCls($api.byId('moneyTip'), 'hide');
	$api.removeCls($api.byId('moneyTipDiv'), 'hide');
}

var j = 6;
var l = 0;
function callbackAddNumEric(str){
	var oDiv = $('#payPassword_container i');
    if(j==0){
        $('#cardwrap').css('left','0');
        return;
    }
    oDiv[6-j].innerHTML = str;
    validateStr += str;
    j--;
    if(j==0){
        $('#cardwrap').css('left','0px');
        $('#cardwrap').css('visibility','hidden');
        $("#payPassword_container").attr('data-busy','1');
    }else{
        l = 6-j;
        $('#cardwrap').css('left',l*44.6+'px');
    }
}

function callbackRemoveNumEric(){
	var oDiv = $('#payPassword_container i');
    if(j==6) return;
    j = j + 1;
    if(j==0){
        $('#cardwrap').css('left','-50px');
        return;
    }else{
        if(l<=0){
            $('#cardwrap').css('visibility','hidden');
            return;
        }else{
            l = 6-j;
            oDiv.eq(l).css('active');
            $('#cardwrap').css('visibility','visible');
            $('#cardwrap').css('left',l*44.6+'px');
            oDiv[6-j].innerHTML = "";
            validateStr = validateStr.substring(0,l);
        }
    }
}

function callbackBeSure(){
   $('.layer-content').animate({
        bottom: '-256px'
    }, 200);
    $('.mui-haveTitle').animate({
        top: '50%'
    }, 400);

	//$api.addCls($api.byId('numKey'), 'hide');
}

function closeWithdrawTip(){
	$api.addCls($api.byId('bindCardTip'), 'hide');
	$api.addCls($api.byId('bindCardTipDiv'), 'hide');
}