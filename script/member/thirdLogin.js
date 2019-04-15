var agreementFlag = true;
var type;
var openId;
var headIcon;
var nickName;
var sex;
var mobile;
var frameIndex;

apiready = function(){
	type = api.pageParam.type;
	openId = api.pageParam.openId;
	headIcon = api.pageParam.headIcon;
	nickName = api.pageParam.nickName;
	sex = api.pageParam.sex;
	frameIndex = api.pageParam.frameIndex;
	
	sms.setBtFlag(0);

	initEvent();
}

function initEvent(){
	api.addEventListener({
	    name:'goLogin'
    },function(ret,err){
		if(ret && ret.value){
			$api.val($api.byId('userName'), ret.value.mobile);
		}
    });  

	api.addEventListener({
		name : 'webLoginEvent'
	}, function(ret, err) {
		
		api.closeWin({name:'registerWin'});
		api.closeWin({name:'registerSuccess'}); 
	});	
}

function clickAccount(li){
	$api.addCls($api.byId('clickAccount'+li), 'current');

	if(li ==1){
		$api.removeCls($api.byId('clickAccount2'), 'current');

		$api.removeCls($api.byId('logDivId'), 'mui-hidden');
		$api.addCls($api.byId('regDivId'), 'mui-hidden');		
	}else if(li ==2){
		$api.removeCls($api.byId('clickAccount1'), 'current');

		$api.removeCls($api.byId('regDivId'), 'mui-hidden');
		$api.addCls($api.byId('logDivId'), 'mui-hidden');	
	}
}

function showPassword(id,iconId) {
	global.showPassword(id, iconId);
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

	if (!validate.mobile(mobile)) {
		global.setToast('请输入正确的手机号码');
		return;
	}

	sms.sendSms(mobile,'','register','1','sendButton');
}

function login() {
	var userName = $api.val($api.byId('userName'));
	var password = $api.val($api.byId('loginPassword'));

	if (validate.isEmpty(userName)) {
		global.setToast('用户名不能为空');
		return;
	}

	if (validate.isEmpty(password)) {
		global.setToast('密码不能为空');
		return;
	}

	api.showProgress({
		title : '努力登录中...',
		modal : false
	});

	password = new Base64().encode(password);
	api.ajax({
			method : 'post',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/auth/third-oauth-login',
			data : {
				values : {
					'userName' : userName,
					'password' : password,
					'platfromSource' : global.getPlatformSource(),
					'type' : type,
					'openId' : openId,
					'headIcon' : headIcon,
					'nickName' :nickName,
					'sex' : sex,
					'imei' : api.deviceId,
					'deviceName' : api.deviceName,
					'deviceType' : api.deviceModel
				}
			}
		}, function(ret, err) {
		//alert(JSON.stringify(ret));
			if (ret) {
				api.hideProgress();
				if (ret.success) {
					
					if(ret.code && ret.code == -1){//需要验证
						//loginSuccess(ret);
						global.setLoginData(ret);
						
						var params = { "frameIndex" : frameIndex };
						
						global.openWinName("loginAuthWin", "../member/authenticate", params);
						
					}else{
						global.setLoginMobile(userName);
						loginSuccess(ret);
						thirdLoginSuccessEvent();
					}
					
				} else {
					global.setToast(ret.message);

					$api.val($api.byId('password'),'');
				}
			} else {
				api.hideProgress();
				global.setErrorToast();
			}
	});
}

function register() {
	mobile = $api.val($api.byId('mobile'));
	var password = $api.val($api.byId('password'));
	var code = $api.val($api.byId('code'));
	var recommendMobile = $api.val($api.byId('recommendMobile'));
	var recommendCode = '';
	
	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');
		return;
	}

	if (!validate.mobile(mobile)) {
		global.setToast('请输入正确的手机号码');
		return;
	}

	if (validate.isEmpty(code)) {
		global.setToast('手机验证码不能为空');
		return;
	}

	if (!validate.isEmpty(recommendMobile) && !validate.mobile(recommendMobile)) {
		recommendCode = recommendMobile;
		recommendMobile = '';
	}
	
	if (mobile == recommendMobile) {
		global.setToast('注册手机号不能与推荐人手机号码相同');
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

	if(!agreementFlag){
		global.setToast('请同意财易通智金用户服务协议');
		return;
	}

	$api.attr($api.byId('registSpan'), 'disabled', 'disabled');
	$api.removeAttr($api.byId('registSpan'), 'onclick');

	password = new Base64().encode(password);

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/auth/third-oauth-reg',
		data : {
			values : {
				'mobile' : mobile,
				'password' : password,
				'verificationCode' : code,
				'platfromSource' : global.getPlatformSource(),
				'recommendMobile' : recommendMobile,
				'recommendCode' : recommendCode,
				'type' : type,
				'openId' : openId,
				'headIcon' : headIcon,
				'nickName' :nickName,
				'sex' : sex,
				'imei' : api.deviceId,
				'deviceName' : api.deviceName,
				'deviceType' : api.deviceModel	
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
								
				if(ret.code && ret.code == -1){//需要验证
					//loginSuccess(ret);
					global.setLoginData(ret);
					
					var params = { "frameIndex" : frameIndex };
						
					global.openWinName("loginAuthWin", "../member/authenticate", params);
					
				}else{
					global.setLoginMobile(mobile);
					loginSuccess(ret);
					thirdLoginSuccessEvent();
				}
					
			} else {
				$api.removeAttr($api.byId('registSpan'), 'disabled');
				global.setToast(ret.message);
			}
		} else {
			$api.removeAttr($api.byId('registSpan'), 'disabled');
			global.setErrorToast();
		}

		$api.attr($api.byId('registSpan'), 'onclick', 'register();')
	});
}


function thirdLoginSuccessEvent(){
	api.sendEvent({
        name: 'loginRefresh'
    });
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
	var header = '../common/header';
	var params = { "page" : "../statics/regProtocol", "title" : "注册协议"};

	global.openWinName('regProtocolSubWin', header, params);
}