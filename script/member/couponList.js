var status = 0;
var maxResults = 10;
var choiceId = null;
var url = global.getRequestUri() + '/coupon-records';

apiready = function(){
	initEvent();
	queryCouponList(0);
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		queryCouponList(status);
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

function queryCouponList(index) {
	status = index;
	$api.removeCls($api.byId('active0'), 'current');
	$api.removeCls($api.byId('active1'), 'current');
	$api.removeCls($api.byId('active-1'), 'current');
	
	if (status === 0) {
		$api.addCls($api.byId('active'+status), 'current');
	} else if (status === 1) {
		$api.addCls($api.byId('active'+status), 'current');
	} else {
		$api.addCls($api.byId('active'+status), 'current');
	}
	
	var params = '?status=' + status + '&start=0&maxResults=10';
	$api.html($api.byId('coupon-content'), '');
	page.init(maxResults, 'coupon-content', 'coupon-template', url, params, true, 'no-records');
}

function showDetail(id){
	if($api.hasCls($api.byId('detail'+id), 'hide')){
		$api.removeCls($api.byId('detail'+id), 'hide');
	}else{
		$api.addCls($api.byId('detail'+id), 'hide');
	}
	if(choiceId!=null && choiceId!=id){
		$api.addCls($api.byId('detail'+choiceId), 'hide');
	}
	choiceId = id;
}

function showdesprition(){
	var header = '../common/header';
	var params =  { "page" : "../statics/couponDesprition", "title" : "使用说明"};

	global.openWinName('despWin', header, params);
}

function openQRcode(couponNo, sign, timeStamp){
	$api.html($api.byId('qrcodeDiv'), '');
  	$('#qrcodeDiv').qrcode({
      width : 140,
      height : 140,
      correctLevel : 0,
      text : global.getH5url() + '/html/activity/exchange.html?src=2&couponNo=' + couponNo + '&sign=' + sign + '&timeStamp=' + timeStamp
  	});

  	$api.removeCls($api.byId('redcodeBox'), 'hide');
	$api.removeCls($api.byId('redcodeDiv'), 'hide');
}

function redcodeClose(){
	$api.addCls($api.byId('redcodeBox'), 'hide');
	$api.addCls($api.byId('redcodeDiv'), 'hide');
}