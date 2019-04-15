var bindCardWinName = "bindCardWin";

apiready = function(){
	hasValidate();
	canUpdateRecommend();	
	readMobile();
	checkThirdDiv();
	initEvent();
}

function checkThirdDiv(){
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
					$api.removeCls($api.byId('thirdAccountId'), 'hide');
				}
			}
		});	
	}else{
		$api.removeCls($api.byId('thirdAccountId'), 'hide');
	}
	
}

function hasValidate(){
	if(global.getUserIdCard()){
		$api.html($api.byId('cardDiv'), '已认证');
		if(global.getUserBindCard() ==='0'){
			$api.html($api.byId('cardDiv'), '已认证未绑卡');
		}
	}else{
		$api.html($api.byId('cardDiv'), '未认证');
	}

	if(global.getUserPayPassword() === '1'){
		$api.html($api.byId('payPwdDiv'), '重置');
	}else{
		$api.html($api.byId('payPwdDiv'), '未设置');
	}

	$api.html($api.byId('code'), global.getInviterCode());
	loadRecomment();
}

function canUpdateRecommend(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/recommend/canUpdateRecommendRelation'
	}, function(ret, err) {
		if(ret && ret.success){
			$api.attr($api.byId('inviterLi'), 'onclick', 'openChangeInviter();');
			$api.addCls($api.byId('arrowA'), 'mui-navigate-right');
		}
	});
}

function loadRecomment(){
	if(global.getRecommentMobile()){
		$api.html($api.byId('mobile'), global.getRecommentMobile());
		if(global.getRecommentName()){
			$api.append($api.byId('mobile'), " " + global.getRecommentName());
		}
	}else{
		$api.html($api.byId('mobile'), '无');
	}
}

function initEvent(){
	api.addEventListener({
		name : 'userBindCardRefresh'
	}, function(ret, err) {
		hasValidate();
		if(ret && ret.value && ret.value.reBind !== 1){

			if(global.getUserPayPassword() === '1'){
				api.closeWin({
					name : bindCardWinName
				});
			}
		}

		if(ret && ret.value){
			if(ret.value.userIdCard){
				global.setUserIdCard(ret.value.userIdCard);
			}
		}
	});

	api.addEventListener({
		name : 'payPasswordRefresh'
	}, function(ret, err) {
		if(ret ){
			global.setUserPayPassword(true);
			$api.html($api.byId('payPwdDiv'), '重置');
		}
	});
	
	api.addEventListener({
		name : 'recommentRefresh'
	}, function(ret, err) {
		loadRecomment();
		canUpdateRecommend();
	});
	
	api.addEventListener({
		name : 'changeMobileSuccessEvent'
	}, function(ret, err) {
		$api.html($api.byId('phoneId'), global.getUserMobile());
	});
}

function readMobile(){
	$api.html($api.byId('phoneId'), global.getUserMobile());	
}

function openSubWin(item) {
	var header = "../common/header";
	var params;
	var winName = "setSubWin";

	switch(item) {
		case 1:

			winName = bindCardWinName;
			if(global.getUserIdCard()){
				if(global.getUserBindCard() === '0'){

					header = '../common/custom_header';
					params = { "page" : "../member/bindNewBankCard", "title" : "实名绑卡", "auth" : 1,"reBind": 2 };
				}else{
					params = { "page" : "../member/bankCard", "title" : "银行卡" };
				}
			}else{ 
				header = '../common/custom_header';
				params = { "page" : "../member/bindNewBankCard", "title" : "实名绑卡", "auth" : 1,"reBind": 2 };
			}
			
			global.openWinName(winName, header, params);
			break;
		case 2:
			global.openHybridWin('setSubWin','../common/adv_header', global.getH5url() + '/html/member/deliveryAddressList.html', '收货地址',0,'');
			break;
		case 3:
			params = { "page" : "../member/passwordFind", "title" : "重置登录密码" };
			global.openWinName(winName, header, params);
			break;
		case 4:
			api.sendEvent({
				name:'forgetPayPasswordEvent'
			});
			break;
		case 5:	
			params = { "page" : "../member/replacephoneone", "title" : "更换手机号" };
			global.openWinName(winName, header, params);
			break;
		case 6:
			params = { "page" : "../member/bindWx", "title" : "第三方账号绑定" };
			global.openWinName(winName, header, params);
			break;						
	}
}

function showMessage(){
	if($api.hasCls($api.byId('confirmDiv'), 'hide')){
		$api.removeCls($api.byId('confirmDiv'), 'hide');
		$api.removeCls($api.byId('confirmDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('confirmDiv'), 'hide');
		$api.addCls($api.byId('confirmDropDiv'), 'hide');
	}
}

function logOut(){
	api.sendEvent({
	    name:'logOutRefresh'
    });
}

function openChangeInviter(){
	var params = { "page" : "../partner/changeInviter", "title" : "修改邀请人" };
	global.openWinName('setSubWin', '../common/header', params);
}