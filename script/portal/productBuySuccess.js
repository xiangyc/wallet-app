var productId;
var orderId;

apiready = function() {
	productId = api.pageParam.productId;
    orderId = api.pageParam.orderId;

	init();
}

function init(){
	
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/activities/getBuyPeriodGoldGift?productId=' + productId + '&orderId=' + orderId
	}, function(ret, err) {
		if(ret && ret.length >0){
			
			for(var obj in ret){

			   if(ret[obj] && ret[obj].type){
				   	if(ret[obj].type == 1){//抽奖机会
						if(ret[obj].params.draw_times){
							$api.removeCls($api.byId('drawChanceDiv'), 'hide');
							$api.html($api.byId('chanceId'), ret[obj].params.draw_times);

							if(ret[obj].activityInstanceId) {
								$api.attr($api.byId("drawChanceDiv"), "onclick", "openActivityInstance(" + ret[obj].activityInstanceId + ",'" + ret[obj].name + "','" + ret[obj].linkSrc + "')");
							}
						}
					}else if(ret[obj].type == 2){//券详情
						//alert(ret[obj].params.expiredTime+'//'+global.formatDate(ret[obj].params.expiredTime, 'yyyy-MM-dd hh:mm'));
						if(ret[obj].params){
							$api.removeCls($api.byId('couponDetailDiv'), 'hide');
							$api.html($api.byId('couponValue'), ret[obj].params.couponValue);
							$api.html($api.byId('minPurchaseWeight'), ret[obj].params.minPurchaseWeight);
							$api.html($api.byId('couponName'), ret[obj].params.couponName);
							$api.html($api.byId('couponExpiredTime'), global.formatTimestamp(ret[obj].params.expiredTime, 'yyyy-MM-dd hh:mm'));
							$api.html($api.byId('couponDesc'), ret[obj].params.activityDesc);

						}
					}else if(ret[obj].type == 3){//描述
						if(ret[obj].params.desc){
							$api.removeCls($api.byId('descDiv'), 'hide');
							$api.html($api.byId('descId'), ret[obj].params.desc);
						}
					}else if(ret[obj].type == 4){//券数量
						if(ret[obj].params.coupon_count){
							$api.removeCls($api.byId('couponPackageDiv'), 'hide');
							$api.html($api.byId('couponId'), ret[obj].params.coupon_count);
						}
					}else if(ret[obj].type == 5){//砸蛋
						if(ret[obj].params.smash_times){
							$api.removeCls($api.byId('eggsPackageDiv'), 'hide');
							$api.html($api.byId('smashingeggsId'), ret[obj].params.smash_times);

							if(ret[obj].activityInstanceId) {
								$api.attr($api.byId("eggsPackageDiv"), "onclick", "openActivityInstance(" + ret[obj].activityInstanceId + ",'" + ret[obj].name + "','" + ret[obj].linkSrc + "')");
							}
						}
					}else if(ret[obj].type == 6){//投资返利
						if(ret[obj].params ){
							$api.removeCls($api.byId('cashBackDiv'), 'hide');
							$api.html($api.byId('cashBackId'), ret[obj].params.desc);
						}
					}
			   }
				
			}
		}else{
			//$api.removeAttr($api.byId('confirmBtn'), 'disabled');
			//global.setToast('订单提交失败');
		}

	});
}

function openActivityInstance(activityInstanceId, activityName, linkSrc){
    linkSrc = linkSrc + 'activityInstanceId=' + activityInstanceId;
    var params = { "page" : "../member/activityInstance", "activityInstanceId" : activityInstanceId, "title" : activityName, "url" : linkSrc, "closeToWin" : 1 };
    global.openWinName('activityInstanceHeader', './common/h5_header', params);
}

function openOrderList(){
	var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1 };
	global.openWinName('orderListHeader', './member/orderListHeader', params);
}

function closeBuy(){
	api.closeToWin({
		name:"root"
	});
}