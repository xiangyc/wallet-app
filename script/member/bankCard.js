
apiready = function(){

	getBankCard();

	initEvent();
}

function initEvent(){
	api.addEventListener({
		name : 'userBindCardRefresh'
	}, function(ret, err) {

		api.closeWin({
	  		name : 'reBindCardSubWinabc'
	  	});

	  	api.closeWin({
	  		name : 'bindCardWin'
	  	});

		getBankCard();
	});

	api.addEventListener({
		name : 'bankUndoCardDataEvent'
	}, function(ret, err) {
		
	    $api.html($api.byId('unBundlingName'), '解绑中');

	    $api.removeAttr($api.byId('unBundlingId'), 'onclick');
		
	});
	
	api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {   
        api.closeWin({
			name : 'bindCardPayPwdWin'
		});
    });
	
}

function getBankCard() {
	api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		url : global.getRequestUri() + '/bank-accounts/',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		if (ret && ret.success) {
			var data = ret.obj;
			if(data){
				var status = data.status;
				if(status ==2){//解绑中
					$api.setStorage("bankAccount", data);
					loadBankAccount();

					$api.html($api.byId('unBundlingName'), '解绑中');
		  			$api.removeAttr($api.byId('unBundlingId'), 'onclick');
				}else if(status ==1){//正常
	        		$api.attr($api.byId('unBundlingId'), 'onclick','unBundling();');
					$api.setStorage("bankAccount", data);
					loadBankAccount();
				}
			}else{//已解绑
				$api.addCls($api.byId('bankDivId1'), 'hide');
				$api.addCls($api.byId('bankDivId2'), 'hide');
				$api.removeCls($api.byId('rebankDivId1'), 'hide');
				$api.removeCls($api.byId('rebankDivId2'), 'hide');

				$api.html($api.byId('hideName2'), global.getUserName());
				$api.html($api.byId('idCard2'), global.getUserIdCard());
			}
		}
	});
}

function loadBankAccount(){
	var ret = $api.getStorage("bankAccount");
	if(ret && ret.member.hideName){
		
		$api.html($api.byId('name'), ret.member.hideName);
		$api.html($api.byId('account'), ret.hideBankAccount);
		$api.html($api.byId('bankName'), ret.bankInfo.bankName);

		$api.html($api.byId('hideName'), ret.member.hideName);
		$api.html($api.byId('idCard'), ret.member.hideIdCard);
		$api.html($api.byId('hideBankMobile'), ret.hideBankMobile);

		if(ret.bankInfo.icon){
			var iconName = ret.bankInfo.icon;
			$api.attr($api.byId('icon'), 'src', '../../image/member/bank-icon/' + iconName);
			$api.addCls($api.byId('backDiv'), iconName.substring(0, iconName.indexOf('.')));			
		}
				
		$api.addCls($api.byId('bindBtn'), 'hide');
		//$api.removeCls($api.byId('unBindBtn'), 'hide');

		var maxQuota_  = ret.bankInfo.maxQuota/10000;
		var maxSingleQuota_ = ret.bankInfo.maxSingleQuota/10000;

		if(ret.bankInfo.maxQuota%10000 >0){
			 maxQuota_ = (ret.bankInfo.maxQuota/10000).toFixed(4);
		}
		if(ret.bankInfo.maxSingleQuota%10000 >0){
			 maxSingleQuota_ = (ret.bankInfo.maxSingleQuota/10000).toFixed(4);
		}

		var bankStatus = ret.bankInfo.status;
		if(bankStatus ==2){
			$api.html($api.byId('quotaName'), '银行维护中' );
		}else{
			$api.html($api.byId('quotaName'), '单日限额:'+ maxQuota_
			+'万,单笔限额:'+ maxSingleQuota_+'万' );		
		}
	}
}

function bindCard(){
	var header = "../common/custom_header";
	var params = { "page" : "../member/bindNewBankCard", "title" : "实名绑卡", "auth" : 1 ,"reBind": 1};
	var winName = "reBindCardSubWinabc";

	global.openWinName(winName, header, params);
}

function openBankList(){
	var url= h5UrlBankList;
    global.openH5Win("bankList","../common/h5_header", url, '银行限额表');
}

function call(number) {
	api.call({
		type : 'tel_prompt',
		number : number
	});
}

function unBundling(){
	var header = "../common/header";
	var params = { "page" : "../member/bankUndoCardData", "title" : "解绑银行卡" };

	global.openWinName('bankUndoCardDataWin', header, params);
}


function bankList(){
	var url= h5UrlBankList;
    global.openH5Win("bankList","../common/h5_header", url, '银行限额表');
}