var optSrc;

apiready = function(){

	optSrc = api.pageParam.optSrc;//bindBankCardSuccess=来源于实名绑卡成功 
}


function showPassword() {
	if($api.hasCls($api.byId('confirmPassword'), 'tel')){
		$api.removeCls($api.byId('eye'), 'passwordOn');
		$api.addCls($api.byId('eye'), 'passwordOff');
		$api.removeCls($api.byId('confirmPassword'), 'tel');
	}else{
		$api.addCls($api.byId('confirmPassword'), 'tel');
		$api.addCls($api.byId('eye'), 'passwordOn');
		$api.removeCls($api.byId('eye'), 'passwordOff');
	}
	
	var temp = $api.val($api.byId('confirmPassword'));
	$api.val($api.byId('confirmPassword'), '');	
	//console.log($api.val($api.byId('password')));
	$api.val($api.byId('confirmPassword'), temp);
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
							
				if(optSrc && optSrc =='bindBankCardSuccess'){
					var params = { "page" : "../member/bankCard", "title" : "银行卡" };
					var header = "../common/header";
					global.openWinName('payPwdSuccessWin', header, params);
				}else{
					setTimeout("api.closeWin();", 1000);
				}	
				
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
