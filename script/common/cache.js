(function(window) {
	var c = {};
	var noticeList = 'NoticeList';
	var noticeDetail = 'NoticeDetail';
	var activityList = 'ActivityList';
	var activityDetail = 'ActivityDetail';
	var infoList = 'InfoList';
	var infoDetail = 'InfoDetail';
	var indexProductList = 'IndexProductList';
	var activeProductList = 'ActiveProductList';
	var periodProductList = 'PeriodProductList';
	var productDetail = 'ProductDetail';
	var helpCategory = 'HelpCategory';
	var helpList = 'HelpList';
	var bannerList = 'BannerList';
	
	c.getNoticeList = function () {
		var listTemp = $api.getStorage(noticeList);
		var resultData = getCachePageData(listTemp, pageNo, pageSize);
		
		if(resultData.length === 0){
			api.toast({
				msg: '没有查询到数据',
				duration:2000,
				location: 'middle'
        	});
		}
		
		return resultData;
	}
	
	c.setNoticeList = function (value, append) {
		var listTemp = $api.getStorage(noticeList);
		if(append && listTemp){
			listTemp.push(value);
			$api.setStorage(noticeList,{ "data": listTemp, "cacheTime": cacheTime});
		}else{
			$api.setStorage(noticeList,{ "data": value, "cacheTime": cacheTime});
		}
	}
	
	c.getNoticeDetail = function (id) {
		return $api.getStorage(noticeDetail + id);
	}
	
	c.setNoticeDetail = function (id, value, cacheTime) {
		$api.setStorage(noticeDetail + id,{ "data": value, "cacheTime": cacheTime});
	}
	
	c.getActivityList = function () {
		var listTemp = $api.getStorage(activityList);
		var resultData = getCachePageData(listTemp, pageNo, pageSize);
		
		if(resultData.length === 0){
			api.toast({
				msg: '没有查询到数据',
				duration:2000,
				location: 'middle'
        	});
		}
		
		return resultData;
	}
	
	c.setActivityList = function (value, append, cacheTime) {
		var listTemp = $api.getStorage(activityList);
		if(append && listTemp){
			listTemp.push(value);
			$api.setStorage(activityList,{ "data": listTemp, "cacheTime": cacheTime});
		}else{
			$api.setStorage(activityList,{ "data": value, "cacheTime": cacheTime});
		}
	}
	
	c.getActivityDetail = function (id) {
		return  $api.getStorage(activityDetail + id);
	}
	
	c.setActivityDetail = function (id, value, cacheTime) {
		$api.setStorage(activityDetail + id,{ "data": value, "cacheTime": cacheTime});
	}

	c.getInfoList = function (pageNo, pageSize) {
		var listTemp = $api.getStorage(infoList);
		var resultData = getCachePageData(listTemp, pageNo, pageSize);
		
		if(resultData.length === 0){
			api.toast({
				msg: '没有查询到数据',
				duration:2000,
				location: 'middle'
        	});
		}
		
		return resultData;
	}
	
	c.setInfoList = function (value, append, cacheTime) {
		var listTemp = $api.getStorage(infoList);
		if(append && listTemp){
			listTemp.push(value);
			$api.setStorage(infoList,{ "data": listTemp, "cacheTime": cacheTime});
		}else{
			$api.setStorage(infoList,{ "data": value, "cacheTime": cacheTime});
		}
	}
	
	c.getInfoDetail = function (id) {
		return $api.getStorage(infoDetail + id);
	}
	
	c.setInfoDetail = function (id, value, cacheTime) {
		$api.setStorage(infoDetail + id,{ "data": value, "cacheTime": cacheTime});
	}
	
	c.getIndexProductList = function () {
		return $api.getStorage(indexProductList);
	}
	
	c.setIndexProductList = function (value, cacheTime) {
		$api.setStorage(indexProductList, { "data": value, "cacheTime": cacheTime});
	}
	
	c.getActiveProductList = function () {
		return $api.getStorage(activeProductList);
	}
	
	c.setActiveProductList = function (value, cacheTime) {
		$api.setStorage(activeProductList, { "data": value, "cacheTime": cacheTime});
	}
	
	c.getPeriodProductList = function () {
		return $api.getStorage(periodProductList);
	}
	
	c.setPeriodProductList = function (value, cacheTime) {
		$api.setStorage(periodProductList, { "data": value, "cacheTime": cacheTime});
	}
	
	c.getProductDetail = function (id) {
		return $api.getStorage(productDetail + id);
	}
	
	c.setProductDetail = function (id, value, cacheTime) {
		$api.setStorage(productDetail + id, { "data": value, "cacheTime": cacheTime});
	}
	
	c.getHelpCategory = function () {
		return $api.getStorage(helpCategory);
	}
	
	c.setHelpCategory = function (value, cacheTime) {
		return $api.setStorage(helpCategory, { "data": value, "cacheTime": cacheTime});
	}
	
	c.getHelpList = function (categoryId) {
		return $api.getStorage(helpList + categoryId);
	}
	
	c.setHelpList = function (categoryId, value, cacheTime) {
		$api.setStorage(helpList + categoryId, { "data": value, "cacheTime": cacheTime});
	}

	c.getBannerList = function () {
		return $api.getStorage(bannerList);
	}
	
	c.setBannerList = function (value, cacheTime) {
		return $api.setStorage(bannerList, { "data": value, "cacheTime": cacheTime});
	}
	
	c.getCachePageData = function (listTemp, pageNo, pageSize){
		var resultData = [];
		//分页数据处理
		if(listTemp && listTemp.length > 0){
			for(var i = 0; i < listTemp.length; i++){
				if(i >= (pageNo -1) * pageSize){
					resultData.push(listTemp[i]);
					
					if(resultData.length === pageSize){
						break;
					}
				}
			}
		}
		
		return resultData;
	}
	
	window.cache = c;
})(window);