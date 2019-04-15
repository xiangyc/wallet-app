var remoteImagePath;
var wxShareType;
var geThemeCode;

function getImagePath(securityCode, shareType){
	wxShareType = shareType;
    api.ajax({
        url : global.getRequestUri() + '/envelope/image?code='+securityCode,
        method : 'post',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret && ret.success){
            remoteImagePath = global.getShareUri() + ret.obj;
            geThemeCode = ret.code;
			if(api.systemType === 'ios'){
				shareImageIOS();
			}else{
				 shareImageAndroid();
			}
           
        }
    });
}

function getPartnerImagePath(parthnerType,shareType){
	wxShareType = shareType;
	var method = '/members/share';
	geThemeCode = 'activity-invite01';
	if(parthnerType === 1){
		method = '/org/share';
		geThemeCode = 'org_add';
	}

    api.ajax({
        url : global.getRequestUri() + method,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            remoteImagePath = global.getShareUri() + ret.path;
			if(api.systemType === 'ios'){
				shareImageIOS();
			}else{
				 shareImageAndroid();
			}
        }
    });
}

function shareImageIOS() {
	// var imagePath = 'widget://' + new Date().getTime() + '.png';
	 api.download({
	        url : remoteImagePath,
	        allowResume : true
	      	//savePath : imagePath 
    	}, function(ret, err) {
	        if (ret && ret.state) {        	
	            var wx = api.require('wx');
				wx.shareImage({
				    scene: wxShareType,
				   // thumb: imagePath,
				    //contentUrl: imagePath
 				    thumb : 'widget://image/' + geThemeCode + '.png',
				    contentUrl: remoteImagePath
				}, function(ret, err) {
					api.sendEvent({
				   	   name:'closeShareImage'
			    	});
				});
	        } else {
	            global.setToast('保存失败');
	        }
	  });
}

function shareImageAndroid() {
	 var imagePath = 'widget://' + new Date().getTime() + '.png';
	 api.download({
	        url : remoteImagePath,
	        allowResume : true
    	}, function(ret, err) {
    		imagePath = ret.savePath;
	        if (ret && ret.state) {        	
	            var wx = api.require('wx');
				wx.shareImage({
				    scene: wxShareType,
 				    //thumb : 'widget://image/' + geThemeCode + '.png',
				    contentUrl: imagePath
				}, function(ret, err) {
					api.sendEvent({
				   	   name:'closeShareImage'
			    	});
				});
	        } else {
	            global.setToast('保存失败');
	        }
	  });
}