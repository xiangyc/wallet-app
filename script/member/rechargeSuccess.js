apiready = function(){
	//获取充值金额
	$api.html($api.byId('amountI'), global.formatCurrency(api.pageParam.amount));
	
	//获取充值活动
	getRechargeActivity(api.pageParam.orderNo);
	
	//获取推荐活动
	getRecommendActivity();
}

/**
 * 大额提示
 */
// function openlargeRecharge(){
//     global.openH5Win("largeRecharge","../common/h5_header", h5UrllargeRecharge, '更多充值方式');
// }

/**
 * 显示充值后结果
 * @param {Object} orderNo
 */
function getRechargeActivity(orderNo){
	api.ajax({
		url : global.getRequestUri() + '/activities/rechargeGiftList?orderNo=' + orderNo,
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret && ret.length > 0) {
			for(var obj in ret){
			   if(ret[obj] && ret[obj].type){
				   	if(ret[obj].type == 1){//抽奖机会
						if(ret[obj].value && ret[obj].value > 0){
							$api.removeCls($api.byId('drawChanceDiv'), 'hide');
							$api.html($api.byId('chanceId'), ret[obj].value);

							if(ret[obj].activityInstanceId) {
								$api.attr($api.byId("drawChanceDiv"), "onclick", "openActivityInstance(" + ret[obj].activityInstanceId + ",'" + ret[obj].name + "','" + ret[obj].linkSrc + "')");
							}
						}
					}else if(ret[obj].type == 2){//券
						if(ret[obj].value && ret[obj].value > 0){
							$api.removeCls($api.byId('couponPackageDiv'), 'hide');
							$api.html($api.byId('couponId'), ret[obj].value);
						}
					}else if(ret[obj].type == 3){//砸蛋
						if(ret[obj].value && ret[obj].value > 0){
							$api.removeCls($api.byId('eggsPackageDiv'), 'hide');
							$api.html($api.byId('smashingeggsId'), ret[obj].value);

							if(ret[obj].activityInstanceId) {
								$api.attr($api.byId("eggsPackageDiv"), "onclick", "openActivityInstance(" + ret[obj].activityInstanceId + ",'" + ret[obj].name + "','" + ret[obj].linkSrc + "')");
							}
						}
					}else if(ret[obj].type == 4){//投资返利
						if(ret[obj].desc ){
							$api.removeCls($api.byId('cashBackDiv'), 'hide');
							$api.html($api.byId('cashBackId'), ret[obj].desc);
						}
					}
			   }
				
			}
		}
	});
}

/**
 * 推荐位活动
 */
function getRecommendActivity(){
	api.ajax({
		url : global.getRequestUri() + '/banners?start=0&maxResults=1&bannerType=5',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret && ret.items && ret.items.length > 0) {
			$api.removeCls($api.byId('recommendDiv'), "hide");
			$api.attr($api.byId('newerGoldImg'), "onclick", "openSubWin(" + ret.items[0].activityType + ',' + ret.items[0].type + ',' + ret.items[0].relativeId + ")");
			$api.attr($api.byId('newerGoldImg'), 'src', global.getImgUri() + ret.items[0].imgurl);
		}
	});
}

function openSubWin(activityType, type, relativeId){
	api.execScript({
		name: 'root',
		frameName: 'indexFrame',
	    script: 'openActivityDetail(' + activityType + ',' + type + ',' + relativeId + ');'
    });
}

/**
 * 打开页面
 * @param {Object} activityInstanceId
 * @param {Object} activityName
 * @param {Object} linkSrc
 */
function openActivityInstance(activityInstanceId, activityName, linkSrc){
    linkSrc = linkSrc + 'activityInstanceId=' + activityInstanceId;
    var params = { "page" : "../member/activityInstance", "activityInstanceId" : activityInstanceId, "title" : activityName, "url" : linkSrc, "closeToWin" : 1 };
    global.openWinName('activityInstanceHeader', '../common/h5_header', params);
}