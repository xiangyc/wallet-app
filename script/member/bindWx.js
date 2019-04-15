
var flag =false;

apiready = function(){	
	isBindingWx();	
}

function isBindingWx(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/auth/is-binding'
	}, function(ret, err) {
		if(ret && ret.success){
			
			$api.html($api.byId('wxDiv'), '已绑定');
			$api.addCls($api.byId('wxDiv'), 'grey');
			
			$api.attr($api.byId('clickEventId'), 'onclick', 'removeBind();');
			//$api.addCls($api.byId('arrowA'), 'mui-navigate-right');
			
		}else{
			$api.html($api.byId('wxDiv'), '未绑定');
			$api.attr($api.byId('clickEventId'), 'onclick', 'bind();');
		}
	});
}

function bind(){
	if(flag){
		return;
	}
   
   flag = true;
	
	setTimeout(function(){
			flag = false;
	    }, 5000);
                			   
   var wx = api.require('wx');
	wx.isInstalled(function(ret, err) {
	    if (ret.installed) {
	    
			wx.auth({
				apiKey: ''
			}, function(ret, err) {
				wx.getToken({
				    code: ret.code
				}, function(ret, err) {
				    if (ret.status) {
					    wx.getUserInfo({
						    accessToken: ret.accessToken,
						    openId: ret.openId
						}, function(ret, err) {
						
						    if (ret.status) {
						    	
						        bindWx( ret.openid, ret.headimgurl, ret.nickname, ret.sex );
						    } else {
						        api.alert({ msg: "获取用户信息失败" });
						    }

						   // flag = true;

						});
				    }
				});
			});

		//	flag = true;
	    } else {
	        api.alert({ msg: "当前设备未安装微信客户端" });
	    }
	    
	    flag = true;
	});

}

function bindWx(openId,headIcon,nickName,sex){
	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/auth/binding',
		data : {
			values : {
				'openId' : openId,
				'headIcon' : headIcon,
				'nickName' :nickName,
				'sex' : sex
			}
		}
	}, function(ret, err) {
		if(ret && ret.success){
			
			$api.html($api.byId('wxDiv'), '已绑定');			
			$api.addCls($api.byId('wxDiv'), 'grey');
			
			$api.attr($api.byId('clickEventId'), 'onclick', 'removeBind();');			
			
		}else{
			global.setToast(ret.message);
		}
	});
}

function removeBind(){
	api.confirm({
		title : '解绑',
		msg : '您已经绑定微信，需要解绑吗',
		buttons : ['取消', '解绑']
    },function(ret,err){
		if (ret.buttonIndex === 2) {
			api.ajax({
				method : 'post',
				cache : false,
				dataType : 'json',
				returnAll : false,
				headers : global.getRequestToken(),
				url : global.getRequestUri() + '/auth/remove-binding'
			}, function(ret, err) {
				if(ret && ret.success){
					
					$api.html($api.byId('wxDiv'), '未绑定');
					$api.removeCls($api.byId('wxDiv'), 'grey');
					
					$api.attr($api.byId('clickEventId'), 'onclick', 'bind();');
					
				}else{
					global.setToast('解绑失败');
				}
			});
		}
    });
		    

}