var id;
apiready = function(){
 	id = api.pageParam.id;
 	detail();
}

function detail() {
	//alert(id);
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/finance-accounts/withdraw-applies/' + id
	}, function(ret, err) {
		api.hideProgress();
		if (ret && ret.success) {
			var cardNo = ret.obj.bankAccount.hideBankAccount.substr(ret.obj.bankAccount.hideBankAccount.length - 4,4);
			$api.html($api.byId('realMoney'), global.formatNumber(ret.obj.withdrawAmount-ret.obj.fee,2));
			$api.html($api.byId('withdrawAmount'), global.formatNumber(ret.obj.withdrawAmount,2));
			$api.html($api.byId('fee'), global.formatNumber(ret.obj.fee,2));
			$api.html($api.byId('statusValue'), ret.obj.statusValue);
			$api.html($api.byId('currentStatus'), ret.obj.statusValue);
			$api.html($api.byId('applyTime'), global.formatDate(ret.obj.applyTime, 'yyyy-MM-dd hh:mm:ss'));
			if(ret.obj.loanTime){
				$api.html($api.byId('loanTime'), global.formatDate(ret.obj.loanTime, 'yyyy-MM-dd hh:mm:ss'));
			}
			$api.html($api.byId('applyNo'), ret.obj.applyNo);
			$api.html($api.byId('bankName'), ret.obj.bankAccount.bankInfo.bankName + "(尾号" + cardNo + ")");
		}else{
			global.setErrorToast();
		}
	});
}

