 var speed=50;
var demo = $api.byId('demo');
var demo1 = $api.byId('demo1');
var demo2 = $api.byId('demo2');
var title='金算子';
var summary='金算子';
var id;
var cacheTime = 0;
var cacheData;

apiready = function(){
	id = api.pageParam.id;
	initEvent();
	loadData();
}

function loadData(){	
	activityTime();
 	listTop10();
 	validateCache();
 	//setTimeout("richNotice();", 2000);

 	if(global.isValidUser()){ 	
 		$api.removeAttr($api.byId('loginId'), 'onclick');

 		richInfo();
 	}
 	
	if (api.systemType === 'ios'){
		$api.removeCls($api.byId('declare'), 'hide');
	}
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
		title = data.name;
		summary = data.subTitle;	
	}
}

function richInfo() {
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers: global.getRequestToken(),
		url : global.getRequestUri() + '/activities/richInfo'
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				$api.html($api.byId('myGoldMoney'), global.formatCurrency(ret.obj.money));
				var rowNum = ret.obj.rowNum;

				if(rowNum>0 && rowNum<=100){
					$api.html($api.byId('myRankId'), rowNum);
				}else if(rowNum<=0){
					$api.html($api.byId('myRankId'), "暂无排名");
				}else{
					$api.html($api.byId('myRankId'), "100名开外");
				}				
			} 
		} else {			
			global.setErrorToast();
		}
	});
}

function activityTime() {
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/activities/activityTime?type=8'
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				$api.html($api.byId('activityTime'), global.formatDate(ret.obj.startTime, 'yyyy-MM-dd hh:mm') +'至' + global.formatDate(ret.obj.endTime, 'yyyy-MM-dd hh:mm'));
			} 
		} else {			
			global.setErrorToast();
		}
	});
}

function listTop10() {
	var url = global.getRequestUri() + '/activities/richList'
	var params = '?start=0&maxResults=10';
	page.init(10, 'activity-ranking-content', 'activity-ranking-template', url, params, true, 'no-records');
}

function richNotice() {
	var url = global.getRequestUri() + '/activities/richNotice'
	var params = '?start=0&maxResults=10';
	page.init(10, 'demo2', 'activity-notice-ranking-template', url, params, true, 'no-records');

 	setTimeout("rolling();", 3000);
}

function rolling(){

   demo2.innerHTML=demo1.innerHTML;

   var MyMar=window.setInterval('Marquee();',speed);
   demo.onmouseover=function() {
   		window.clearInterval(MyMar);
   }
   demo.onmouseout=function() {
   		MyMar=window.setInterval('Marquee();',speed);
   }
}

function Marquee(){
   if(demo2.offsetTop-demo.scrollTop<=0)
	   demo.scrollTop-=demo1.offsetHeight
   else{
		demo.scrollTop++
   }
}

function login(){
	var winName = "activityRankLoginWin";
	var params = {  "title" : "登录" };
	global.openWinName(winName, '../member/login', params);

}

function initEvent() {	
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
		api.closeWin({
			name: 'activityRankLoginWin'
        });

      	$api.removeAttr($api.byId('loginId'), 'onclick');
		richInfo();

	});
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
