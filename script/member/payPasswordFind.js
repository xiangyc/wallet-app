var isAbroad = 0;
apiready = function(){
   sms.setBtFlag(0);
   $api.val($api.byId('mobile'), global.getUserMobile());

   // $("#idCard").bind("input propertychange",function(){
   //      validateId();
   // });

   //判断是否境外
	// api.ajax({
	// 	method : 'get',
	// 	cache : false,
	// 	dataType : 'json',
	// 	returnAll : false,
	// 	url : global.getRequestUri() + '/members/simple',
	// 	headers : global.getRequestToken()
	// }, function(ret, err) {
	// 	isAbroad = ret.isAbroad;
	// 	if (ret && ret.isAbroad === 1) {
	// 		$api.attr($api.byId('idCard'), 'placeholder', '请输入港澳台通行证编号或护照编号');
	// 	}
	// });
}

function showPassword() {
	if($api.hasCls($api.byId('password'), 'tel')){
		$api.removeCls($api.byId('eye'), 'passwordOn');
		$api.addCls($api.byId('eye'), 'passwordOff');
		$api.removeCls($api.byId('password'), 'tel');
	}else{
		$api.addCls($api.byId('password'), 'tel');
		$api.addCls($api.byId('eye'), 'passwordOn');
		$api.removeCls($api.byId('eye'), 'passwordOff');
	}
	
	var temp = $api.val($api.byId('password'));
	$api.val($api.byId('password'), '');	
	//console.log($api.val($api.byId('password')));
	$api.val($api.byId('password'), temp);
}

function validateMobile(){
	$api.removeAttr($api.byId('sendButton'), 'disabled');
}

function validateName(){
	if(sms.getBtFlag() ===1){
		return ;
	}

}

function validateNameAndID(){
	var userName = $api.val($api.byId('userName'));
	var idCard = $api.val($api.byId('idCard'));
	
	if (validate.isEmpty(userName)) {
		global.setToast('姓名不能为空');
		return false;
	}

	if (validate.isEmpty(idCard)) {
		global.setToast('请输入实名认证时的证件号码');
		return false;
	}

	return true;
}

function validateId(){
	if(sms.getBtFlag() ===1){
		return ;
	}

	var userName = $api.val($api.byId('userName'));
	var idCard = $api.val($api.byId('idCard'));
	
	if (validate.isEmpty(userName) ) {
		global.setToast('姓名不能为空');
	 	return;
	}

	if (validate.isEmpty(idCard)) {
		global.setToast('请输入实名认证时的证件号码');
		// if(isAbroad === 1){
		// 	global.setToast('请输入港澳台通行证编号或护照编号');
		// }else{
		// 	global.setToast('请输入身份证号码');
		// }
	 	return;
	}

	$api.removeAttr($api.byId('sendButton'), 'disabled');
}

function sendSmsCode() {

	var mobile = $api.val($api.byId('mobile'));

	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');

		return;
	}

	if(!validateNameAndID()){
		return ;
	}

	sms.sendSms(mobile,'','forget-pay-pwd','4','sendButton');
}

function findPassword() {
	
	var mobile = $api.val($api.byId('mobile'));
	var password = $api.val($api.byId('password'));
	var code = $api.val($api.byId('code'));
	var userName = $api.val($api.byId('userName'));
	var idCard = $api.val($api.byId('idCard'));

	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');
		return;
	}

	if(!validateNameAndID()){
		return ;
	}
	
	if (validate.isEmpty(code)) {
		global.setToast('手机验证码不能为空');
		return;
	}

	if (validate.isEmpty(password)) {
		global.setToast('密码不能为空');
		return;
	}

	if (!validate.payPasswordRule(password)) {		
		global.setToast('密码必须为6数字');
		return;
	}

	$api.attr($api.byId('pwdSpan'), 'disabled', 'disabled');
	password = new Base64().encode(password);
	idCard = new Base64().encode(idCard);
	userName = new Base64().encode(userName);
	
	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/members/find/payPassword',
		headers : global.getRequestToken(),
		data : {
			values : {
				'idCard' : idCard,
				'code' : code,
				'password' : password,
				'name' : userName
			}
		}
	}, function(ret, err) {
		
		if (ret) {
			if (ret.success) {
				global.setToast('找回交易密码成功');
				global.setUserPayPassword(true);
			
				setTimeout("api.closeWin();", 1000);

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
