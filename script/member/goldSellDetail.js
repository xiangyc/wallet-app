var id ;
apiready = function(){
    id = api.pageParam.id;
 	detail(id);

}
//卖金详情
function detail(id) {
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/sell-orders/'+id,
		headers : global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		if (ret) {
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){	
				global.setToast(ret.message);
				api.sendEvent({
			   	   name:'invalidTokenEvent'
		    	});
			}else{
	            $api.html($api.byId('orderNo'), ret.orderNo);
	            $api.html($api.byId('createTime'), global.formatDate(ret.createTime, 'yyyy-MM-dd hh:mm:ss'));
	            $api.html($api.byId('totalPrice'), global.formatNumber(ret.totalPrice,2));
	            $api.html($api.byId('fee'), global.formatNumber(ret.fee,2));
	            $api.html($api.byId('amount'), global.formatNumber(ret.amount/1000,3));
	            $api.html($api.byId('sellIncome'), global.formatNumber(ret.totalPrice-ret.fee,2));
	            $api.html($api.byId('goldPrice'), global.formatNumber(ret.goldPrice,2));

	            if (ret.order) {
	            	$api.html($api.byId('sellType'), ret.order.investmentProduct.category.name);
	            }
	        }
		} else {
			global.setErrorToast();
		}
	});
}