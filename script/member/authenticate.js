
var frameIndex ;
var isAbroad = 0;
apiready = function(){	
	frameIndex = api.pageParam.frameIndex;
	
	 $("#idCardNo").bind("input propertychange",function(){
        validateIDCard();
    });
    
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
	// 		$api.attr($api.byId('idCardNo'), 'placeholder', '请输入港澳台通行证编号或护照编号');
	// 	}
	// });

	initEvent();
}

function initEvent(){
	api.addEventListener({
	    name:'viewappear'
    },function(ret,err){
    	api.closeWin({
			name: 'thirdLoginWin'
	    });
	    
    });

}

function startAuth(){
	$api.addCls($api.byId('authenticate'), 'hide');
	$api.removeCls($api.byId('authenInput'), 'hide');
}

function validateIDCard(){
	/*var value = $api.val($api.byId('idCardNo'));
	value=value.replace(/[^\a-\z\A-\Z0-9]/g,'');

	$api.val($api.byId('idCardNo'),value);

	$api.removeCls($api.byId('cleanInputId'), 'hide'); 
	
	var userName = $api.val($api.byId('userName'));
	
	if(!validate.isEmpty(value) && !validate.isEmpty(userName)){
		$api.removeAttr($api.byId('loginBt'), 'disabled');
	}else{
		$api.attr($api.byId('loginBt'), 'disabled', 'disabled');
	}*/
	$api.removeAttr($api.byId('loginBt'), 'disabled');
}

function validateName(){

	var userName = $api.val($api.byId('userName'));
	var value = $api.val($api.byId('idCardNo'));
	value=value.replace(/[^\a-\z\A-\Z0-9]/g,'');
	
	 if(!validate.isEmpty(value) && !validate.isEmpty(userName)){
		$api.removeAttr($api.byId('loginBt'), 'disabled');
	}else{
		$api.attr($api.byId('loginBt'), 'disabled', 'disabled');
	}

}

function auth() {
	var userName = $api.val($api.byId('userName'));
	var idCardNo = $api.val($api.byId('idCardNo'));

	if (validate.isEmpty(userName)) {
		global.setToast('姓名不能为空');
		return false;
	}

	if (validate.isEmpty(idCardNo)) {
		global.setToast('请输入实名认证时的证件号码');
		return false;
	}

	api.showProgress({
		title : '努力登录中...',
		modal : false
	});
	
	api.ajax({
			method : 'post',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/auth/verifyIdCard',
			data : {
				values : {
					'name' : userName,
					'idCard' : idCardNo,
					'platfromSource' : global.getPlatformSource(),
					'imei' : api.deviceId,
					'deviceName' : api.deviceName,
					'deviceType' : api.deviceModel
				}
			}
		}, function(ret, err) {

			if (ret) {
				api.hideProgress();
				if (ret) {
					if(ret.code && (ret.code =='2119' || ret.code =='2122' || ret.code =='2120')){		
						global.setToast(ret.message);
						api.sendEvent({
					   	   name:'invalidTokenEvent'
				    	});
					}else{
						
						if(ret.success){
							var loginData = global.getLoginData();

							if(loginData){
								loginSuccess(loginData);
							
								 api.closeWin({
									name: 'thirdLoginWin'
							    });
		    
		    					setTimeout(function(){
									api.closeWin();
							      
							    }, 300);
													
								api.sendEvent({
							        name: 'loginRefresh',
							         extra: {
							        	optSrc: 'login',
							        	frameIndex : frameIndex
							   		}
							    });
							    
							    global.cleanLoginData();
							}else{
							   global.setToast('登录异常，请重新返回登录');
							} 

						}else{
							global.setToast(ret.message);
						}
	
					}
				
				} else {
					global.setToast(ret.message);
					
				}
			} else {
				api.hideProgress();
				global.setErrorToast();
			}
	});
}

function closeLogin(){
	api.closeWin();
}

function cleanInput(){
	$api.addCls($api.byId('cleanInputId'), 'hide');
	$api.val($api.byId('idCardNo'),'');
	$api.attr($api.byId('loginBt'), 'disabled', 'disabled');

}

