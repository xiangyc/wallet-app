var productIdStr = [];
var categoryIdStr =[];
var result;
var id;
var cacheTime = 0;
var cacheData;
var title='金算子';
var summary='金算子';

apiready = function(){
 	id = api.pageParam.id;
	validateCache();
}

function validateCache(){
	var cacheObj = cache.getActivityDetail(id);

	if(cacheObj && cacheObj.cacheTime){
		cacheTime = cacheObj.cacheTime;
		cacheData = cacheObj.data;
	}

	detail();
}

function detail() {
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : true,
		url : global.getRequestUri() + '/activities/' + id + '?cacheTime=' + cacheTime
	}, function(ret, err) {
		api.hideProgress();
		if (ret && ret.body) {
			bindData(ret.body);

			if(ret.headers && ret.headers.cacheTime){
				cacheTime = ret.headers.cacheTime;
			} 

			cache.setActivityDetail(id, ret.body, cacheTime);
		} else if(err && err.statusCode === global.getCacheStatusCode()){
			bindData(cacheData);
		}else{
			global.setErrorToast();
		}
	});
}

function bindData(data) {
	if(data){
		result = JSON.parse(data.product);
		if (result && result.length > 0) {
			$api.removeCls($api.byId('submitBtn'), 'hide');
		} else {
			$api.addCls($api.byId('submitBtn'), 'hide');
		}

		for (var i in result) {
			productIdStr.push(result[i].productId);
			categoryIdStr.push(result[i].categoryId);
		}

		$api.attr($api.byId('imgUrl'), 'src', global.getImgUri()+'/' + data.bannerAttach.path + '/' + data.bannerAttach.fileName)
		$api.html($api.byId('title'), data.name);

		$api.html($api.byId('content'), data.content);

		title = data.name;
		summary = data.subTitle;
		
		if (api.systemType === 'ios' ){
	    	$api.removeCls($api.byId('declare'), 'hide');
	    }

		if(data.startTime){
			if(data.endTime){
				$api.html($api.byId('activityTime'), global.formatDate(data.startTime, 'yyyy-MM-dd hh:mm') +'至' + global.formatDate(data.endTime, 'yyyy-MM-dd hh:mm'));			
			}else{
				$api.html($api.byId('activityTime'), global.formatDate(data.startTime, 'yyyy-MM-dd hh:mm') +'起') ;			
			}
		} else {
			if(data.endTime){
				$api.html($api.byId('activityTime'), global.formatDate(data.endTime, 'yyyy-MM-dd hh:mm') +'截止') ;			
			}else{
				$api.addCls($api.byId('activityTimeDivId'), 'hide');				
			}
		}
	}
}

function buyGold(){
	if (result) {
		if (result.length > 1) {
			var params = { "page" : "../productActivityList", "title" : "产品列表" ,"productIdStr" : productIdStr.toString()};
			global.openWinName("productActivityWin", 'common/header', params);
		} else {
			openProductSubWin(categoryIdStr.toString(),productIdStr.toString());
		}
	}
}

function openProductSubWin(type, id){
	if(type === 1){
		//活期
		params = { "page" : "../productActiveDetail", "title" : "随心金", "optSrc" : 1 };
		global.openWinName("productActiveDetail", 'common/product_header', params);
	}else{
		//定期
		params = { "page" : "../productDetail", "title" : "安心金", "id" : id };
		global.openWinName("productDetail", 'common/product_header', params);
	}
}

function share(){
	$api.addCls($api.byId('shareDiv'), 'share-acin');
	$api.removeCls($api.byId('shareDiv'), 'hide');
	$api.removeCls($api.byId('buybackdrop'), 'hide');
}

function closeShare(){
	$api.removeCls($api.byId('shareDiv'), 'share-acin');
	//$api.addCls($api.byId('shareDiv'), 'share-acout');
	$api.addCls($api.byId('shareDiv'), 'hide');
	$api.addCls($api.byId('buybackdrop'), 'hide');
}

function shareQzone(shareType) {
	var qq = api.require('qq');
	
	qq.installed(function(ret, err) {
		if (ret.status) {
			qq.shareNews({
				url : global.getShareUri() + '/views/activity/activity_detail.html?id=' + id,
				title : title,
				description : summary,
				//imgUrl : imgUrl,
				imgUrl : global.getShareUri() + '/images/contact-logo.jpg',
				type : shareType
			},function(ret, err) {
				if (ret.status) {
			
				} else {
					global.setToast('分享失败');
				}
			});
		} else {
			global.setToast('当前设备未安装QQ客户端');
		}
	});
}

function shareWx(shareType) {
	var wx = api.require('wx');
	wx.isInstalled(function(ret, err) {
		if (ret.installed) {
			wx.shareWebpage({
				scene : shareType,
				title : title,
				description : summary,
				thumb : 'widget://image/icon.png',
				contentUrl :  global.getShareUri() + '/views/activity/activity_detail.html?id=' + id,
			}, function(ret, err) {
				if (ret.status) {
					
				} else {
					global.setToast('分享失败');
				}
			});
		} else {
			global.setToast('当前设备未安装微信客户端');
		}
	});
}