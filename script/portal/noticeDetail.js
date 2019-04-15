var id;
var cacheTime = 0;
var cacheData;

apiready = function() {
	id = api.pageParam.id;
	validateCache();
}

function validateCache(){
	var cacheObj = cache.getNoticeDetail(id);

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
		url : global.getRequestUri() + '/notices/' + id + '?cacheTime=' + cacheTime
	}, function(ret, err) {
		api.hideProgress();
		if (ret && ret.body) {
			bindData(ret.body);

			if(ret.headers && ret.headers.cacheTime){
				cacheTime = ret.headers.cacheTime;
			} 

			cache.setNoticeDetail(id, ret.body, cacheTime);
		} else if(err && err.statusCode === global.getCacheStatusCode()){
			bindData(cacheData);
		}else{
			global.setErrorToast();
		}
	});
}

function bindData(data) {
	if(data){
		$api.html($api.byId('title'), data.title);
		$api.html($api.byId('publishTime'), global.formatDate(data.publishTime, 'yyyy-MM-dd hh:mm'));
		$api.html($api.byId('content'), data.content);
	}
}