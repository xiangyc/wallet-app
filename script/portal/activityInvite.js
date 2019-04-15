var maxRate;

apiready = function(){
	loadData();
	generateQRcode();
    initEvent();

    getMaxRate();
}

function loadData(){
	recommendIncome();
 	listTop10();

	if (api.systemType === 'ios'){
		$api.removeCls($api.byId('declare'), 'hide');
	}
}

function generateQRcode(){
	var params = 'platType=code&memberId=' + global.getMemberId() + '&mobile=' + global.getUserMobile();
	var shareUrl = global.getShareUri() + '/register.html?' + params;

    $('#qrcodeDiv').qrcode({
        width : 200,
        height : 200,
        correctLevel : 0,
        text : shareUrl
    });
}

function initEvent(){
	api.addEventListener({
	    name:'loginRefresh'
    },function(ret,err){
    	loadData();
    });
}

function listTop10() {
	var url = global.getRequestUri() + '/period-income/recommend-income-top10'
	var params = '?start=0&maxResults=10';
	page.init(10, 'invites-content', 'invites-template', url, params, false, '');
}

function recommendIncome(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/period-income/recommend-income-member',
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret) {
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){	
				global.setToast(ret.message);
				api.sendEvent({
			   	   name:'invalidTokenEvent'
		    	});
			}else{
				if(ret.recommendCount >0)
					$api.html($api.byId('inviteNum'), ret.recommendCount);

				if(ret.totalRecommendIncome >0)
					$api.html($api.byId('inviteMoney'), global.formatNumber(ret.totalRecommendIncome, 2));				
			}
		} else {
			global.setErrorToast();
		}
	});
}

function inviteReward(){
	var header = '../common/header';
	var	params = { "page" : "../activity/inviteReward", "title" : "已获奖励"};
	global.openWinName('inviteRewardWin', header, params);
}

function inviteFriends(){
	var header = '../common/header';
	var	params = { "page" : "../activity/inviteFriends", "title" : "成功邀请"};
	global.openWinName('inviteFriendsWin', header, params);
}

function share(){
	if (!global.isValidUser()) {
		winName = "loginWin";
		params = {  "title" : "登录" };
		global.openWinName(winName, '../member/login', params);
		return;
	}
	
	$api.addCls($api.byId('shareDiv'), 'share-acin');
	$api.removeCls($api.byId('shareDiv'), 'hide');
	$api.removeCls($api.byId('buybackdrop'), 'hide');
}

function closeShare(){
	$api.removeCls($api.byId('shareDiv'), 'share-acin');
	$api.addCls($api.byId('shareDiv'), 'share-acout');
	$api.addCls($api.byId('buybackdrop'), 'hide');
}

function codeShare(){
	if (!global.isValidUser()) {
		winName = "loginWin";
		params = {  "title" : "登录" };
		global.openWinName(winName, '../member/login', params);
		return;
	}
	
	$api.removeCls($api.byId('codeDiv'), 'hide');
	$api.removeCls($api.byId('codebackdrop'), 'hide');
}

function closeCodeShare(){
	$api.addCls($api.byId('codeDiv'), 'hide');
	$api.addCls($api.byId('codebackdrop'), 'hide');
}

function shareQzone(shareType) {
	var params = 'platType=' + shareType + "&memberId=" + global.getMemberId() + '&mobile=' + global.getUserMobile();
	var qq = api.require('qq');

	var imgUrl = 'widget://image/activity-invite01.jpg';
    if(shareType === 'qzone'){
        imgUrl = 'https://www.jsz.top/images/activity-invite01.jpg'
    }

	qq.installed(function(ret, err) {
		if (ret.status) {
			qq.shareNews({
				url : global.getShareUri() + '/register.html?' + params,
				title : '金算子，会赚钱的黄金零钱包！',
				description : "购金即享"+maxRate+"%年化赠金！",
				imgUrl : imgUrl,
				type : shareType
			},function(ret, err) {
				if (ret.status) {
					api.ajax({
						method : 'put',
						cache : false,
						dataType : 'json',
						returnAll : false,
						url : global.getRequestUri() + '/members/update/shareStatistics',
						headers : global.getRequestToken(),
						data : {
							values : {
								'platType' : shareType
							}
						}
					}, function(ret, err) {
					});
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
	var params = 'platType=' + shareType + "&memberId=" + global.getMemberId() + '&mobile=' + global.getUserMobile();;
	var wx = api.require('wx');
	wx.isInstalled(function(ret, err) {
		if (ret.installed) {
			wx.shareWebpage({
				scene : shareType,
				title : '金算子，会赚钱的黄金零钱包！',
				description : "购金即享"+maxRate+"%年化赠金！",
				thumb : 'widget://image/activity-invite01.jpg',
				contentUrl : global.getShareUri() + '/register.html?' + params
			}, function(ret, err) {
				if (ret.status) {
					api.ajax({
						method : 'put',
						cache : false,
						dataType : 'json',
						returnAll : false,
						url : global.getRequestUri() + '/members/update/shareStatistics',
						headers : global.getRequestToken(),
						data : {
							values : {
								'platType' : shareType
							}
						}
					}, function(ret, err) {
					});
				} else {
					global.setToast('分享失败');
				}
			});
		} else {
			global.setToast('当前设备未安装微信客户端');
		}
	});
}

function getMaxRate() {
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-products/max-rate',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if (ret && ret.obj) {
            maxRate = ret.obj;
        } else {
            global.setErrorToast();
        }
    });
}