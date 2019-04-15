var agreementFlag = true;
var mobile;
var frameIndex;
apiready = function(){
  sms.setBtFlag(0);
  
  $("#mobile").bind("input propertychange",function(){
        validateMobile();
    });

   var activityIcon = api.pageParam.activityIcon;
   var activityContent =  api.pageParam.activityContent;
	frameIndex = api.pageParam.frameIndex;

   if(activityIcon){
   		$api.attr($api.byId('imgId'), 'src', global.getImgUri() +'/' + activityIcon);
   }
   if(activityContent){
   		$api.html($api.byId('regId'), activityContent );
   }else{
   		queryActivity();
   }
	
   initEvent();
}

function initEvent(){
	api.addEventListener({
	    name:'viewappear'
    },function(ret,err){
    	api.closeWin({
			name: 'loginWin'
	    });
	    
    });

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
					//$api.attr($api.byId('imgId'), 'src', global.getImgUri() +'/' + obj.iconUrl);
					$api.html($api.byId('regId'), obj.text );
				}
			}
		});
}			

function cleanInput(){
	$api.addCls($api.byId('cleanInputId'), 'hide');
	$api.val($api.byId('mobile'),'');
	$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
}

function showPassword() {
	global.showPassword('password', 'eye');
}

function validateMobile(){
	if(sms.getBtFlag() ===1){
		return ;
	}

	var mobile = $api.val($api.byId('mobile'));

	if (!validate.isEmpty(mobile) ) {	
		$api.removeCls($api.byId('cleanInputId'), 'hide'); 
	}

	if (validate.isEmpty(mobile) || mobile.length<11 ) {	 
		$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
		$api.attr($api.byId('registSpan'), 'disabled', 'disabled');
		
	 	return;
	}

	if (!validate.isEmpty(mobile) && mobile.length==11) {
		if(validate.mobile(mobile)){
 			$api.removeAttr($api.byId('sendButton'), 'disabled');
 			$api.removeAttr($api.byId('registSpan'), 'disabled');
		}else{
			$api.attr($api.byId('sendButton'), 'disabled', 'disabled');
			$api.attr($api.byId('registSpan'), 'disabled', 'disabled');
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

	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/members/validate/mobile?mobile=' + mobile
	}, function(ret, err) {
		if (ret) {
			if (!ret.value) {
				global.setToast('该手机号已经注册，不能重复注册');
			} else {
				//发送注册短信验证码
				sms.sendSms(mobile,'','register','1','sendButton');
			}
		} else {
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
	password = new Base64().encode(password);

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/members/register',
		data : {
			values : {
				'mobile' : mobile,
				'password' : password,
				'verificationCode' : code,
				'platfromSource' : global.getPlatformSource(),
				'recommendMobile' : recommendMobile,
				'recommendCode' : recommendCode
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				//$api.addCls($api.byId('regDivId'), 'hide');
				//$api.removeCls($api.byId('registerSuccessDivId'), 'hide');
				
				global.setLoginMobile(mobile);
				
				loginSuccess(ret);

	     //        api.sendEvent({
	     //             name:'goLogin',
						// extra: {
					 //        mobile: mobile
					 //    }
      //           });

//               api.sendEvent({
//	                 name:'webActivityFreshFrameEvent'
//              });
                
				h5RegisterSuccess();

               // registerSuccess();
			} else {
				$api.removeAttr($api.byId('registSpan'), 'disabled');
				global.setToast(ret.message);
			}
		} else {
			$api.removeAttr($api.byId('registSpan'), 'disabled');
			global.setErrorToast();
		}
	});
}

function h5RegisterSuccess(){

    var url= h5UrlRegsuccess +'?src=1&optSrc=reg&frameIndex='+frameIndex;
    global.openH5Win("registerSuccessForwardH5Win","../common/h5_header", url, '注册成功');
}

function loginSuccess(ret){
	var token = ret.message.split("_");
	if(token && token.length > 1){
		global.setToken(token[0]);
		global.setKey(token[1]);
	}

	global.setTokenExpires(ret.code);
	global.setUserMobile(ret.obj.hideMobile);
	global.setUserName(ret.obj.hideName);
	global.setUserIdCard(ret.obj.hideIdCard);
	global.setUserPayPassword(ret.obj.payPwdFlag);
	global.setUserBindCard(ret.obj.verifiedFlag);
	global.setMemberId(ret.obj.securityMemberId);
	// global.setReadNoticeTime(ret.obj.nickName);
	// global.setPublishTime(ret.obj.email);
	global.setSecurityMobile(ret.obj.securityMobile);
	
	if(ret.obj.recommend && ret.obj.recommend.hideMobile){
		global.setRecommentMobile(ret.obj.recommend.hideMobile);
	}
	if(ret.obj.recommend && ret.obj.recommend.hideName){
		global.setRecommentName(ret.obj.recommend.hideName);
	}
	
	global.setInviterCode(ret.obj.recommendCode);

	if(ret.obj.organizationMember){
		global.setOrgRole(ret.obj.organizationMember.orgRole);
	}

	if(ret.obj.organizationMember && ret.obj.organizationMember.org){
		global.setOrgActivationStatus(ret.obj.organizationMember.org.status);
	}

	// if(ret.obj.idCard){
	// 	global.setUserIdCard(ret.obj.idCard);
	// }

	if(ret.obj.thirdpartyAccount){
		global.setNickName(ret.obj.thirdpartyAccount.nickName);
		global.setAvatar(ret.obj.thirdpartyAccount.avatar);
	}

	// api.sendEvent({
 //        name: 'loginRefresh',
 //        extra: {
 //        	optSrc: 'reg',
 //        	frameIndex : frameIndex
 //   		}
 //    });
}

function registerSuccess(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/activities/registerGift'
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {				
				if(ret.message){
					$api.html($api.byId('remarkId'), ret.message);
				}else{
					$api.addCls($api.byId('welfareDivId'), 'hide');
					$api.addCls($api.byId('remarkDivId'), 'hide');
				}
				
			} 
		} else {			
			global.setErrorToast();
		}
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

function loginForward(){

	var params = {  "title" : "登录" };
	global.openWinName("loginWin", '../member/login', params);
}