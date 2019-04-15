(function(window){
    var s = {};
	var interval = 120;
	var initInterval = 120;
	var timer;
	var btFlag =0;

	//type 短信验证码类型 1=注册 2=忘记登录密码 3=重置登录密码 4=找回交易密码 5=修改手机号（原手机号可用） 6=修改手机号（原手机号不可用）
	s.sendSms = function(mobile,captcha,method,type,btnId) {
		var valuse = {};
		if(type=='1' || type =='2'){
			valuse =  {
					'mobile' : mobile,
					'captcha' : captcha
				};
	 	}else if(type =='3' || type =='4'){
	 		valuse =  {
					'captcha' : captcha
				};
	 	}else if(type =='5'){
 			valuse =  {
				'event' : 1
			};
	 	}else if(type =='6'){
	 		valuse =  {
 				'mobile' : mobile,
				'event' : 2
			};
	 	}

	 	$api.removeAttr($api.byId(btnId), 'onclick');

		api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/validate-code/'+method,
			headers : global.getRequestToken(),
			data : {
				values : valuse
			}
		}, function(ret, err) {
			if (ret) {
				//alert(JSON.stringify(ret));
				if (ret.success) {

					btFlag = 1;

					if(ret.message ){			
						if(ret.message ==='already_send'){	

							global.setToast('验证码已发送，请勿重复点击!');

							sms.removeDisabled(btnId);
						}else{
							global.setToast(ret.message);	
						}
					}else{
						global.setToast('发送成功');
					}

					if(ret.message !='already_send'){
						$api.attr($api.byId(btnId), 'disabled', 'disabled');
						$api.val($api.byId(btnId),  interval + "秒后重发");

						if(timer){
							window.clearInterval(timer);
						}

						timer = window.setInterval("sms.msgInterval('"+btnId+"');", 1000);
					}
				} else {
					global.setToast(ret.message);
					sms.removeDisabled(btnId);
				}
			} else {
				global.setErrorToast();
				sms.removeDisabled(btnId);
			}
		});
	}

	s.removeDisabled = function (btnId) {
		$api.val($api.byId(btnId), '获取验证码');
		$api.removeAttr($api.byId(btnId), 'disabled');
		$api.attr($api.byId(btnId), 'onclick', 'sendSmsCode();');
	
		interval = initInterval;
		window.clearInterval(timer);
		$api.addCls($api.byId(btnId), 'aui-btn-yzm');

		btFlag = 0;
	}

	s.msgInterval = function (btnId) {
		if (eval(interval < 1)) {
			$api.val($api.byId(btnId), '获取验证码');
			$api.removeAttr($api.byId(btnId), 'disabled');
			$api.attr($api.byId(btnId), 'onclick', 'sendSmsCode();');

			interval = initInterval;
			window.clearInterval(timer);
			$api.addCls($api.byId(btnId), 'aui-btn-yzm');

			btFlag = 0;
			return false;
		}

		if (isNaN(interval - 1) || isNaN(interval)) {
			btFlag = 0;
			$api.val($api.byId(btnId), '获取验证码');
		} else {
			$api.val($api.byId(btnId), interval + "秒后重发");
		}

		interval = interval - 1;
	}

	s.clearIntervalTimer = function (){
		if(timer){
			window.clearInterval(timer);

			initInterval = 120;
			interval =120;

			btFlag = 0;
		}
	}

	s.getBtFlag = function (){
		return btFlag;
	}

	s.setBtFlag = function (btFlag){
		btFlag = btFlag ;
	}

    window.sms = s;
})(window);