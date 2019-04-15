
var activityType;
var	type;
var relativeId;
var bannerUrl;
var activityCacheData ;
var activityCacheTime = 0;

var urlActive = global.getRequestUri() + '/investment-products/active';
var urlPeriod = global.getRequestUri() + '/investment-products/period';
var urlDay = global.getRequestUri() + '/investment-products/per-diem';

//登录安心金链接
var urlPeriodLogin = global.getRequestUri() + '/investment-products/period/login';
//是否购买过新手金 
var urlIsInvestment = global.getRequestUri() + '/investment-orders/isInvestment';

var maxResults = 3;
var activeCacheTime = 0;
var periodCacheTime = 0;

apiready = function(){
	initEvent();
	global.networkStatus('noneNetworkDiv', 'mainDiv');
	getBanner();
	query();
}

function query(){
	//queryActiveProduct();
	queryPeriodProduct();
}

function getBanner() {
	api.ajax({
		url : global.getRequestUri() + '/banners?start=0&maxResults=1&bannerType=3',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret) {
			if(ret.recordCount >0 && ret.items){

				$api.removeCls($api.byId('bannerDiv'), 'hide');

                var obj = ret.items[0];

                activityType = obj.activityType;
				type = obj.type;
				relativeId = obj.relativeId;
				bannerUrl = obj.bannerUrl;

				$api.attr($api.byId('imgId'), 'src', global.getImgUri() +'/' + obj.imgurl);
				
			}
		}
	});
}

function doActivity(){
	 if(type==1){//活动
		activityCache(relativeId);
	 }else if(type==2){//新闻媒体
		var	params = { "page" : "../newsDetail", "title" : "新闻资讯", "id" : relativeId };
		global.openWinName('newsDetailSubWin',  './common/header', params);

	 }else if(type==3){//公告
		var	params = { "page" : "../noticeDetail", "title" : "公告详情", "id" : relativeId };

		global.openWinName('noticeDetailSubWin',  './common/header', params);
	 }else if(type==4){//外部链接
		var params = { "url" : bannerUrl};
		global.openWinName('advIndex4Header', './common/adv_header', params);
	 }
}

function activityCache(id){
	var cacheObj = cache.getActivityDetail(id);

	if(cacheObj && cacheObj.activityCacheTime){
		activityCacheTime = cacheObj.activityCacheTime;
		activityCacheData = cacheObj.data;
	}

	detail(id);
}

function detail(id) {
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : true,
		url : global.getRequestUri() + '/activities/' + id + '?cacheTime=' + activityCacheTime
	}, function(ret, err) {
		if (ret && ret.body) {
			bindData(ret.body);

			if(ret.headers && ret.headers.activityCacheTime){
				activityCacheTime = ret.headers.activityCacheTime;
			} 

			cache.setActivityDetail(id, ret.body, activityCacheTime);
		} else if(err && err.statusCode === global.getCacheStatusCode()){
			bindData(activityCacheData);
		}else{
			global.setErrorToast();
		}
	});
}

function bindData(data) {
	if(data){
		var title = data.name;
		var subTitle = data.subTitle;
		var linkSrc =data.linkSrc;
		var id = data.id;

		var	params = {"title" : "活动详情", "title": title, "subTitle": subTitle, "linkSrc": linkSrc, "id" : data.id };
		global.openWinName('activityWebWin', './activity/activityWebHeader',  params);
	}
}	


function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function() {
		api.refreshHeaderLoadDone();
		query();
	});

	api.addEventListener({
	    name:'networkConnection'
    },function(ret,err){
		global.networkStatus('noneNetworkDiv', 'mainDiv');
    });
    
	api.addEventListener({
	    name:'connectionSuccess'
    },function(ret,err){
    	getBanner();
		query();
    });
    
    api.addEventListener({
	    name:'goldAccountRefreshSuccess'
    },function(ret,err){
		query();
    });
    
   api.addEventListener({
	    name:'activityEnd'
    },function(ret,err){	
		window.setTimeout("query();", 2000);
    });
    
    api.addEventListener({
	    name:'openProductDetail'
    },function(ret,err){	
		if(ret){
			openSubWin(ret.value.type, ret.value.id, ret.value.name);
		}
    });

  //   api.addEventListener({
	 //    name:'logOutRefresh'
  //   },function(ret,err){
  //   	if(ret){
  //       	$api.removeCls($api.byId('new-content1'), 'hide');
  //       	$api.removeCls($api.byId('new-content2'), 'hide');
		// }
  //   });

    api.addEventListener({
		name : 'financeAccountRefresh'
	}, function(ret, err) {
		queryPeriodProduct();
	});
	
}

//显示随心金列表产品
function queryActiveProduct() {
	var params = '?start=0&maxResults=1&cacheTime=' + activeCacheTime;
	api.ajax({
        url: urlActive + params,
        method: 'get',
        timeout: 30,
        dataType: 'json',
        returnAll: false,
		headers: global.getRequestToken()
    },function(ret,err){
		if (ret) {
			bindActiveData(ret);

		} else{
			global.setErrorToast();
		}
 });
}

// 显示安心金产品列表
function queryPeriodProduct() {
	var params = '?start=0&maxResults=10&cacheTime=' + periodCacheTime;

	var reqUrl =  urlPeriod + params;

	if(global.isValidUser()){
		reqUrl = urlPeriodLogin + params;
	}

	api.ajax({
            url: reqUrl,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
			headers: global.getRequestToken()
        },function(ret,err){
			if (ret ) {
				bindPeriodData(ret);			
			} else{
				global.setErrorToast();
			}
     });
}

function bindActiveData(data) {
	if(data && data.items){
		var template = $api.byId('active-template').text;
		var tempFun = doT.template(template);
      	$api.html($api.byId('active-content'), tempFun(data.items));
	}else{
		$api.html($api.byId('active-content'), '');
	}
}

function bindPeriodData(data) {
	if(data && data.items){

		var template = $api.byId('period-template').text;
		var tempFun = doT.template(template);
      	$api.html($api.byId('period-content'), tempFun(data.items));

  //     	var template1 = $api.byId('new-template').text;
		// var tempFun1 = doT.template(template1);

	}else{
		$api.html($api.byId('period-content'), '');
		//$api.html($api.byId('new-content1'), '');
		//$api.html($api.byId('new-content2'), '');
	}
}

function openSubWin(type, id, name){
	var header = "./common/product_header";
	var params;

	if(type === 1){
		//活期
		params = { "page" : "../productActiveDetail", "title" : name, "optSrc" :1 };
		global.openWinName("productActiveDetail", header, params);
	}else if(type === 2 ){
		//安心金 定期
		params = { "page" : "../productDetail", "title" : name, "id" : id, "optSrc" :2 };
		global.openWinName("productDetail", header, params);
	}else if(type === 3){
		//天天金 定期
		params = { "page" : "../productDayDetail", "title" : name, "id" : id, "categoryId" : 3, "optSrc" :3 };
		global.openWinName("productDetail", header, params);
	}
}

//安心金=1 天天金=2 随心金=3 新手金=4
function showDetail(type){

	var title ='稳健型';
	var content = '固定年化赠金，不受金价波动影响。';

	if(type ==3){
		title = '浮动型';
		content = '金价参考上海黄金交易所，购金者自行承担金价波动带来的赠金或损失。';
	}

    api.openFrame({
        name: 'productListFrame',
        url: 'productListFrame.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto',
        },
        pageParam: {
        	title: title,
        	content: content
   		},
        bounces: false,
        vScrollBarEnabled: false
    });

}

function openShop(){
	global.openHybridWin('shopWin','./common/adv_header', global.getH5url() + '/html/goldshop/shopMain.html?backSrc=app', '黄金商城',0,'');
}
   