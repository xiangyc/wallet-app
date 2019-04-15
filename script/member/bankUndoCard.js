apiready = function(){
	var ret = $api.getStorage("bankAccount");
	if(ret && ret.member.hideName){
		$api.html($api.byId('name'), ret.member.hideName);
		$api.html($api.byId('account'), ret.hideBankAccount);
		$api.html($api.byId('bankName'), ret.bankInfo.bankName);
		if(ret.bankInfo.icon){
			var iconName = ret.bankInfo.icon;
			$api.attr($api.byId('icon'), 'src', '../../image/member/bank-icon/' + iconName);
		}
				
	}
}

function next(){
	var header = "../common/header";
	var params = { "page" : "../member/bankUndoCardData", "title" : "解绑银行卡" };

	global.openWinName('bankUndoCardDataWin', header, params);
}
