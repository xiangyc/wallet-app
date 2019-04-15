var downloadUrl;
var updateInstall;//是否强制升级(0-否 1-是）
apiready = function() {
	downloadUrl = api.pageParam.downloadUrl;
	updateInstall = api.pageParam.updateInstall;
	
	if(updateInstall && updateInstall ==1){
		
		$api.removeCls($api.byId('updateBt1'), 'hide'); 
	}else{
		$api.removeCls($api.byId('updateBt2'), 'hide'); 
	}
	
	$api.html($api.byId('versionDescription'), api.pageParam.description);
}

function versionCancel(){
	//$api.addCls($api.byId('versionUpdate'), 'hide');
	//$api.addCls($api.byId('versionUpdateDropDiv'), 'hide');
}

function download(){
	if (api.systemType === 'ios' ){
		api.openApp({
		    iosUrl: 'https://itunes.apple.com/cn/app/%E9%87%91%E7%AE%97%E5%AD%90-%E4%BC%9A%E8%B5%9A%E9%92%B1%E7%9A%84%E9%BB%84%E9%87%91%E9%9B%B6%E9%92%B1%E5%8C%85/id1234167568?mt=8'
		});
	}else{
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

