var subTitle,linkSrc,hotId,title;

apiready = function(){
	initEvent();
	global.networkStatus('noneNetworkDiv', 'mainDiv');
 	list();
 	hotRecommend();
 	queryLanmu();
}

// 新闻资讯top5
function list() {
	var params = '?start=0&maxResults=5';
	api.ajax({
            url: global.getRequestUri() + '/infos/news' + params,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
			headers: global.getRequestToken()
        },function(ret,err){
			if (ret) {
				var data = ret;
				var template = $api.byId('news-template').text;
				var tempFun = doT.template(template);
		      	$api.html($api.byId('news-content'), tempFun(data.items));
			} 
     });
}

//热门推荐活动
function hotRecommend() {
	api.ajax({
		url : global.getRequestUri() + '/activities/recommend',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers: global.getRequestToken()
	}, function(ret, err) {
		if (ret) {
			hotId = ret.id;
			subTitle = ret.subTitle;
			linkSrc = ret.linkSrc;
			title = ret.name;

			$api.removeCls($api.byId('hotRecommendDiv'), 'hide');
			$api.attr($api.byId('imgSrc'), 'src', global.getImgUri() +'/'+ ret.bannerAttach.path + '/' +ret.bannerAttach.fileName);
			$api.html($api.byId('titleName'), ret.name);
		}else{
			$api.addCls($api.byId('hotRecommendDiv'), 'hide');
		}
	});
}

// 发现栏目，最多16个
function queryLanmu(){
	var params = '?type=3&start=0&maxResults=16';
	api.ajax({
            url: global.getRequestUri() + '/page-content' + params,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
			headers: global.getRequestToken()
        },function(ret,err){
			if (ret) {
				var data = ret;
				var template = $api.byId('lanmu-template').text;
				var tempFun = doT.template(template);
		      	$api.html($api.byId('lanmu-content'), tempFun(data.items));
			} 
     });
}


function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		list();
		hotRecommend();
 		queryLanmu();
		api.refreshHeaderLoadDone();
	});

	api.addEventListener({
		name : 'scrolltobottom',
		extra : {
			threshold : 0
		}
	}, function(ret, err) {
		page.scrollRefresh();
	});
	
	api.addEventListener({
	    name:'networkConnection'
    },function(ret,err){
		global.networkStatus('noneNetworkDiv', 'mainDiv');
    });
    
	api.addEventListener({
	    name:'connectionSuccess'
    },function(ret,err){
		list();
		hotRecommend();
 		queryLanmu();
    });
}

function detail(id){
	var header = './activity/activityHeader';
	var	params = { "page" : "../newsDetail", "title" : "新闻资讯", "id" : id };
	global.openWinName('newsDetailSubWin', header, params);
}

function openSubWin(item) {
	var header = 'common/header';
	var params;
	
	switch(item) {
		case 1:
			params = { "page" : "../statics/security", "title" : "安全保障" };
			break;
		case 2:
			params = { "page" : "../activityList", "title" : "热门活动"};
			break;
		case 4:
			header = "./common/adv_header";
			global.openHybridWin('discoverSubWin', header, global.getH5url() + '/html/portal/infoList.html?backSrc=app&title=新闻资讯', "新闻资讯", 0, '');
			return;
			break;
		case 5:
			params = {"title" : "活动详情", "title" : title,  "subTitle": subTitle, "linkSrc": linkSrc, id:hotId , isShare:1};
			global.openWinName('activityWebWin', './activity/activityWebHeader',  params);
			return;
		case 3:
		header = 'common/custom_header';
		params = { "page" : "../helpList", "title" : "帮助中心"};
		break;	
	}

	global.openWinName('discoverSubWin', header, params);
}

function openPalaceWin(src, text, headType,pageParams){
	var code;
	
	if(pageParams){
		var obj =eval('(' + pageParams + ')');
		code = obj.code;
	}
 	
	var palaceHeader = "./common/adv_header";
	var showHeader = 1;
	var palaceWinName = 'palaceWin';
	switch(headType){
		case 1:
			//公共
			showHeader = 1;
			break;
		case 2:
			//混合
			palaceWinName = "mainPartner";
			showHeader = 0;
			palaceHeader = "./common/h5_header";
			break;
		case 3:
			//H5
			showHeader = 0;
			palaceHeader = "./common/adv_header";
			break;
	}
	
	global.openHybridWin(palaceWinName, palaceHeader, src + '?backSrc=app&title='+text+'&code='+code, text, showHeader, pageParams);
}