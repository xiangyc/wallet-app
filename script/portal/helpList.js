var header = './common/header';
var cacheTime = 0;
var cacheData;

apiready = function(){
	validateCache();
}

function validateCache(){
	var cacheObj = cache.getHelpCategory();

	if(cacheObj && cacheObj.cacheTime){
		cacheTime = cacheObj.cacheTime;
		cacheData = cacheObj.data;
	}

	list();
}

function list() {
	var url = global.getRequestUri() + '/help/category-list'
	var params = '?start=0&maxResults=30&cacheTime=' + cacheTime;
	//page.init(30, 'helpType-content', 'helpType-template', url, params, false);
	
	api.ajax({
            url: url + params,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: true
        },function(ret,err){
			if (ret && ret.body) {
				bindData(ret.body);
	
				if(ret.headers && ret.headers.cacheTime){
					cacheTime = ret.headers.cacheTime;
				} 
	
				cache.setHelpCategory(ret.body, cacheTime);
			} else if(err && err.statusCode === global.getCacheStatusCode()){
				bindData(cacheData);
			}else{
				global.setErrorToast();
			}
     });
}

function bindData(data) {
	if(data){
		var template = $api.byId('helpType-template').text;
		var tempFun = doT.template(template);
      	$api.html($api.byId('helpType-content'), tempFun(data));
	}else{
		$api.html($api.byId('helpType-content'), '');
	}
}

function call(number){
	api.call({
		type: 'tel_prompt',
		number: number
	});
}

function helpCategory(categoryId,name){
	var	params = { "page" : "../helpCategoryList", "title" : name+"帮助中心", "id" : categoryId };
	global.openWinName('helpCategorySubWin', header, params);
}

function safe(type){
	switch(type){
		case 1:
			params = { "page" : "../statics/security", "title" : "金算子平台安全吗" };
			break;
		case 2:
			params = { "page" : "../statics/question01", "title" : "为什么存黄金会有收益" };
			break;
		case 3:
			params = { "page" : "../statics/question02", "title" : "如何配置我的黄金资产" };
			break;
	}

	global.openWinName('safeSubWin', header, params);
}

function safeH5(){

	var url = h5UrlSecurity;
	global.openH5Win("safeSubWin","./common/h5_header", url, '安全保障');

}


function helpCenter(){
	var params = { "page" : "../statics/newcomerGuide", "title" : "新手指引"};
	global.openWinName('newcomerGuideWin', header, params);
}

function doCustom(){
	if (!global.isValidUser()) {		
		var params = { "title" : "登录" };
		global.openWinName("loginWin", '../member/login', params);
 		return;
	}
	
	var params = { "page" : "../custom", "title" : "客服" };
	global.openWinName('customWin', './common/udesk_header', params);
}