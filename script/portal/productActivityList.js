var maxResults = 10;
var header = "common/header";
var bindCardWinName = "bindCardWin";
var payPasswordWinName = "payPasswordWin";
var params;
var productIdStr;
	
apiready = function(){
	productIdStr = api.pageParam.productIdStr;
	queryActivityProduct();
	initEvent();
}

function initEvent(){
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
		queryActivityProduct();
    });
}

function queryActivityProduct() {
	var url = global.getRequestUri() + '/investment-products/products'
	var params = '?start=0&maxResults=' + maxResults + "&productIdStr=" + productIdStr;
	page.init(maxResults, 'period-content', 'period-template', url, params, false, '');
}

function openProductSubWin(type, id, name){
	if(type === 1){
		//活期
		params = { "page" : "../productActiveDetail", "title" : name, "optSrc" :1 };
		global.openWinName("productActiveDetail", './common/product_header', params);
	}else{
		//定期
		params = { "page" : "../productDetail", "title" : name, "id" : id };
		global.openWinName("productDetail", './common/product_header', params);
	}
}