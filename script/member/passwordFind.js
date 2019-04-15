var isLoginFlag = false;//是否登录

apiready = function(){
   sms.setBtFlag(0);

   if(global.isValidUser() && global.getUserMobile()){
   		isLoginFlag = true;
   		
   		$api.val($api.byId('mobile'), global.getUserMobile());
		$api.attr($api.byId('mobile'), 'disabled', 'disabled');
		$api.removeAttr($api.byId('sendButton'), 'disabled');
   }
}

function showPassword() {
	global.showPassword('password', 'eye');
}

function validateMobile(){
	if(sms.getBtFlag() ===1){
		return ;
	}

	var mobile = $api.val($api.byId('mobile'));
	if (validate.isEmpty(mobile) || mobile.length<11 ) {	 
		$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
	 	return;
	}

	if (!validate.isEmpty(mobile) && mobile.length==11) {
		 if(validate.mobile(mobile)){
 			$api.removeAttr($api.byId('sendButton'), 'disabled');
		}else{
			$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
			global.setToast('请输入正确的手机号码');
		}	
	}
}

function sendSmsCode() {
	var mobile = $api.val($api.byId('mobile'));
	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');

		return;
	}

	if(!isLoginFlag){//没登录
		if (!validate.mobile(mobile)) {
			global.setToast('请输入正确的手机号码');
			return;
		}
	}

	if(!isLoginFlag){
		api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/members/validate/mobile?mobile=' + mobile
		}, function(ret, err) {
			if (ret) {
				if (ret.value) {
					global.setToast('该手机号未注册过，请确认输入是否正确');
				} else {
					sms.sendSms(mobile,'','forget-pwd','2','sendButton');
				}
			} else {
				global.setErrorToast();
			}
		});
	}else{
		$api.removeAttr($api.byId('sendButton'), 'disabled');
	}
}

function sendSmsCode() {
	var mobile = $api.val($api.byId('mobile'));
	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');

		return;
	}

	if(!isLoginFlag){//没登录
		if (!validate.mobile(mobile)) {
			global.setToast('请输入正确的手机号码');
			return;
		}
	}

	if(isLoginFlag){
		sms.sendSms(mobile,'','rest-pwd','3','sendButton');
	}else{
		sms.sendSms(mobile,'','forget-pwd','2','sendButton');
	}
}

function resetPassword() {
	var mobile = $api.val($api.byId('mobile'));
	var password = $api.val($api.byId('password'));
	var code = $api.val($api.byId('code'));

	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');
		return;
	}

	//没登录
	if(!isLoginFlag){
		if (!validate.mobile(mobile)) {
			global.setToast('请输入正确的手机号码');
			return;
		}
	}

	if (validate.isEmpty(code)) {
		global.setToast('手机验证码不能为空');
		return;
	}

	if (validate.isEmpty(password)) {
		global.setToast('密码不能为空');
		return;
	}

	if (!validate.passwordRule(password)) {
		global.setToast('密码必须为6-20位字母和数字的组合');
		return;
	}

	$api.attr($api.byId('pwdSpan'), 'disabled', 'disabled');
	password = new Base64().encode(password);

	var url ;
	var value ;
	if(isLoginFlag){
		url = global.getRequestUri() + '/members/update/password';
		value = {
			'code' : code,
			'password' : password
		};
	}else{
		url = global.getRequestUri() + '/members/find/password';
		value = {
			'mobile' : mobile,
			'code' : code,
			'password' : password
		};
	}
	
	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : url,
		headers : global.getRequestToken(),
		data : {
			values : value
		}
	}, function(ret, err) {
		
		if (ret) {
			if (ret.success) {
				global.setToast('修改成功');
				setTimeout(api.closeWin, 1000);
				if(api.pageParam.src === 1){
		            api.sendEvent({
		                 name:'goLogin',
							extra: {
						        mobile: mobile
						    }
	                });
                }
			} else {
				$api.removeAttr($api.byId('pwdSpan'), 'disabled');
				global.setToast(ret.message);
			}
		} else {
			$api.removeAttr($api.byId('pwdSpan'), 'disabled');
			global.setErrorToast();
		}
	});
}


//收不到验证码弹幕
function showInCode(){
	if($api.hasCls($api.byId('incodeDropDiv'), 'hide')){
		$api.removeCls($api.byId('incodeDropDiv'), 'hide');
		$api.removeCls($api.byId('incodeDiv'), 'hide');

	}else{
		$api.addCls($api.byId('incodeDropDiv'), 'hide');
		$api.addCls($api.byId('incodeDiv'), 'hide');
	}
}