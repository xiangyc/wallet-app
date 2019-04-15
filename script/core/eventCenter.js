function systemEvent(){
	initSystemEvent();
	window.setInterval("getGoldPrice();", 5000);
}

function initSystemEvent() {
	//行情更新事件
	api.addEventListener({
		name : 'goldPriceRefresh'
	}, function(ret, err) {
		//行情方法
		getGoldPrice();
	});

	//黄金资产更新事件
	api.addEventListener({
		name : 'goldAccountRefresh'
	}, function(ret, err) {
		//黄金资产方法
		getGoldAccount();
	});

	//现金资产更新事件
	api.addEventListener({
		name : 'financeAccountRefresh'
	}, function(ret, err) {
		//现金资产方法
		getFinanceAccount();
	});

	//我的资产和收益
	api.addEventListener({
		name : 'accountIncomeRefresh'
	}, function(ret, err) {
		getAccountIncome();
	});

	//个人信息更新事件
	api.addEventListener({
		name : 'userInfoRefresh'
	}, function(ret, err) {
		//个人信息方法
		getUserInfo();
	});

	//登录更新事件
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
		api.sendEvent({
	        name:'goldAccountRefresh'
        });

		api.sendEvent({
	        name:'financeAccountRefresh'
        });

        api.sendEvent({
	        name:'accountIncomeRefresh'
        });
	});
	
	//网络
	api.addEventListener({
	    name:'offline'
    },function(ret,err){
    	api.sendEvent({
	        name:'networkConnection',
	        extra: {
	        	status: 'none'
	        }
        });
    });
    api.addEventListener({
	    name:'online'
    },function(ret,err){
    	api.sendEvent({
	        name:'networkConnection',
	        extra: {
	        	status: ret.connectionType
	        }
        });
    });
    
    api.addEventListener({
        name:'getGoldAccountDataRefresh'
    },function(ret,err){
        getGoldAccountData();
    });
}

//行情方法
function getGoldPrice() {
	api.ajax({
		url : global.getRequestUri() + '/gold-prices',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret) {
		    $api.setStorage("goldPrice", ret);
			api.sendEvent({
	            name: 'goldPriceRefreshSuccess',
			    extra: {
			        value: ret
			    }
            });
		}
	});
}

//黄金资产方法
function getGoldAccount() {
	api.ajax({
		url : global.getRequestUri() + '/gold-accounts/my-gold-account',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : global.getRequestToken(),
		returnAll : false
	}, function(ret, err) {
		if(global.getToken() && ret.code && (ret.code =='2119' || ret.code =='2122')){
			global.setToast(ret.message);

			api.sendEvent({
			    name:'invalidTokenEvent'
		    });
			return;
		}
		if (ret && ret.obj) {
			$api.setStorage("goldAccountResult", ret.obj);
			api.sendEvent({
	            name: 'goldAccountRefreshSuccess'
            });
		}
	});
}

//现金资产方法
function getFinanceAccount() {
	api.ajax({
		url : global.getRequestUri() + '/finance-accounts',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : global.getRequestToken(),
		returnAll : false
	}, function(ret, err) {
		if (ret) {
			$api.setStorage("financeAccountResult", ret);
			api.sendEvent({
	            name: 'financeAccountRefreshSuccess'
			});
		}
	});
}

function getGoldAccountData(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
        	if(ret.success && ret.obj){
        		$api.setStorage("getGoldAccountDataResult", ret.obj);
				api.sendEvent({
		            name: 'getGoldAccountDataRefreshSuccess'
	            });
        	}
        }
	});
}

//我的资产和收益
function getAccountIncome() {
	api.ajax({
		url : global.getRequestUri() + '/finance-accounts/my-account-income',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : global.getRequestToken(),
		returnAll : false
	}, function(ret, err) {
		if (ret) {
			$api.setStorage("accountIncomeResult", ret);
			api.sendEvent({
	            name: 'accountIncomeRefreshSuccess'
            });
		}
	});
}

//个人信息方法
function getUserInfo() {
	api.ajax({
		url : global.getRequestUri() + '/',
		method : 'get',
		timeout : 30,
		dataType : 'json',
		headers : global.getRequestToken(),
		returnAll : false
	}, function(ret, err) {
		if (ret) {
			api.sendEvent({
	            name: 'userInfoRefreshSuccess',
			    extra: {
			        value: ret
			    }
            });
		}
	});
}