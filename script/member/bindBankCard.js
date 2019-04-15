var interval = 120;
var interval;
var timer;
var bankId='1';
var cardNo;
var idCardNo;
var userName;
var mobile;
var bankWin = "bankAndPayPwdWin";
var header = "../common/header";

apiready = function(){
	if(global.getUserName().length > 0){
		$api.val($api.byId('idCardNo'), global.getUserIdCard());
		$api.val($api.byId('userName'), global.getUserName());
		$api.attr($api.byId('idCardNo'), 'disabled', 'disabled');
		$api.attr($api.byId('userName'), 'disabled', 'disabled');
	}

	if(global.getUserBindCard() === '1'){
		showPayPwdDiv();
	}
	
	if(global.getUserPayPassword() === '1'){
		$api.addCls($api.byId('setPayPwdId'), 'current');
	}

	initEvent();
}

function showPayPwdDiv(){
	
	$api.addCls($api.byId('setPayPwdId'), 'current');

	$api.addCls($api.byId('bankCardForm'), 'hide');
	$api.addCls($api.byId('bankCardBt'), 'hide');
	
	$api.removeCls($api.byId('payPwdForm'), 'hide');
	$api.removeCls($api.byId('payPwdBt'), 'hide');
}

function initEvent(){
    api.addEventListener({
        name: 'bankSelect'
    }, function(ret, err) {
        if (ret && ret.value) {
           // $api.val($api.byId('bankId'), ret.value.id);
           // $api.text($api.byId('bankName'), ret.value.text);
        }
        
        api.closeWin({
			name : bankWin
		});
    });

    api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {    
        api.closeWin({
			name : 'bindCardWin'
		});
    });
}
    
function validateData(){
	//bankId = $api.val($api.byId('bankId'));
	cardNo = $api.val($api.byId('cardNo'));
	idCardNo = $api.val($api.byId('idCardNo'));
	userName = $api.val($api.byId('userName'));
	mobile = $api.val($api.byId('mobile'));

	if (validate.isEmpty(userName)) {
		global.setToast('开户名不能为空');
		return false;
	}

	if (validate.isEmpty(idCardNo)) {
		global.setToast('身份证号码不能为空');
		return false;
	}
	
	if (!validate.idCard(idCardNo) && idCardNo.indexOf('*') < 0) {
		global.setToast('请填写正确的身份证号码');
		return false;
	}

/*	if (validate.isEmpty(bankId)) {
		global.setToast('开户行不能为空');
		return false;
	}*/
	
	if (validate.isEmpty(cardNo)) {
		global.setToast('银行卡不能为空');
		return false;
	}
	
	if (!validate.integer(cardNo) || cardNo.length < 10) {
		global.setToast('您输入的银行卡号不正确，请重新输入');
		return false;
	}
	
	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');
		return false;
	}

	if (!validate.mobile(mobile)) {
		global.setToast('请填写正确的手机号');
		return false;
	}
	
	return true;
}

function gainCode() {
	
	if(!validateData())
		return;
	
	cardNo = new Base64().encode(cardNo);
	idCardNo = new Base64().encode(idCardNo);
	mobile = new Base64().encode(mobile);
	$api.attr($api.byId('sendSms'), 'disabled', 'disabled');
	api.ajax({
		method : "post",
		url : global.getRequestUri() + "/pay/yee/bind-card",
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		data : {
			values : {
				'bankId' : bankId,
				//'bankName' : bankName,
				'cardNo' : cardNo,
				'idCardNo' : idCardNo,
				'userName' : userName,
				'mobile' : mobile
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){
				idCardNo = ret.message;
				userName = ret.code;
				global.setToast("验证码已发送");
				$api.attr($api.byId('sendSms'), 'disabled', 'disabled');
				$api.val($api.byId('sendSms'), 'value', interval + "秒后重发");
	
				timer = window.setInterval("msgInterval();", 1000);
			}else{
				global.setToast(ret.message);
				$api.removeAttr($api.byId('sendSms'), 'disabled');
				$api.attr($api.byId('sendSms'), 'click', 'gainCode');
			}
		}else{
			global.setToast("认证失败");
		}
		
		$api.attr($api.byId('sendSms'), 'onclick', 'gainCode();');
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
		$api.val($api.byId('sendSms'), interval + "秒后重发!");
	}

	interval = interval - 1;
}

function bindSubmit() {
	var smsCode = $api.val($api.byId('smsCode'));

	if(!validateData())
		return;
		
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
		url : global.getRequestUri() + '/pay/yee/bind-card-confirm',
		data : {
			values : {
				'smsCode' : smsCode
			}
		}
	}, function(ret, err) {
		if (ret) {
			if(ret.success){
				global.setToast('绑定成功');
				global.setUserIdCard(idCardNo);
				global.setUserName(userName);			
				global.setUserBindCard(true);
				
				showPayPwdDiv();
				
				api.sendEvent({
					name : 'userBindCardRefresh',
					extra: {
						bindCard: true,
						userIdCard: ret.message,
						auth: api.pageParam.auth,
						reBind: api.pageParam.reBind
					}
				});
			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setToast('绑定失败')
		}

		$api.attr($api.byId('confirmBtn'), 'onclick', 'bindSubmit();')
	});
}

function selectBank(){
	var header = '../common/header';
	var params =  { "page" : "../member/bankSelect", "title" : "银行选择", "auth" : api.pageParam.auth };

	global.openWinName(bankWin, header, params);
}

function showPassword() {
	global.showPassword('confirmPassword', 'eye');
}

function setPayPassword() {
	var password = $api.val($api.byId('password'));
	var confirmPassword = $api.val($api.byId('confirmPassword'));

	if (validate.isEmpty(password)) {
		global.setToast('密码不能为空');
		return;
	}

	if (!validate.payPasswordRule(password)) {
		global.setToast('密码必须为6位数字');
		return;
	}

	if (validate.isEmpty(confirmPassword)) {
		global.setToast('确认密码不能为空');
		return;
	}

	if (!validate.passwordCompare(password,confirmPassword)) {
		global.setToast('两次密码不一致');
		return;
	}

	$api.attr($api.byId('payPwdSpan'), 'disabled', 'disabled');
	password = new Base64().encode(password);
	confirmPassword = new Base64().encode(confirmPassword);

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/members/pay-password',
		headers : global.getRequestToken(),
		data : {
			values :  {
				'confirmPassword' : confirmPassword,
				'password' : password
			}
		}
	}, function(ret, err) {
		
		if (ret) {
			if (ret.success) {
				global.setUserPayPassword(true);
				global.setToast('设置交易密码成功');
				
				api.sendEvent({
					name : 'payPasswordRefresh'
				});
			
				setTimeout("api.closeWin();", 1000);
			} else {
				$api.removeAttr($api.byId('payPwdSpan'), 'disabled');
				global.setToast(ret.message);
			}
		} else {
			$api.removeAttr($api.byId('payPwdSpan'), 'disabled');
			global.setErrorToast();
		}
	});
}

function openBankList(){

	var url= h5UrlBankList;
    global.openH5Win("bankList","../common/h5_header", url, '银行限额表');
}