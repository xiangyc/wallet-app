var pageParams;

apiready = function(){

	pageParams = api.pageParam.pageParams;
	initEvent();
 	list();
}

// 新闻资讯列表
function list() {
	var url = global.getRequestUri() + '/infos/news'
	var params = '?start=0&maxResults=10';
	if(pageParams) {
		var code = eval('(' + pageParams + ')').code;
		url = global.getRequestUri() + '/infos/news/category'
		params = '?start=0&maxResults=10&code=' + code;
	}
	page.init(10, 'news-content', 'news-template', url, params, true, 'no-records');
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
}

function detail(id,title){
	var header = './activity/activityHeader';
	var	params = { "page" : "../newsDetail", "title" : title, "id" : id };
	global.openWinName('newsDetailSubWin', header, params);
}