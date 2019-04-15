var header = './common/header';
var params;
var bannerCacheTime = 0;
var bannerCacheData;
var periodCacheTime = 0;
var periodCacheData;
var activityCacheData ;
var activityCacheTime = 0;
var noticeScrollFlag = false;
var securityCode;
var bannerData = [];
var memberName = "金算子";
var UIScrollPicture;

apiready = function() {
	openIndexAdvPage();

	systemEvent();
	initEvent();

	noticeList();
	//showGoldPrice();
	//showFunctionIcon();
	validateCache();
	//hideRedpackageIcon();	
	openHeadFrame();
	global.networkStatus('noneNetworkDiv', 'mainDiv');
}

function openHeadFrame(){
	api.openFrame({
	    name: 'indexHeadFrame',
	    url: './mainFrame.html',
	    rect: {
		    x:0,
		    y:0,
		    w:api.frameWidth,
		    h:66
	    },
	    reload : true
    });
}

/**
 * 启动页广告
 */
function openIndexAdvPage(){
	// 有网络才显示启动页广告
	if(global.networkConnection()){
		if(api.connectionType != '2G'){
			api.ajax({
				method : 'get',
				cache : false,
				dataType : 'json',
				returnAll : false,
				url : global.getRequestUri() + '/advertisement/single?type=1'
			}, function(ret, err) {
				if (ret && ret.id) {
					api.openFrame({
				        name:'main_advframe',
				        url:'./main_advframe.html',
				        rect: {
				            x: 0,
				            y: 0,
				            w: api.winWidth,
				            h: api.winHeight 
				        },
				        pageParam : {
				        	imgUrl: ret.imgurl,
				        	relativeId: ret.relativeId,
				        	type: ret.type,
				        	url: ret.url
				        }
				    });
				}else{
					showAdv();
				}
			});
		}
	}
}


/**
 *缓存处理 
 */
function validateCache(){
	var bannerCacheObj = cache.getBannerList();
	var periodCacheObj = cache.getIndexProductList();

	if(bannerCacheObj && bannerCacheObj.cacheTime){
		bannerCacheTime = bannerCacheObj.cacheTime;
		bannerCacheData = bannerCacheObj.data;
	}
	if(periodCacheObj && periodCacheObj.cacheTime){
		periodCacheTime = periodCacheObj.cacheTime;
		periodCacheData = periodCacheObj.data;
	}

	getBanner();
	getShopProduct();
}

/**
 *监听事件 
 */
function initEvent(){
	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
    	if(ret){
    		//showGoldPrice();
		}
    });

	api.addEventListener({
	    name:'loginRefresh'
    },function(ret,err){
    	api.sendEvent({
	        name:'financeAccountRefresh'
        });
    	if(ret){
			api.closeWin({
				name: 'loginWinPartner'
        	});
        	//setTimeout('partner();',300);
		}
    });

    api.addEventListener({
	    name:'advIndexEvent'
    },function(ret,err){
    	if(ret && ret.value){
    		api.closeFrame({ name : "advIndexFrame" });
    		advIndex(ret.value.type,ret.value.relativeId,ret.value.url);
		}
    });


    api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function() {
		api.refreshHeaderLoadDone();		

		getShopProduct();
		
		showAdv();
		noticeList();
		getBanner();
	});

	api.addEventListener({
		name : 'showIndexAdvEvent'
	}, function(ret, err) {

		api.closeFrame({ name : "main_advframe" });
		showAdv();
	});
    
	api.addEventListener({
		name : 'forgetPayPasswordEvent'
	}, function(ret, err) {
		if(global.getUserPayPassword() === '1'){
			params = { "page" : "../member/payPasswordFind", "title" : "重置交易密码" };
		}else{
			//实名判断
			if(!global.getUserIdCard() || global.getUserBindCard() === '0'){
				params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1 };
				return global.validIdCardTooltip("bindCardWin", header, params);
			}
			params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
		}
		
		global.openWinName("setSubWin", "./common/header", params);
	});
	
	api.addEventListener({
	    name:'networkConnection'
    },function(ret,err){
		global.networkStatus('noneNetworkDiv', 'mainDiv');
    });
    
    api.addEventListener({
	    name:'connectionSuccess'
    },function(ret,err){

		getShopProduct();
		
		noticeList();

		getBanner();
		
		if(UIScrollPicture){
			UIScrollPicture.show();
		}
    });
    
    api.addEventListener({
	    name:'connectionFail'
    },function(ret,err){
    	if(UIScrollPicture){
			UIScrollPicture.hide();
		}
    });

    api.addEventListener({
	    name:'registerEvent'
    },function(ret,err){
	
		global.openWinName('loginSubWin', './member/register', {  "title" : "注册",  "frameIndex" : 4 });
    }); 
    
}

/**
 *获取banner 
 */
function getBanner() {
	api.ajax({
		url : global.getRequestUri() + '/banners?start=0&maxResults=6&bannerType=1&bannerCacheTime=' + bannerCacheTime,
		method : 'get',
		cache : true,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret && ret.items && ret.items.length > 0) {
			bannerData = [];
			var imageData = [];
			for(var i=0; i<ret.items.length; i++){
				bannerData.push(ret.items[i]);
				imageData.push(global.getImgUri() + ret.items[i].imgurl);
			}
	
			if(global.networkConnection()){
				UIScrollPicture = api.require('UIScrollPicture');
				UIScrollPicture.open({
				    rect: {
				        x: 0,
				        y: 0,
				        w: api.winWidth,
				        h: 190
				    },
				    data: {
				        paths: imageData
				    },
				    styles: {
				        indicator: {
				           dot:{
				             w:8,
				             h:8,
				             r:4,
				             margin:4
				          },
				            align: 'center',
				            color: '#aaaaaa',
				            activeColor: '#ffffff'
				        }
				    },
				    placeholderImg: 'widget://image/icon150x150.png',
				    contentMode: 'scaleToFill',
				    interval: 5,
				    fixedOn: api.frameName,
				    loop: true,
				    fixed: false
				}, function(ret, err) {
				    if (ret && ret.eventType === 'click') {
				    	var item = bannerData[ret.index];
				    	doActivity(item.activityType,item.type,item.relativeId);
				    }
				});
			}
		}
	});
}

function getShopProduct(){
	api.ajax({
            url:  global.getRequestUri() + '/shop-product/recommend',
            method: 'get',
            cache : true,
            timeout: 30,
            dataType: 'json',
            returnAll: false
        },function(ret,err){
			if (ret && ret.length > 0) {
	            var template = $api.byId("shop-template").text;
	            var tempFun = doT.template(template);
	            $api.html($api.byId("shop-content"), tempFun(ret));	            
	        }
     });

}


/**
 *打开窗体 
 */
function openSubWin(category, id, name){
	header = './common/product_header';
	switch(category){
		case 1:
			//活期
			params = { "page" : "../productActiveDetail", "title" : name, "optSrc" : 1 };
			break;
		case 2:
			//定期
			params = { "page" : "../productDetail", "title" : name, "id" : id };
			break;
		case 3:
			//天天金
			params = { "page" : "../productDayDetail", "title" : name, "id" : id};
			break;
		case 4:
			//定期
			params = { "page" : "../productDetail", "title" : name, "id" : id, "categoryId" : 3 };
			break;
		case 5:
			//金价走势
			header = './common/header';
			params = { "page" : "../goldPriceLog", "title" : name};
			break;
	}

	global.openWinName("indexSubWin", header, params);
}

/**
 *打开活动详情 
 */
function openActivityDetail(activityType,type,relativeId){
	 if(type==1){//活动
		activityCache(relativeId);
	 }else if(type==2){//新闻媒体
		var	params = { "page" : "../newsDetail", "title" : "新闻资讯", "id" : relativeId };
		global.openWinName('newsDetailSubWin', header, params);

	 }else if(type==3){//公告
		var	params = { "page" : "../noticeDetail", "title" : "公告详情", "id" : relativeId };

		global.openWinName('noticeDetailSubWin', header, params);
	 }
}

/**
 *打开详情判断 
 */
function activityCache(id){
	var cacheObj = cache.getActivityDetail(id);

	if(cacheObj && cacheObj.activityCacheTime){
		activityCacheTime = cacheObj.activityCacheTime;
		activityCacheData = cacheObj.data;
	}

	detail(id);
}

/**
 *打开外链活动 
 */
function detail(id) {
	api.ajax({
		method : 'get',
		cache : true,
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

/**
 * 帮助中心
 */
function newGuide(){
	var params = { "page" : "../helpList", "title" : "帮助中心"};
	global.openWinName('helpCenterSubWin', './common/custom_header', params);
}

/**
 *刷新金价 
 */
function refresh(){
	//showGoldPrice();
}

/**
 *加载公告列表 
 */
function noticeList(){
	if(!noticeScrollFlag){
		$api.removeCls($api.byId('scrollDiv'), 'hide');

		api.ajax({
			url : global.getRequestUri() + '/notices?start=0&maxResults=5',
			method : 'get',
			cache : true,
			dataType : 'json',
			returnAll : false
		}, function(ret, err) {
			if (ret && ret.items) {
//				var list = ret.items;
//				var notices = [];
//				for(var i in list) {
//					var title = list[i].title;
//					if(title && title.length>22){
//						title = title.substring(0, 22)+'...';
//					}
//
//					notices.push('<div class="swiper-slide" tapmode onclick="doNotice(' + list[i].id + ');" >');
//					notices.push(title);
//					notices.push('</div>');
//				}					
//
//				$api.html($api.byId('noticeUL'), notices.join(''));
//				var swiper3 = new Swiper('.swiper-container2', {
//					autoplay: {
//					    delay: 5000,
//					  },
//			        direction: 'vertical',
//			        slidesPerView: 1,
//			        spaceBetween: 30,
//			        mousewheel: false,
//			        loop: true
//			    });
				var list = ret.items;
				var notices = [];
				for(var i in list) {
					var title = list[i].title;
					if(title && title.length>22){
						title = title.substring(0, 22)+'...';
					}
					notices.push("<li onclick='doNotice("+list[i].id +");'>"+title +"</li>");
				}					

				$api.html($api.byId('noticeUL'), notices.join(''));

				$("#scrollDiv").Scroll({ line: 1, speed: 3000, timer: 3000 });

			}else{
				global.setErrorToast();
			}
		});
	}else{
		$api.addCls($api.byId('scrollDiv'), 'hide');
	}

}

/**
 *显示公告详情
 */
function doNotice(id){
	var	params = { "page" : "../noticeDetail", "title" : "公告详情", "id" : id };
	global.openWinName('noticeDetailSubWin', header, params);
}

/**
 *关闭公告 
 */
function closeNotice(){
	noticeScrollFlag = true;
	$api.addCls($api.byId('scrollDiv'), 'hide');
}

/**
 *弹窗广告 
 */
function showAdv(){
    api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/advertisement/single?type=2'
		}, function(ret, err) {
			if (ret && ret.id) {
				var type = ret.relativeType;
				var relativeId = ret.relativeId;

				var oldAdvIndexId =  $api.getStorage("advIndexId");//广告序号
				var advIndexPopTime =  $api.getStorage("advIndexPopTime");//广告弹出时间
				if(!advIndexPopTime){
					advIndexPopTime = new Date().getDate();
				}
				
				var newAdvIndexId = ret.id;
				var newAdvIndexEndTime = ret.endTime;

				$api.setStorage("advIndexId",newAdvIndexId);

				 if(oldAdvIndexId){//有缓存

				 	if(oldAdvIndexId != newAdvIndexId){//有新广告,直接弹出
				 		popAdv(type,relativeId,ret.text,ret.url,ret.imgurl);
				 	}else{//没有新广告	
				 		var nowTime = new Date().getDate();
				 		var clickAdvIndexTime = $api.getStorage("clickAdvIndexTime");//点击广告时间

				 		if(clickAdvIndexTime){//有浏览过广告，nothing
				 			//do nothing
				 		}else{//没有点击
				 			if(parseInt(advIndexPopTime) + 3 <= parseInt(nowTime)){//超过3天，过期 ,弹出
				 				popAdv(type,relativeId,ret.text,ret.url,ret.imgurl);
				 			}	
				 		}				 		 						 	
				 	}
				 	
				 }else{//弹出
				 	popAdv(type,relativeId,ret.text,ret.url,ret.imgurl);
				 }
			}
		});
}

/**
 *弹窗广告 
 */
function popAdv(type,relativeId,text,url,imgurl){
	$api.setStorage("advIndexPopTime",new Date().getDate());

    api.openFrame({
        name:'advIndexFrame',
        url:'./mainAdvFrame.html',
        rect: {
            x: 0,
            y: 0,
         	w: api.winWidth,
            h: api.winHeight 
        },
        pageParam:{
        	type: type,
            relativeId:relativeId,
            text:text,
            url:url,
            imgurl:imgurl
        }
    });
}

/**
 * 广告页
 */
function advIndex(type,relativeId,url){
	// TYPE_ACTIVITY("活动", 1),TYPE_INFO("新闻媒体", 2),TYPE_NOTICE("公告", 3), TYPE_URL("URL链接", 4);
	if(type != 4){
		doActivity(1,type,relativeId);
	}else{
		if(url){
			var params = { "url" : url};
			global.openWinName('advIndex4Header', './common/adv_header', params);

		}
	}
}

function doActivity(activityType,type,relativeId){
	 if(type==1){//活动
		activityCache(relativeId);
	 }else if(type==2){//新闻媒体
		var	params = { "page" : "../newsDetail", "title" : "新闻资讯", "id" : relativeId };
		global.openWinName('newsDetailSubWin', header, params);

	 }else if(type==3){//公告
		var	params = { "page" : "../noticeDetail", "title" : "公告详情", "id" : relativeId };

		global.openWinName('noticeDetailSubWin', header, params);
	 }
}
 
function productList(){
	api.sendEvent({
	    name:'frameSwitchEvent',
	    extra: {
	    	index : 1
	    }
    });
}

function copyText(text){
	var clipBoard = api.require('clipBoard');
	clipBoard.set({
		value : text
	}, function(ret, err) {
		if (ret) {
			global.setToast('复制成功');
		} else {
			global.setToast('复制失败');
		}
	});
}

function doCustom(helpTitle){
	if (!global.isValidUser()) {		
		var params = {  "title" : "登录" };
		global.openWinName("loginWin", '../member/login', params);
 		return;
	}
	
	global.setHelpTitle(helpTitle)
	var params = { "page" : "../custom", "title" : "客服"};
	global.openWinName('customWin', './common/udesk_header', params);
}

function openPalaceWin(src, text, headType){
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
	
	global.openHybridWin(palaceWinName, palaceHeader, src + '?backSrc=app', text, showHeader, '');
}

function openShop(){
	global.openHybridWin('shopWin','./common/adv_header', global.getH5url() + '/html/goldshop/shopMain.html?backSrc=app', '黄金商城', 0, '');
}

function openShopDetail(id, name){
	global.openHybridWin('shopWin','./common/adv_header', global.getH5url() + '/html/goldshop/shopDetail.html?productId=' + id + '&backSrc=app', name, 0, '');
}