var maxResults = 2;
var url = global.getRequestUri() + '/shop-product/hot';
var header = "../common/header";
var bindCardWinName = "bindCardWin";
var payPasswordWinName = "payPasswordWin";
var params;
	
apiready = function(){
	var financeAccountResult = $api.getStorage("financeAccountResult");
	if (financeAccountResult) {
        showResultData();
	} else {
		api.sendEvent({
	        name:'financeAccountRefresh'
        });
	}

	queryRecommendProduct();
	initEvent();
}

function initEvent(){
	// api.setCustomRefreshHeaderInfo({
	//  	bgColor: '#f8f8f8',
	//     image: {
	//         pull: global.pullImage(),
	//         load: global.loadImage()
	//     }
	// }, function() {
	// 	api.refreshHeaderLoadDone();
	// 	api.sendEvent({
	//         name:'financeAccountRefresh'
 //        });
	// });
	
	api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	$api.removeCls($api.byId('eyeImg'), 'animation-rotate');
    	showResultData();
    });
    
    api.addEventListener({
		name : 'userBindCardRefresh'
	}, function(ret, err) {
		if(global.getUserPayPassword() === '1'){
			api.closeWin({
				name : bindCardWinName
			});
		}
	});
	
	api.addEventListener({
		name : 'payPasswordRefresh'
	}, function(ret, err) {
		api.closeWin({
			name : payPasswordWinName
		});
	});
	
	api.addEventListener({
	    name:'activityEnd'
    },function(ret,err){
		queryRecommendProduct();
    });
}

function showResultData() {
    var ret = $api.getStorage("financeAccountResult");
    if(ret){
	    $api.html($api.byId('accountBalance'), global.formatCurrency(ret.accountBalance));
	    $api.html($api.byId('useBalance'), global.formatCurrency(ret.useBalance));
	    $api.html($api.byId('frozenAmount'), global.formatCurrency(ret.frozenAmount));
    }
}

function queryRecommendProduct() {
	page.init(maxResults, 'recommend-content', 'recommend-template', url, "", false, '');
}

function openShopDetail(id, name){
	global.openHybridWin('shopWin','../common/adv_header', global.getH5url() + '/html/goldshop/shopDetail.html?productId=' + id + '&backSrc=app', name, 0, '');
}

function openSubWin(type){
	//实名
	if(!global.getUserIdCard()){
		params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1  };

		header = "../common/custom_header";
		return global.validIdCardTooltip(bindCardWinName, header, params);
	}
	//绑卡
	if(global.getUserBindCard() === '0'){
		header = "../common/custom_header";
		params = { "page" : "../member/bindNewBankCard", "title" : "绑定银行卡" };
		return global.validBindCardTooltip(bindCardWinName, header, params);
	}
	//交易密码
	if(global.getUserPayPassword() === '0'){
		params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
		return global.validPayPasswordTooltip(bindCardWinName, header, params);
	}
			
	if(type === 1){
		//充值
		header = "../common/custom_header";
		params = { "page" : "../member/recharge", "title" : "充值" };
		global.openWinName("recharge", header, params);
	}else{
		//提现
		global.openWin("../member/withdrawHeader", null);
	}
}


function openProductSubWin(type, id, name){
	if(type === 1){
		//活期
		params = { "page" : "../productActiveDetail", "title" : name, "optSrc" : 1 };
		global.openWinName("productActiveDetail", '../common/product_header', params);
	}else{
		//定期
		params = { "page" : "../productDetail", "title" : name, "id" : id };
		global.openWinName("productDetail", '../common/product_header', params);
	}
}

function  showHide(){

	$api.addCls($api.byId('eyeImg'), 'animation-rotate');

	api.sendEvent({
	    name:'financeAccountRefresh'
	});
}