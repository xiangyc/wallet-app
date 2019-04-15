var interval = 120;
var interval;
var timer;
var bankId='1';
var cardNo='';
var idCardNo='';
var userName;
var mobile;
var bankWin = "bankAndPayPwdWin";
var header = "../common/header";
var checkBankFlag = 1;// 1未校验成功 2校验成功
var bankAccountLen = 0;//验证正确卡号的长度
var numEricId;
var idCardNoTmp;
var userNameTmp;

apiready = function(){

	if(global.getUserName().length > 0){
		$api.val($api.byId('idCardNo'), global.getUserIdCard());
		$api.val($api.byId('userName'), global.getUserName());
		$api.attr($api.byId('idCardNo'), 'disabled', 'disabled');
		$api.attr($api.byId('userName'), 'disabled', 'disabled');
	}else{
		//$api.attr($api.byId('idCardNo'), 'readonly', 'true');
		//$api.attr($api.byId('idCardNo'), 'onclick', 'showIDKeyPanel();');
	}
	//$api.attr($api.byId('numKey'), 'style', 'bottom:0');
	initEvent();
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
}

function validateMobile(){

	var mobile = $api.val($api.byId('mobile'));
	if (validate.isEmpty(mobile) || mobile.length<11 ) {	 
		$api.attr($api.byId('sendSms'), 'disabled', 'disabled');
	 	return;
	}

	if (!validate.isEmpty(mobile) && mobile.length==11) {
		if(validate.mobile(mobile)){
 			$api.removeAttr($api.byId('sendSms'), 'disabled');
		}else{
			$api.attr($api.byId('sendSms'), 'disabled', 'disabled');
			global.setToast('请输入正确的手机号码');
		}		
	}

}
function validateIDCard(){
	numEricId == 'idCardNo';
	var value = $api.val($api.byId('idCardNo'));
	value=value.replace(/[^\a-\z\A-\Z0-9]/g,'');

	$api.val($api.byId('idCardNo'),value);

	$api.removeCls($api.byId('cleanInputIDId'), 'hide'); 
}

function callbackAddNumEric(numEricHtml){
	if(numEricId && numEricId == 'cardNo'){//银行卡号
		if(numEricHtml && (numEricHtml != 'X'  || numEricHtml != '.')){
			cardNo += numEricHtml;
			
			if(cardNo.length <=25){
				validateBankCard();
			}else{
				cardNo = cardNo.substr(0,25);
			}
			
		}
	}else if(numEricId && numEricId == 'idCardNo'){//身份证号
		if(numEricHtml &&  numEricHtml != '.'){
			idCardNo  += numEricHtml;

			if(idCardNo.length <=18){

				$api.val($api.byId('idCardNo'),idCardNo);

				if (!validate.isEmpty(idCardNo) ) {	
					$api.removeCls($api.byId('cleanInputIDId'), 'hide'); 
				}
			}else{
				idCardNo = idCardNo.substr(0,18);
			}

		}
	}
}

function callbackRemoveNumEric(){
	if(cardNo && numEricId && numEricId == 'cardNo'){//银行卡号
		cardNo = cardNo.substr(0, cardNo.length - 1);  

		validateBankCard();
	}else if(idCardNo && numEricId && numEricId == 'idCardNo'){//身份证号
		idCardNo = idCardNo.substr(0, idCardNo.length - 1);  

		$api.val($api.byId('idCardNo'),idCardNo);

		if (validate.isEmpty(idCardNo) ) {	
			$api.addCls($api.byId('cleanInputIDId'), 'hide'); 
		}
	}
} 

function callbackBeSure(){
	$api.addCls($api.byId('numKey'), 'hide');
}

function showBankKeyPanel(){
	$api.addCls($api.byId('cardNo'), 'active');
	$api.removeCls($api.byId('idCardNo'), 'active');
	blurKeyPanel();

	setTimeout(function(){
		numEricId = 'cardNo';

		$api.addCls($api.byId('numEricXID'), 'active');

		$api.removeCls($api.byId('numKey'), 'hide');
		//$api.attr($api.byId('numKey'), 'style', 'bottom:0');
	      
    }, 100);
}

function showIDKeyPanel(){
	$api.addCls($api.byId('idCardNo'), 'active');
	$api.removeCls($api.byId('cardNo'), 'active');
	
	blurKeyPanel();

	setTimeout(function(){
		numEricId = 'idCardNo';

		$api.removeCls($api.byId('numEricXID'), 'active');

		$api.removeCls($api.byId('numKey'), 'hide');
		//$api.attr($api.byId('numKey'), 'style', 'bottom:0');
      
    }, 100);
	
}

function blurKeyPanel(){
	$api.byId('userName').blur();
	$api.byId('mobile').blur();
	$api.byId('smsCode').blur();
}

function hideKeyPannel(){
	$api.removeCls($api.byId('idCardNo'), 'active');
	$api.removeCls($api.byId('cardNo'), 'active');

	$api.addCls($api.byId('numKey'), 'hide');
}

function cleanInput(cleanInputID,bzId){
	$api.addCls($api.byId(cleanInputID), 'hide');
	$api.val($api.byId(bzId),'');

	if(cleanInputID == 'cleanInputIDId'){
		idCardNo ='';
	}

	if(cleanInputID == 'cleanInputBankId'){
		cardNo ='';
		checkBankFlag =1;
		
		$api.addCls($api.byId('bankCardNoTips'), 'hide'); 
		$api.addCls($api.byId('cardShowDiv'), 'hide'); 
		$api.html($api.byId('bankName'),'');
		$api.html($api.byId('quotaName'),'');
		
	}
	
}

//获取到银行卡焦点时触发
function validateBankCard0(){
	cardNo = $api.val($api.byId('cardNo'));
	if(!validate.isEmpty(cardNo)){
		//显示
		$api.removeCls($api.byId('cardShowDiv'), 'hide'); 
		$api.html($api.byId('cardNoDiv'), cardNo.replace(/\s/g,'').replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,"$1 "));
	}
}

//校验银行卡
function validateBankCard1(){
	numEricId == 'cardNo';

	cardNo = $api.val($api.byId('cardNo'));
	if(!validate.isEmpty(cardNo)){
		$api.html($api.byId('cardNoDiv'), cardNo.replace(/\s/g,'').replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,"$1 "));

		$api.removeCls($api.byId('cleanInputBankId'), 'hide'); 
		$api.removeCls($api.byId('cardShowDiv'), 'hide'); 
	}else{
		$api.val($api.byId('cardNo'),'');

		$api.addCls($api.byId('cleanInputBankId'), 'hide'); 

		checkBankFlag =1;

		$api.addCls($api.byId('bankCardNoTips'), 'hide'); 
		$api.addCls($api.byId('cardShowDiv'), 'hide'); 
		$api.html($api.byId('bankName'),'');
		$api.html($api.byId('quotaName'),'');
	}

}

//失去焦点查询银行卡
function validateBankCard2(){
	// numEricId == 'cardNo';

	// cardNo = $api.val($api.byId('cardNo'));
	// if(!validate.isEmpty(cardNo)){
	// 	$api.val($api.byId('cardNo'), cardNo.replace(/\s/g,'').replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,"$1 "));

	// 	$api.removeCls($api.byId('cleanInputBankId'), 'hide'); 
	// }else{
	// 	$api.val($api.byId('cardNo'),'');

	// 	$api.addCls($api.byId('cleanInputBankId'), 'hide'); 
	// }
	$api.addCls($api.byId('cardShowDiv'), 'hide'); 

	if (!validate.isEmpty(cardNo)  && cardNo.length > 13  && checkBankFlag ==1 ) {
		api.ajax({
			method : "get",
			url : global.getRequestUri() + "/bank-info?cardNo="+cardNo.replace(/ /g,''),
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken()
		}, function(ret, err) {
			//alert(JSON.stringify(ret));
			if(ret){
				if(ret.success){
					checkBankFlag =2;
					bankAccountLen = cardNo.length;

					var maxQuota_  = ret.obj.maxQuota/10000;
					var maxSingleQuota_ = ret.obj.maxSingleQuota/10000;

					if(ret.obj.maxQuota%10000 >0){
						 maxQuota_ = (ret.obj.maxQuota/10000).toFixed(4);
					}
					if(ret.obj.maxSingleQuota%10000 >0){
						 maxSingleQuota_ = (ret.obj.maxSingleQuota/10000).toFixed(4);
					}
					$api.removeCls($api.byId('bankCardNoTips'), 'hide'); 
					$api.html($api.byId('bankName'),ret.obj.bankName);
					$api.html($api.byId('quotaName'), '单日限额:'+ maxQuota_
					+'万,单笔限额:'+ maxSingleQuota_+'万' );	
				}else{
					checkBankFlag = 1;
					$api.removeCls($api.byId('bankCardNoTips'), 'hide'); 
					$api.html($api.byId('quotaName'),ret.message);

				}
			}
			
		});
	}

	if (!validate.isEmpty(cardNo)  && cardNo.length <=10 ) {
		checkBankFlag = 1;
		
		$api.addCls($api.byId('cardShowDiv'), 'hide'); 
		$api.html($api.byId('bankName'),'');
		$api.html($api.byId('quotaName'),'');
	}

}
    
function validateData(){
	//bankId = $api.val($api.byId('bankId'));
	cardNo = $api.val($api.byId('cardNo'));
	cardNo = cardNo.replace(/ /g,'');

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
	
	if(checkBankFlag ==1){
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
	// cardNo = new Base64().encode(cardNo);
	// idCardNo = new Base64().encode(idCardNo);
	// mobile = new Base64().encode(mobile);
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
				'cardNo' : new Base64().encode(cardNo),
				'idCardNo' : new Base64().encode(idCardNo),
				'userName' : userName,
				'mobile' : new Base64().encode(mobile)
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){
				idCardNoTmp = ret.message;
				userNameTmp = ret.code;
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
				global.setToast('实名绑卡成功！');
				global.setUserIdCard(idCardNoTmp);
				global.setUserName(userNameTmp);			
				global.setUserBindCard(true);
				
				api.sendEvent({
					name : 'userBindCardRefresh',
					extra: {
						bindCard: true,
						userIdCard: ret.message,
						auth: api.pageParam.auth,
						reBind: api.pageParam.reBind
					}
				});

				//交易密码
				if(global.getUserPayPassword() === '0'){
					setTimeout(function(){
						params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" ,'optSrc' :'bindBankCardSuccess'};
						global.openWinName('bindCardPayPwdWin', header, params);
					}, 1000);
				}

			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setToast('绑定失败')
		}

		$api.attr($api.byId('confirmBtn'), 'onclick', 'bindSubmit();')
	});
}

function openBankList(){
	var url= h5UrlBankList;
    global.openH5Win("bankList","../common/h5_header", url, '银行限额表');
}

function question(){
	var header = '../common/header';
	var	params = { "page" : "../helpCategoryList", "title" : "实名绑卡帮助中心", "id" : 2 };
	global.openWinName('helpCategorySubWin', header, params);
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
