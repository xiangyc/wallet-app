var choiceId = null;
var id;
var cacheTime = 0;
var cacheData;

apiready = function(){
 	id = api.pageParam.id;
	validateCache();
}

function validateCache(){
	var cacheObj = cache.getHelpList(id);

	if(cacheObj && cacheObj.cacheTime){
		cacheTime = cacheObj.cacheTime;
		cacheData = cacheObj.data;
	}

	list();
}
    
function list() {
	//var url = global.getRequestUri() + '/help/list?category='+id
	//page.init(50, 'helpCategory-content', 'helpCategory-template', url, '', false);
	
	var url = global.getRequestUri() + '/help/list';
	var params = '?start=0&maxResults=30&category=' + id + '&cacheTime=' + cacheTime;
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
	
				cache.setHelpList(id, ret.body, cacheTime);
			} else if(err && err.statusCode === global.getCacheStatusCode()){
				bindData(cacheData);
			}else{
				global.setErrorToast();
			}
     });
}

function bindData(data) {
	if(data){
		var template = $api.byId('helpCategory-template').text;
		var tempFun = doT.template(template);
      	$api.html($api.byId('helpCategory-content'), tempFun(data));
	}else{
		$api.html($api.byId('helpCategory-content'), '');
	}
}

function showContent(id){

	if($api.hasCls($api.byId('li'+id), 'mui-active')){

		$api.removeCls($api.byId('li'+id), 'mui-active');
	}else{

		$api.addCls($api.byId('li'+id), 'mui-active');
	}
	
	if(choiceId!=null && choiceId!=id){
		$api.removeCls($api.byId('li'+choiceId), 'mui-active');
	}

	choiceId = id;
}