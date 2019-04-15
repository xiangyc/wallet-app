var id;
var cacheTime = 0;
var cacheData;
var title;
var summary;
var imgUrl;

apiready = function() {
	id = api.pageParam.id;
	validateCache();
}

function validateCache() {
	var cacheObj = cache.getInfoDetail(id);

	if (cacheObj && cacheObj.cacheTime) {
		cacheTime = cacheObj.cacheTime;
		cacheData = cacheObj.data;
	}

	detail();
}

function detail() {
	api.showProgress({
		title : '数据加载中...',
		modal : false
	});
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : true,
		url : global.getRequestUri() + '/infos/' + id + '?cacheTime=' + cacheTime
	}, function(ret, err) {
		api.hideProgress();
		
		if (ret && ret.body) {
			$api.addCls($api.byId('bodyDiv'), 'mui-bg-white');
			$api.removeCls($api.byId('newsDiv'), 'hide');
			$api.addCls($api.byId('mainDiv'), 'hide');
				
			bindData(ret.body);

			if(ret.headers && ret.headers.cacheTime){
				cacheTime = ret.headers.cacheTime;
			} 

			cache.setInfoDetail(id, ret.body, cacheTime);
		} else if(err && err.statusCode === global.getCacheStatusCode()){
			bindData(cacheData);
		}else{
			global.setErrorToast();
			$api.removeCls($api.byId('bodyDiv'), 'mui-bg-white');
			$api.addCls($api.byId('newsDiv'), 'hide');
			$api.removeCls($api.byId('mainDiv'), 'hide');
		}
		
	});
}

function bindData(data) {
	if (data) {
		
		$api.html($api.byId('title'), data.title);
		$api.html($api.byId('publishTime'), global.formatDate(data.publishTime, 'yyyy-MM-dd hh:mm'));
		$api.html($api.byId('source'), data.source);
		$api.html($api.byId('content'), data.content);

		title = data.title;
		summary = data.summary;
		imgUrl = data.shareImg;
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
	if(!imgUrl){
		imgUrl = 'widget://image/contact-logo.jpg';
	}
	
	qq.installed(function(ret, err) {
		if (ret.status) {
			qq.shareNews({
				url : global.getShareUri() + '/views/info/detail.html?id=' + id,
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
				contentUrl :  global.getShareUri() + '/views/info/detail.html?id=' + id,
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