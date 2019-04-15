var downloadUrl;

apiready = function() {
	$api.html($api.byId('version'), 'v' + global.getVersion());

	if (api.systemType !== 'ios' ){
		$api.attr($api.byId('versionLi'), 'onclick', 'versionCheck();');
	}else{
		$api.removeCls($api.byId('versionName'),'mui-navigate-right');
	}
}

function call(number) {
	api.call({
		type : 'tel_prompt',
		number : number
	});
}

function openAgreement() {
	var header = '../common/header';
	var params = { "page" : "../statics/userProtocol", "title" : "用户协议"};

	global.openWinName('userProtocolSubWin', header, params);
}

function aboutUs() {
	global.openH5Win("aboutUsSubWin","../common/h5_header", h5UrlAboutus, '关于我们');
}

function openHelp(){
	global.openHybridWin("palaceWin", "../common/adv_header", global.getH5url()+h5UrlHelp + '?backSrc=app', "帮助中心", 0, '');
}

function versionCheck() {
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/app-versions/update',
		data : {
			values : {
				'version' : global.getVersion(),
				'publishPlatform' : api.systemType
			}
		},
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret) {			
			if (ret.currentVersion) {
				downloadUrl = ret.downloadUrl;

				$api.removeCls($api.byId('versionUpdate'), 'hide');
				$api.removeCls($api.byId('versionUpdateDropDiv'), 'hide');
				$api.html($api.byId('versionDescription'), ret.description);
			} else {
				global.setToast('当前是最新版本');
			}
		} else {
			global.setErrorToast();
		}
	});
}

function versionCancel(){
	$api.addCls($api.byId('versionUpdate'), 'hide');
	$api.addCls($api.byId('versionUpdateDropDiv'), 'hide');
}

function download(){
	versionCancel();
	
    api.download({
	   url: downloadUrl,
	   report: true,
	   cache: false,
	   allowResume: true
	}, function(ret, err) {
		if(ret){
			if(ret.state == 0){
				api.showProgress({
					style : 'default',
					animationType : 'fade',
					title : '下载中...',
		            text : ret.percent + "%",
				    modal: false
				});
			}

			if (ret.state == 1) {
				api.hideProgress();				
	            var savePath = ret.savePath;
	            install(savePath);
			}
		}else{
			api.hideProgress();
			global.setToast('下载失败');
		} 
	});
}

function removeApk(savePath){
	var fs = api.require('fs');
	fs.remove({
	    path: savePath
	}, function(ret, err) {
	});
}

function install(savePath){
	api.confirm({
			title : '安装最新版本',
			//msg : '有新版本可以安装了',
			buttons : ['关闭', '安装']
	    },function(ret,err){
			if (ret.buttonIndex === 2) {
				api.installApp({
	                appUri: savePath
	            });
			}
	});
}

function clipBoard(copytext) {
	api.actionSheet({
		cancelTitle : '取消',
		style:{
		    fontNormalColor:'#ed9116',
		    titleFontColor:'#888'
		},
		buttons : ['复制文字']
	}, function(ret, err) {
		if (ret) {
			if (ret.buttonIndex == 1) {
				var clipBoard = api.require('clipBoard');
				clipBoard.set({
					value : copytext
				}, function(ret, err) {
					if (ret) {
						global.setToast('复制成功');
					} else {
						global.setToast('复制失败');
					}
				});
			}
		} else {
			global.setToast('复制失败');
		}
	});
}

function openFeedback(){
	global.setHelpTitle('联系我们')
	var params = { "page" : "../custom", "title" : "客服"};
	global.openWinName('customWin', '../common/udesk_header', params);
}