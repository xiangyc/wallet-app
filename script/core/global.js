(function(window) {
	var g = {};
	var userVersion = '2.1.7';
	var userToken = 'Authorization';
	var userKey = 'Key';
	var userLoginTime = 'LoginTime';
	var tokenExpires = 'Expires';
	var userName = "UserName";
	var userMobile = "UserMobile";
	var loginMobile = "loginMobile";
	var userIdCard = "UserIdCard";
	var userBindCard = "UserBindCard";
	var userPayPassword = "UserPayPassword";
	var memberId = "MemberId";
	var readNoticeTime = "ReadNoticeTime";
	var publishTime = "publishTime";
	var securityMobile = "SecurityMobile";
	var recommentMobile = "RecommentMobile";
	var recommentName = "RecommentName";
	var inviterCode = "InviterCode";
	var orgRole = "OrgRole";
	var orgActivationStatus = "OrgActivationStatus";
	var nickName = "NickName";
	var avatar = "Avatar";
	var loginData = "loginData";

	//38-06是测试  05是生产
	var requestUri = "https://mobile.jsz.top/api/v2";
	var requestGEUri = "https://mobile.jsz.top/api/v2/env";
	var h5url = "https://mobile.jsz.top";
	var domain = "https://mobile.jsz.top";
	var webSocketUri = "ws://www.jsz.top:8888";

	// var requestUri = "https://app.jsz.top/api/v2";
	// var requestGEUri = "https://app.jsz.top/api/v2/env";
	// var h5url = "https://app.jsz.top";
	// var domain = "https://app.jsz.top";
	// var webSocketUri = "ws://192.168.4.160:8888";


	g.getWebSocketUri = function(){
		return webSocketUri;
	}

	g.getH5url = function(){
		return h5url;
	}

    g.getRequestGEUri = function(){
        return requestGEUri;
    }

	g.getVersion = function(){
		return userVersion;
	}

	g.getRequestUri = function() {
		return requestUri;
	}

	g.getRedpacketUri = function() {
		return redpacketUri;
	}

	g.getShareUri = function() {
		return domain;
	}

	g.getImgUri = function() {
		if($api.getStorage("Domain")){
			return $api.getStorage("Domain")
		}
		return domain;
	}

	g.getRequestToken = function(){
		return { "Authorization" : "Bearer__" + $api.getStorage(userToken) , "Key": "Bearer__" + $api.getStorage(userKey) , "ClientId" : "Bearer__1" };
	}

	g.getTokenName = function() {
		return userToken;
	}

	g.getTokenType = function() {
		return "Bearer__"
	}

	g.loginOut = function(){
		$api.rmStorage(userToken);
	}

	g.getPlatformSource = function() {
		return 1;
	}

	g.getVersionName = function() {
		return "Version";
	}

	g.getToken = function() {
		return $api.getStorage(userToken);
	}

	g.setToken = function(value) {
		$api.setStorage(userToken, value);

		$api.setStorage(userLoginTime, new Date());
	}

	g.getKey = function() {
		return $api.getStorage(userKey);
	}

	g.setKey = function(value) {
		$api.setStorage(userKey, value);
	}

	g.getSecurityMobile = function() {
		return $api.getStorage(securityMobile);
	}

	g.setSecurityMobile = function(value) {
		$api.setStorage(securityMobile, value);
	}

	g.getTokenExpires = function() {
		return $api.getStorage(tokenExpires);
	}

	g.setTokenExpires = function(value) {
		$api.setStorage(tokenExpires, value);
	}

	g.getGuideFlag = function() {
		return $api.getStorage("APP-GUIDEFLAG");
	}

	g.setGuideFlag = function() {
		$api.setStorage("APP-GUIDEFLAG", userVersion);
	}

	g.cleanGuideFlag = function() {
		$api.rmStorage("APP-GUIDEFLAG");
	}

	g.getLoginData = function() {
		return $api.getStorage(loginData);
	}

	g.setLoginData = function(value) {
		$api.setStorage(loginData, value);
	}

	g.cleanLoginData = function() {
		$api.rmStorage(loginData);
	}

	g.getPlatformSource = function() {
		return 1;
	}

	g.getUserName = function() {
		return $api.getStorage(userName);
	}

	g.setUserName = function(value) {
		$api.setStorage(userName, value);
	}


	g.getUserMobile = function() {
		return $api.getStorage(userMobile);
	}

	g.setUserMobile = function(value) {
		$api.setStorage(userMobile, value);
	}
	
	g.getLoginMobile = function() {
		
    	return api.getPrefs({
		    sync: true,
		    key: loginMobile
		});
	}

	g.setLoginMobile = function(value) {
		api.setPrefs({
		    key: loginMobile,
		    value: value
		});
	}

	g.getUserIdCard = function() {
		return $api.getStorage(userIdCard);
	}

	g.setUserIdCard = function(value) {
		$api.setStorage(userIdCard, value);
	}

	g.getMemberId = function() {
		return $api.getStorage(memberId);
	}

	g.setMemberId = function(value) {
		$api.setStorage(memberId, value);
	}

	g.getReadNoticeTime = function() {
		return api.getPrefs({
		    sync: true,
		    key: readNoticeTime
		});
	}

	g.setReadNoticeTime = function(value) {
		api.setPrefs({
		    key: readNoticeTime,
		    value: value
		});
	}

	g.getPublishTime = function() {
		return api.getPrefs({
		    sync: true,
		    key: publishTime
		});
	}

	g.setPublishTime = function(value) {
		api.setPrefs({
		    key: publishTime,
		    value: value
		});
	}

	g.getRecommentMobile = function() {
		return $api.getStorage(recommentMobile);
	}

	g.setRecommentMobile = function(value) {
		$api.setStorage(recommentMobile, value);
	}

	g.getRecommentName = function() {
		return $api.getStorage(recommentName);
	}

	g.setRecommentName = function(value) {
		$api.setStorage(recommentName, value);
	}
	
	g.getInviterCode = function() {
		return $api.getStorage(inviterCode);
	}

	g.setInviterCode = function(value) {
		$api.setStorage(inviterCode, value);
	}
	
	g.getOrgRole = function() {
		return $api.getStorage(orgRole);
	}

	g.setOrgRole = function(value) {
		$api.setStorage(orgRole, value);
	}
	
	g.getOrgActivationStatus = function() {
		return $api.getStorage(orgActivationStatus);
	}

	g.setOrgActivationStatus = function(value) {
		$api.setStorage(orgActivationStatus, value);
	}

	g.getNickName = function() {
		return $api.getStorage(nickName);
	}

	g.setNickName = function(value) {
		$api.setStorage(nickName, value);
	}

	g.getAvatar = function() {
		return $api.getStorage(avatar);
	}

	g.setAvatar = function(value) {
		$api.setStorage(avatar, value);
	}

	g.getUserBindCard  = function() {
		return $api.getStorage(userBindCard);
	}

	g.setUserBindCard = function(value) {
		$api.setStorage(userBindCard, (value == 'true' || value == '1' ? '1' : '0'));
	}

	g.getUserPayPassword  = function() {
		return $api.getStorage(userPayPassword);
	}

	g.setUserPayPassword = function(value) {
		$api.setStorage(userPayPassword, (value == 'true' || value == '1' ? '1' : '0'));
	}

	g.getHelpTitle = function() {
		return $api.getStorage("HelpTitle");
	}

	g.setHelpTitle = function(value) {
		$api.setStorage("HelpTitle", value);
	}
	
	g.isValidUser = function(){
		if($api.getStorage(userToken) && $api.getStorage(tokenExpires)){
			var currentTime = new Date();
			var loginTime = new Date($api.getStorage(userLoginTime));
			if(loginTime){
				var expires = $api.getStorage(tokenExpires);
	
				loginTime = loginTime.valueOf() + eval(expires) * 1000;
				loginTime = new Date(loginTime);
				if(currentTime > loginTime){
				  return false;
				}
	
				return true;
			}
			
			return false;
		}else{
			return false;
		}
	}

	g.getCacheStatusCode = function(){
		return 204;
	}

	g.setToast = function(title) {
		api.toast({
			msg : title,
			duration : 3000,
			location : 'middle'
		});
	}

	g.setErrorToast = function() {
//		api.toast({
//			msg : '网络连接出错,请检查网络配置',
//			duration : 2000,
//			location : 'middle'
//		});
	}

	g.openWin = function(pageName, params) {
		api.openWin({
			name : pageName,
			url : pageName + '.html',
			pageParam : params
		});
	}

	g.openWinName = function(winName, pageName, params) {
		api.openWin({
			name : winName,
			url : pageName + '.html',
			pageParam : params
		});
	}

	g.openH5Win = function(pageName,header, url, title) {
		var showHeader = (pageName == 'shopWin' ? 0 : 1);
        api.openWin({
            name : pageName,
            reload : true,
            url : header + '.html',
            pageParam : {
                name : pageName,
                url : url,
                title : title,
                showHeader : showHeader
            }
        });
    }
    
    g.openOtherWin = function(pageName,header, params) {
        api.openWin({
            name : pageName,
            reload : true,
            url : header + '.html',
            pageParam : params
        });
    }

	g.openHybridWin = function(pageName,header, url, title, showHeader,pageParams) {
        api.openWin({
            name : pageName,
            reload : true,
            url : header + '.html',
            pageParam : {
                name : pageName,
                url : url,
                title : title,
                showHeader : showHeader,
                pageParams : pageParams
            }
        });
    }
    
	g.validIdCardTooltip = function(winName, pageName, params){
		var temp = $api.getStorage(userIdCard);
		if(temp === undefined || temp.length < 1){
			api.confirm({
				title : '提示',
				msg : '您还没有实名认证，请先实名认证',
				buttons : ['取消', '认证']
		    },function(ret,err){
				if (ret.buttonIndex === 2) {
					api.openWin({
						name : winName,
						url : pageName + '.html',
						slidBackEnabled : false,
						pageParam : params
					});
				}
		    });
		}
	}

	g.validBindCardTooltip = function(winName, pageName, params){
		if($api.getStorage(userBindCard) === '0'){
			api.confirm({
				title : '提示',
				msg : '您还没有绑定银行卡，请先绑定银行卡',
				buttons : ['取消', '绑卡']
		    },function(ret,err){
				if (ret.buttonIndex === 2) {
					api.openWin({
						name : winName,
						url : pageName + '.html',
						slidBackEnabled : false,
						pageParam : params
					});
				}
		    });
		}
	}

	g.validPayPasswordTooltip = function(winName, pageName, params){
		if($api.getStorage(userPayPassword) === '0'){
			api.confirm({
				title : '提示',
				msg : '您还没有设置交易密码，请设置交易密码',
				buttons : ['取消', '设置']
		    },function(ret,err){
				if (ret.buttonIndex === 2) {
					api.openWin({
						name : winName,
						url : pageName + '.html',
						slidBackEnabled : false,
						pageParam : params
					});
				}
		    });
		}
	}

	g.showPassword = function(id, iconId){
		if ($api.attr($api.byId(id), 'type') == 'text') {
			$api.attr($api.byId(id), 'type', 'password');
			$api.removeCls($api.byId(iconId), 'passwordOff');
			$api.addCls($api.byId(iconId), 'passwordOn');
		} else {
			$api.attr($api.byId(id), 'type', 'text');
			$api.removeCls($api.byId(iconId), 'passwordOn');
			$api.addCls($api.byId(iconId), 'passwordOff');
		}
	}

	g.networkConnection = function(){
		var connectionType = api.connectionType;
	  	if(connectionType === 'unknown' || connectionType === 'none'){
	  		return false;
	  	}

	  	return true;
	}

	g.networkStatus = function(noneDiv, mainDiv){
		var connectionType = api.connectionType;
	  	if(connectionType === 'unknown' || connectionType === 'none'){
			$api.removeCls($api.byId(noneDiv), 'hide');
			$api.addCls($api.byId(mainDiv), 'hide');
			api.sendEvent({
	            name:'connectionFail'
            });
	 	}else{
	 		$api.removeCls($api.byId(mainDiv), 'hide');
			$api.addCls($api.byId(noneDiv), 'hide');
			api.sendEvent({
	            name:'connectionSuccess'
            });
	 	}
	}

	g.formatDate = function (time, format){
		var date = new Date(time);
		var o = {
			"M+" : date.getMonth()+1,
			"d+" : date.getDate(),
			"h+" : date.getHours(),
			"m+" : date.getMinutes(),
			"s+" : date.getSeconds(),
			"q+" : Math.floor((date.getMonth()+3)/3),
			"S" : date.getMilliseconds()
		}

		if(/(y+)/.test(format)){
			format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4- RegExp.$1.length));
		}

		for(var k in o)if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
		}

		return format;
	}

	g.formatTimestamp = function (time, format){
		var date = new Date();
		date.setTime(time);

		var o = {
			"M+" : date.getMonth()+1,
			"d+" : date.getDate(),
			"h+" : date.getHours(),
			"m+" : date.getMinutes(),
			"s+" : date.getSeconds(),
			"q+" : Math.floor((date.getMonth()+3)/3),
			"S" : date.getMilliseconds()
		}

		if(/(y+)/.test(format)){
			format=format.replace(RegExp.$1,(date.getFullYear()+"").substr(4- RegExp.$1.length));
		}

		for(var k in o)if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1, RegExp.$1.length==1? o[k] :("00"+ o[k]).substr((""+ o[k]).length));
		}

		return format;
	}

	g.formatTimeLong = function(time) {
		var timeValue;
		var nowTime = new Date().getTime();
		var ts = nowTime - time;

		var dd = parseInt(ts / 1000 / 60 / 60 / 24);  
	    var hh = parseInt(ts / 1000 / 60 / 60);  
	    var mm = parseInt(ts / 1000 / 60);  
	    var ss = parseInt(ts / 1000);  

	    if(ss > 0 && ss < 60){
	    	timeValue = ss + "秒前";
	    }else if (ss >= 60 && mm < 60){
	    	timeValue = mm + "分钟前";
	    }else if (mm >= 60 && hh < 24){
	    	timeValue = hh + "小时前";
	    }else if (hh >= 24 && dd < 30){
	    	timeValue = dd + "天前";
	    }else if (dd >= 30 && dd < 365){
	    	timeValue = parseInt(dd/30) + "个月前";
	    }else if (dd >= 365){
	    	timeValue = parseInt(dd/365) + "年前";
	    }
	    return timeValue.toString();
	}

	g.formatCurrency = function(num) {
        if(isNaN(num))
			return '0';
        num = num.toString().replace(/\$|\,/g,'');

        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num*100+0.50000000001);
        var cents = num%100;
        num = Math.floor(num/100).toString();
        if(cents<10)
			cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++){
			num = num.substring(0,num.length-(4*i+3))+','+
			num.substring(num.length-(4*i+3));
        }
        return (((sign)?'':'-') + num + '.' + cents);
    }

	g.formatNumber = function(num, n) {
        if(isNaN(num))
			return '0';
        var sign = (num == (num = Math.abs(num)));

		n = parseInt(n) > 0 && parseInt(n) <= 20 ? n : 2;
		num = num.toString();
		if(num.lastIndexOf('.') !== -1){
			num = num.substr(0, eval(num.lastIndexOf('.') + (n + 1)));
			num = window.parseFloat(num).toString();
		}

	    num = parseFloat((num).replace(/[^\d\.-]/g, "")) + "";
	    var l = num.split(".")[0].split("").reverse(),
	    r = num.split(".")[1];
	    t = "";
	   for(i = 0; i < l.length; i ++ ){
	      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	   }
	   return ((sign)?'':'-') + t.split("").reverse().join("") + (r ? "." + r : "");
	}

	g.formatCarry = function(a) {
        var b = parseInt(a * 1000);
        var c = b.toString();
        var d = c.length;
        var e;
        if(c[d - 1] >= 1){
            e = parseInt(b / 10) + 1;
            return (e / 100);
        }else{
            e = parseInt(b / 10);
            return (e / 100);
        }
	}
       
    g.formatCeil = function(a) {
    	//进一法
        if(isNaN(a))
			return '0';

		var c = a.toString();
		c = c.substring(c.lastIndexOf('.') + 1);
		if(c.length <= 2){
				return a;
		}

		var b = parseInt(a * 100);
		if((a * 100) % 100 > 0){
			return (b+1)/100;
		}else{
			return b/100;
		}

		return num;
	}

	g.substrDecimal = function(num, n) {
        if(isNaN(num))
			return '0';
        var sign = (num == (num = Math.abs(num)));

		n = parseInt(n) > 0 && parseInt(n) <= 20 ? n : 2;
		num = num.toString();
		if(num.lastIndexOf('.') !== -1){
			num = num.substr(0, eval(num.lastIndexOf('.') + (n + 1)));
			num = window.parseFloat(num).toString();
		}

		return num;
	}

	g.refreshAsset = function(){
		api.sendEvent({
			name:'financeAccountRefresh'
		});
		api.sendEvent({
		name:'accountIncomeRefresh'
		});
		api.sendEvent({
			name:'goldAccountRefresh'
		});
		api.sendEvent({
            name: 'getGoldAccountDataRefresh'
        });
        api.sendEvent({
            name: 'getPeriodGoldAccountDataRefresh'
        });
        api.sendEvent({
            name: 'getActiveGoldAccountDataRefresh'
        });
        api.sendEvent({
            name: 'getGoldAccountDataRefreshSuccess'
        });
            
		$api.setStorage("refreshAssetTime", new Date());
	}

	g.pullImage = function(){
		return ['widget://image/refresh/dropdown0.png','widget://image/refresh/dropdown0.png','widget://image/refresh/dropdown0.png','widget://image/refresh/dropdown1.png','widget://image/refresh/dropdown2.png','widget://image/refresh/dropdown3.png','widget://image/refresh/dropdown4.png','widget://image/refresh/dropdown5.png'];
	}

	g.loadImage = function(){
		return ['widget://image/refresh/dropdown5.png','widget://image/refresh/dropdown5.png','widget://image/refresh/dropdown5.png','widget://image/refresh/dropdown4.png','widget://image/refresh/dropdown3.png','widget://image/refresh/dropdown2.png','widget://image/refresh/dropdown1.png','widget://image/refresh/dropdown0.png'];
	}
	
	window.global = g;
})(window);
