var activityIcon ;
var activityContent ;
var frameIndex = 0;
var loginType = 1;//登录方式 1=密码登录 2=短信验证码登录

apiready = function(){
	initEvent();
	frameIndex = api.pageParam.frameIndex;


	checkThirdLoginDiv();

	$("#userName").bind("input propertychange",function(){
        validateMobile();
     
    });   
	
	var defaultMobile = global.getLoginMobile();
	if(defaultMobile){
		$api.val($api.byId('userName'),defaultMobile);
		$api.removeAttr($api.byId('loginBt'), 'disabled');
		if(loginType ==2){
			$api.removeAttr($api.byId('sendButton'), 'disabled');
		}
	}
	//queryActivity();

}

function initEvent(){
	api.addEventListener({
	    name:'goLogin'
    },function(ret,err){
		if(ret && ret.value){
			$api.val($api.byId('userName'), ret.value.mobile);
			validateMobile();
		}
    });  

	api.addEventListener({
		name : 'webLoginEvent'
	}, function(ret, err) {
		
		api.closeWin({name:'registerWin'});
		api.closeWin({name:'registerSuccess'}); 

	});

	api.addEventListener({
	    name:'viewappear'
    },function(ret,err){
    	api.closeWin({
			name: 'loginSubWin'
	    });
	    
    });
}

function focus() {
	   var obj = $api.byId('userName');
       obj.focus();
        
       var mobile = $api.val($api.byId('userName'));
       
       var len =0;
       if(!validate.isEmpty(mobile)){
       		len = mobile.length ;
       }
       obj.selectionEnd = obj.selectionStart = len ;
       
       validateMobile();
}

function validateMobile(){

	var mobile = $api.val($api.byId('userName'));

	if (!validate.isEmpty(mobile) ) {	
		$api.removeCls($api.byId('cleanInputId'), 'hide'); 
	}

	if (validate.isEmpty(mobile) || mobile.length<11 ) {	
		 
		$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
		$api.attr($api.byId('loginBt'), 'disabled', 'disabled');
	 	return;
	}

	if (!validate.isEmpty(mobile) && mobile.length==11) {
		if(validate.mobile(mobile)){
			if(loginType ==2){
				$api.removeAttr($api.byId('sendButton'), 'disabled');
			}
 			$api.removeAttr($api.byId('loginBt'), 'disabled');
		}else{
			$api.attr($api.byId('loginBt'), 'disabled', 'disabled');
			$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
			global.setToast('请输入正确的手机号码');
		}		
	}

}

//loginType = 1;//登录方式 1=密码登录 2=短信验证码登录

function login() {
	var userName = $api.val($api.byId('userName'));
	var password = $api.val($api.byId('password'));
	var code = $api.val($api.byId('code'));

	if (validate.isEmpty(userName)) {
		global.setToast('用户名不能为空');
		return;
	}

	if(loginType ==1){
		if (validate.isEmpty(password)) {
			global.setToast('密码不能为空');
			return;
		}
	
		password = new Base64().encode(password);
	}
	
	if(loginType ==2){
		if (validate.isEmpty(code)) {
			global.setToast('验证码不能为空');
			return;
		}

	}
	api.showProgress({
		title : '努力登录中...',
		modal : false
	});
	
	
	if(loginType ==1){
		api.ajax({
				method : 'post',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				url : global.getRequestUri() + '/auth/login',
				data : {
					values : {
						'userName' : userName,
						'password' : password,
						'platfromSource' : global.getPlatformSource(),
						'imei' : api.deviceId,
						'deviceName' : api.deviceName,
						'deviceType' : api.deviceModel
					}
				}
			}, function(ret, err) {
		
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
							loginSuccessEvent();
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
		
	}else if(loginType ==2){
		api.ajax({
				method : 'post',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				url : global.getRequestUri() + '/auth/verifyCodeLogin',
				data : {
					values : {
						'userName' : userName,
						'verificationCode' : code,
						'platfromSource' : global.getPlatformSource(),
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
							loginSuccessEvent();
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
	
}

function openSubWin(item) {

	var header = '../common/header';
	var params;
	
	switch(item) {
		case 1:
			header = '../member/register';
			params = {  "title" : "注册", "activityIcon" : activityIcon, "activityContent":activityContent, "frameIndex" : frameIndex };
			break;
		case 2:
			params = { "page" : "../member/passwordFind", "title" : "找回密码", "src" : 1 };
			break;	
	}

	global.openWinName('loginSubWin', header, params);
}


function showPassword(){
	global.showPassword('password', 'eye');
}

var loginFlag = true;

function wxLogin(){
	
	$api.removeAttr($api.byId('wxLoginId'), 'onclick');
	$api.attr($api.byId('wxLoginId'), 'disabled', 'disabled');

	if(!loginFlag) return;

	loginFlag = false;

	var wx = api.require('wx');
	wx.isInstalled(function(ret, err) {
	    if (ret.installed) {
			wx.auth({
				apiKey: ''
			}, function(ret, err) {
				wx.getToken({
				    code: ret.code
				}, function(ret, err) {
				    if (ret.status) {
					    wx.getUserInfo({
						    accessToken: ret.accessToken,
						    openId: ret.openId
						}, function(ret, err) {
						    if (ret.status) {
						    	//nickname sex headimgurl
						        openBindMobileWin(1, ret.openid, ret.nickname, ret.sex , ret.headimgurl);
						    } else {
						        api.alert({ msg: "获取用户信息失败" });
						    }

						    loginFlag = true;

						});
				    }
				});
			});

			loginFlag = true;
	    } else {
	        api.alert({ msg: "当前设备未安装微信客户端" });
	    }
	});
}

function openBindMobileWin(type, openId, nickname, sex, headimgurl){
	api.ajax({
			method : 'post',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/auth/third-oauth',
			data : {
				values : {
					'platfromSource' : global.getPlatformSource(),
					'type' : type,
					'openId' : openId,
					'imei' : api.deviceId,
					'deviceName' : api.deviceName,
					'deviceType' : api.deviceModel
				}
			}
		}, function(ret, err) {
			//alert(JSON.stringify(ret) +'//'+JSON.stringify(err));
			if (ret) {
				if (ret.success) {					
					if(ret.code && ret.code == -1){//需要验证
						//loginSuccess(ret);
						
						global.setLoginData(ret);

						var params = { "frameIndex" : frameIndex };						
						global.openWinName("loginAuthWin", "../member/authenticate", params);	
						
					}else{
						
						if(ret.obj.member){
							global.setLoginMobile(ret.obj.member.securityMobile);
						}else{
							global.setLoginMobile(ret.obj.securityMobile);
						}
						
						loginSuccess(ret);
						loginSuccessEvent();
					}
						
				} else {

					var header = '../common/header';

					var	params = { "page" : "../member/thirdlogin", "title" : "绑定金算子账号", "type" : type, "openId" : openId,
									"headIcon" :headimgurl, "nickName" :nickname, "sex":sex, "frameIndex" : frameIndex };

					global.openWinName('thirdLoginWin', header, params);

				}
			} else {
				global.setErrorToast();
			}

		    $api.attr($api.byId('wxLoginId'), 'onclick', 'wxLogin();');
		    $api.removeAttr($api.byId('wxLoginId'), 'disabled');

		    loginFlag = true;
	});
}

function checkThirdLoginDiv(){
	//从1.3.0版本开始才有微信登录
	if(api.systemType === 'ios'){
	    	api.ajax({
				method : 'get',
				cache : false,
				dataType : 'json',
				returnAll : false,
				url : global.getRequestUri() + '/auth/third-oauth-check-flag?version='+global.getVersion()
			}, function(ret, err) {
				if (ret) {
					if(!ret.success){
						$api.removeCls($api.byId('authDiv'), 'mui-hidden');
					}
				}
			});
	}else{
		$api.removeCls($api.byId('authDiv'), 'mui-hidden');
	}
}

function queryActivity(){
 	api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/page-content?start=0&maxResults=1&type=2'
		}, function(ret, err) {
			if (ret) {
				if(ret.recordCount >0 && ret.items){
	                var obj = ret.items[0];

	                activityIcon = obj.iconUrl;
					activityContent = obj.text;

					// $api.attr($api.byId('imgId'), 'src', );
					// $api.html($api.byId('regId'), activityContent );
					//$api.html($api.byId('regId'),'<img src="' + global.getImgUri() +'/' + activityIcon +'" /><em>' + activityContent + '</em>');
					$api.html($api.byId('regId'),'<em>' + activityContent + '</em>');
				}
			}
		});
}			

function openAgreement(){
	var header = '../common/header';
	var params = { "page" : "../statics/regProtocol", "title" : "注册协议"};

	global.openWinName('regProtocolSubWin', header, params);
}

function closeLogin(){
	api.closeWin();
}

function cleanInput(){
	$api.addCls($api.byId('cleanInputId'), 'hide');
	$api.val($api.byId('userName'),'');
	$api.attr($api.byId('loginBt'), 'disabled', 'disabled');
	if(loginType ==2){
		$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
	}
}

function smsCodeLogin(){
	loginType = 2;	
	$api.addCls($api.byId('pwdDiv'), 'hide');	
	$api.removeCls($api.byId('sendSmsLogin'), 'hide');
	
	$api.addCls($api.byId('codeLoginID'), 'hide');	
	$api.removeCls($api.byId('pwdLoginID'), 'hide');	
	$api.addCls($api.byId('forgotPwdID'), 'hide');	
	
	validateMobile();
}

function pwdLogin(){
	loginType = 1;
	$api.removeCls($api.byId('pwdDiv'), 'hide');
	$api.addCls($api.byId('sendSmsLogin'), 'hide');	
	
	$api.addCls($api.byId('pwdLoginID'), 'hide');	
	$api.removeCls($api.byId('codeLoginID'), 'hide');	
	$api.removeCls($api.byId('forgotPwdID'), 'hide');	
}

function sendSmsCode() {
	var mobile = $api.val($api.byId('userName'));

	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');
		return;
	}

	if (!validate.mobile(mobile)) {
		global.setToast('请输入正确的手机号码');
		return;
	}

	sms.sendSms(mobile,'','verifyCodeLogin','1','sendButton');
}
