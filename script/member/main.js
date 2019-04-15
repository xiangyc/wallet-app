var bindCardWinName = "bindCardWin";
var payPasswordWinName = "payPasswordWin";
var header = "../common/header";
var params;
var status = 0;
var totalMoney = 0;
var yesterdayIncome = 0;
var totalIncome = 0;
var collectIncome = 0;
var accountMoney= 0;
var totalGoldAmount= 0;
var showFlag = 1;
var serviceFlag,activityFlag;
var isHaveInvestment = true;//是否持有安心金 true=是 false=否

apiready = function(){

	changeNoticeStatus();

	initEvent();
	validCouponNum();
	validOrgRole();
	loadUserInfo();
	isInvestment();//是否持有安心金
	global.refreshAsset();
	
	if($api.getStorage("refreshAssetTime")){
		var offsetTime = new Date($api.getStorage("refreshAssetTime")).valueOf() + 7200*1000;

		if(new Date() > new Date(offsetTime)){
			global.refreshAsset();
			validOrgRole();
		}
	}

	isNetworkConnection();
}

function isNetworkConnection() {
	// 无网络
	if(global.networkConnection()){
		$api.addCls($api.byId('toast'), 'hide');
	} else {
		$api.removeCls($api.byId('toast'), 'hide');
	}
}

function isInvestment(){
		api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/investment-orders/member/is-investment',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if(ret){
				$api.attr($api.byId('redPacketLi'), 'onclick', 'openSubWin(21);');
				if(ret.obj ){	
				  isHaveInvestment = true;

  				  $api.html($api.byId('goldRedpackageId'), "黄金红包");	  				  
  				  $api.html($api.byId('moneyText'), "总资产(元)");	

				  $api.removeCls($api.byId('incomeDiv'), 'hide');
				  $api.removeCls($api.byId('assetUl'), 'hide');
 				  $api.removeCls($api.byId('orderListLi'), 'hide');

 				  $api.removeCls($api.byId('assetDiv'), 'member-new');
 				  $api.removeCls($api.byId('mainDiv'), 'member-new');
			  
				}else{
				  isHaveInvestment = false;			

				  $api.attr($api.byId('redPacketLi'), 'onclick', 'openSubWin(21);');
				  $api.attr($api.byId('moneyText'), 'onclick', 'openSubWin(8);');
 				  $api.attr($api.byId('totalMoney'), 'onclick', 'openSubWin(8);');				  

				  $api.html($api.byId('goldRedpackageId'), "我的红包金");
				  $api.html($api.byId('moneyText'), "账户余额(元)");

				  $api.addCls($api.byId('incomeDiv'), 'hide');
				  $api.addCls($api.byId('assetUl'), 'hide');
 				  $api.addCls($api.byId('orderListLi'), 'hide');	

 				  $api.addCls($api.byId('assetDiv'), 'member-new');
 				  $api.addCls($api.byId('mainDiv'), 'member-new');

				}
			}

			loadIncomeData(); 
	});
}

function validOrgRole(){
	api.ajax({
			method : 'get',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/orgmember/getOrgMember',
			headers : global.getRequestToken()
		}, function(ret, err) {
		
			if(ret && ret.orgRole){
				global.setOrgRole(ret.orgRole);
				
				if(ret.orgRole && ret.orgRole == "1"){
					$api.removeCls($api.byId('accountLi'), 'hide');
					
					//PENDING_ACTIVATE("待激活", 0), NORMAL("正常", 1),WAIT_DISSOLVED("待解散", 2), DISSOLVED("解散", 3), AUDIT_NOT_PASS("审核不通过", -1);
			
					if(ret.org ){
						if(ret.org.status == 0){						
							$api.html($api.byId('activationId'), '待激活');
						}else if(ret.org.status == 1){						
							$api.html($api.byId('activationId'), ret.org.level.levelName);
						}else{// 待解散，解散，审核不通过 等其他情况不显示
							$api.addCls($api.byId('accountLi'), 'hide');
						}
					}
					
				}else{
					$api.addCls($api.byId('accountLi'), 'hide');
				}
				
				if(ret.org){
					global.setOrgActivationStatus(ret.org.status);
				}							
			}
	});
}

function validUserStatus(){
	if(global.isValidUser()) {
		status = 0;
		//实名
		if(!global.getUserIdCard()){
			params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1  };
			header = "../common/custom_header";
			return global.validIdCardTooltip(bindCardWinName, header, params);
		}
		//绑卡
		if(global.getUserBindCard() === '0'){
			params = { "page" : "../member/bindNewBankCard", "title" : "绑定银行卡" };
			header = "../common/custom_header";
			return global.validBindCardTooltip(bindCardWinName, header, params);
		}
		//交易密码
		if(global.getUserPayPassword() === '0'){
			params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
			return global.validPayPasswordTooltip(bindCardWinName, header, params);
		}

		status = 1;
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
		global.refreshAsset();
		validOrgRole();
		api.refreshHeaderLoadDone();

		isNetworkConnection();
		loadUserInfo();
		isInvestment();//是否持有安心金
		api.sendEvent({
			name : 'havaCacheRefresh'
		});

	});

	api.addEventListener({
	    name:'accountIncomeRefreshSuccess'
    },function(ret,err){
    	validCouponNum();
		isInvestment();//是否持有安心金
    });

	api.addEventListener({
	    name:'financeAccountRefreshSuccess'
    },function(ret,err){
    	validCouponNum();
		isInvestment();//是否持有安心金
    });

	//登录更新事件
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
	
		api.closeWin({
			name: 'loginWin'
        });

		api.closeWin({
			name: 'loginSubWin'
        });

        api.closeWin({
            name : 'h5Login'
        });

        api.closeWin({
			name: 'thirdLoginWin'
        });

		if (ret.value  && ret.value.frameIndex == 4) {
         	//1 注册 doNothing h5端会引导实名绑卡
         	//2 切换
			api.sendEvent({
		        name:'frameSwitchEvent',
		        extra: {
		    		index: 4
		        }
	        });
        }

        if(ret.value && ret.value.optSrc ==  'login'){

			//validUserStatus();
		}

		isInvestment();//是否持有安心金
		validCouponNum();
		validOrgRole();
		loadUserInfo();
		
		global.refreshAsset();

		changeNoticeStatus();
	});

	//登出更新事件
	api.addEventListener({
		name : 'logOutRefresh'
	}, function(ret, err) {
		$api.addCls($api.byId('accountLi'), 'hide');

		api.ajax({
				method : 'post',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				url : global.getRequestUri() + '/auth/logout',
				headers : global.getRequestToken(),
				data : {
					values : {
						'platfromSource' : global.getPlatformSource()
					}
				}
			}, function(ret, err) {
				$api.clearStorage();

				api.sendEvent({
			        name:'frameSwitchEvent',
			        extra: {
			    		index: 0
			        }
		        });
		        
				api.closeWin({
					name: 'setWin'
				});

				setTimeout(function(){
					api.sendEvent({
						name:'logOutSuccess'
	                });
                }, 500);
				
		});

		changeNoticeStatus();
	});

	api.addEventListener({
	    name: 'removeOrganization'
	}, function(ret, err) {
		api.closeToWin({name : 'root'});
		$api.addCls($api.byId('accountLi'), 'hide');
		global.setOrgRole("");
	});

	api.addEventListener({
	    name: 'invalidTokenEvent'
	}, function(ret, err) {
		api.closeToWin({name : 'root'});
		
		$api.clearStorage();

		$api.addCls($api.byId('accountLi'), 'hide');
		
		setTimeout(function(){
			api.sendEvent({
				name:'logOutSuccess'
        	});
		}, 300);
	
		setTimeout(function(){
			var params = {"title" : "登录" };
			global.openWinName("loginWin", 'login', params);
		}, 2000);
	});

	api.addEventListener({
	    name: 'activationOrganizationBuyGoldEvent'
	}, function(ret, err) {
		validOrgRole();
	});

	api.addEventListener({
	    name:'showNoticeCss'
    },function(ret,err){
    	changeNoticeStatus();
    });
		
	api.addEventListener({
	    name:'userBindCardRefresh'
    },function(ret,err){
    	api.closeWin({
			name : 'registerSuccessForwardH5Win'
		});

		setTimeout(function(){
			api.closeWin({
				name : 'bindCardWin'
			});
		}, 1000);

    	loadUserInfo();

    });

    api.addEventListener({
	    name:'networkConnection'
    },function(ret,err){
		isNetworkConnection();
    });
    
    api.addEventListener({
	    name:'activityEnd'
    },function(ret,err){
    	validCouponNum();	
    });

    api.addEventListener({
	    name:'openPartnerPlan'
    },function(ret,err){
    	openH5SubWin(1);
    });
    
    api.addEventListener({
		name : 'changeMobileSuccessEvent'
	}, function(ret, err) {
	 
		$api.html($api.byId('userName'), global.getUserMobile());
	});

	api.addEventListener({
	    name:'readNoticeTimeEvent'
    },function(ret,err){
    	$api.setStorage('noticeFlag','false');
    	global.setReadNoticeTime(ret.value.readNoticeTime);
    	global.setPublishTime(ret.value.publishTime);
    	var noticeFlag = $api.getStorage('noticeFlag');

    	if(noticeFlag == 'false' && serviceFlag == 'false' && activityFlag == 'false'){
			$api.addCls($api.byId('unreadNum'), 'hide');
		} else {
			$api.removeCls($api.byId('unreadNum'), 'hide');
		}
    });


	api.addEventListener({
		    name:'readTimeEvent'
	    },function(ret,err){
	    	changeNoticeStatus();
	    });

}

function loadIncomeData(){
	var myAccountIncome = $api.getStorage('accountIncomeResult');
	if(myAccountIncome && myAccountIncome.obj){
	    var accountIncome = myAccountIncome.obj;	    
	    totalMoney = accountIncome.totalMoney;

		if(!isHaveInvestment){//不持有安心金，显示账号余额
			var retUseBalance = $api.getStorage("financeAccountResult");
		    if(retUseBalance){			
			    totalMoney = retUseBalance.useBalance;			
		    }
		}
		yesterdayIncome = accountIncome.yesterdayIncome;
		totalIncome = accountIncome.totalIncome;
		collectIncome = accountIncome.collectIncome;
		accountMoney = accountIncome.accountMoney;
		totalGoldAmount = accountIncome.totalGoldAmount;
		showAssets();
	}
}

function showMessage() {
	if($api.hasCls($api.byId('messageDiv'), 'hide')){
		$api.removeCls($api.byId('messageDiv'), 'hide');
		$api.removeCls($api.byId('messageDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('messageDiv'), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
	}
}

function openSubWin(item) {
	var winName = "memberCenterWin";
	header = "../common/header";

	if(!global.networkConnection()){
		global.setToast('网络连接已断开，请检查网络');
		return;
	}
	if (!global.isValidUser() && item !== 13 && item !== 14 && item !== 15 && item !== 16 && item !== 22) {
		winName = "loginWin";
		params = { "title" : "登录" };
		global.openWinName(winName, './login', params);
		return;
	}

	switch(item) {
		case 2:
			params = { "page" : "../member/yesterdayIncomeList", "title" : "昨日收益"};
			break;
		case 3:
			params = { "page" : "../member/totalIncomeList", "title" : "累计收益" };
			break;
		case 4:
			params = { "page" : "../member/uncollectedIncomeList", "title" : "待收收益" };
			break;
		case 5:
			validUserStatus();
			if(status == 0){
				return;
			}
			header = "../common/custom_header";
			params = { "page" : "../member/recharge", "title" : "充值"};
			break;
		case 6:
			validUserStatus();
			if(status == 0){
				return;
			}

			header = "withdrawHeader";
			params = { "page" : "../member/withdraw", "title" : "提现" };
			break;
		case 7:
			header = "../member/goldAccountHeader";
			params = { "page" : "../member/goldAccount", "title" : "黄金资产" };
			break;
		case 8:
			header = "financeAccountHeader";
			params = { "page" : "../member/financeAccount", "title" : "账户资产" };
			break;
		case 9:
			header = "orderListHeader";
			params = { "page" : "../member/orderList", "title" : "订单记录" };
			break;
		case 10:
			params = { "page" : "../member/withdrawList", "title" : "提现记录" };
			break;
		case 11:
			header = "goldTradeLogListHeader";
			params = { "page" : "../member/goldTradeLogList", "title" : "黄金流水" };
			break;
		case 12:
			header = "tradeLogListHeader";
			params = { "page" : "../member/tradeLogList", "title" : "资金流水" };
			break;
		case 13:
			params = { "page" : "../activity/activityInvite", "title" : "邀请有礼" };
			break;
		case 14:
			params = { "page" : "../statics/contactUs", "title" : "联系我们" };
			break;
		case 15:
			global.openHybridWin("helpWin", "../common/adv_header", global.getH5url()+h5UrlHelp + '?backSrc=app', "帮助中心", 0, '');
			return;
			break;
		case 16:
			params = { "page" : "../feedback", "title" : "用户反馈" };
			break;
		case 17:
			winName = "setWin";
			params = { "page" : "../member/set", "title" : "设置" };
			break;
		case 18:
			global.openHybridWin('shopWin','../common/adv_header', global.getH5url() + '/html/goldshop/shopList.html', '文化金列表', 0, '');
            return;	
			break;
		case 23:
			global.openHybridWin('couponWin','../common/adv_header', global.getH5url() + '/html/member/couponDefault.html', '优惠券列表', 0, '');
            return;	
			break;
		case 19:
			global.openHybridWin('prizeWin','../common/adv_header', global.getH5url() + '/html/member/myGift.html', '我的奖品', 0, '');
            return;
			break;
        case 20:
        	validUserStatus();
			if(status == 0){
				return;
			}
        	header = "../redpacket/prepareHeader";
            params = "";
            winName = "redpacketSendWin";
            break;
        case 21:
        	if(isHaveInvestment){
            	header = "../redpacket/myrecordHeader";
        	}else{
            	header = "../member/redGoldHeader";
        	}
          	/* params = { "page" : "../redpacket/record", "title" : "我的黄金红包" };*/
            break;
        case 22:
			global.openHybridWin('noticeWin','../common/adv_header', global.getH5url() + '/html/notice/messageNotice.html', '消息', 0, '');
            return;
			break;
	}

	global.openWinName(winName, header, params);
}


function validCouponNum() {
	api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/coupon-records/count',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if(ret){
				if(ret.success ){
					if(ret.obj > 0){
						$api.html($api.byId('vaildCouponCount'), ret.obj + "张可用优惠券");
					}else{
						$api.html($api.byId('vaildCouponCount'), "暂无可用");				
					}
				}else{
					$api.html($api.byId('vaildCouponCount'), "暂无可用");
				}
			} else {
				$api.html($api.byId('vaildCouponCount'), "暂无可用");
			}
	});
}

function openH5SubWin(type){
	var token = "";
	var systemType =api.systemType;
			
	if (!global.isValidUser()) {
		var winName = "loginWin";
		var params = { "title" : "登录" };
		global.openWinName(winName, './login', params);
		return;
	}

	if($api.getStorage(global.getTokenName())){
		token = "?Authorization=Bearer__" + $api.getStorage(global.getTokenName()) + "&Key=Bearer__" + global.getKey() + "&ClientId=Bearer__1"; 
	}else{
		token = "?Authorization=Bearer__&Key=Bearer__&ClientId=Bearer__1"; 
	}

	if(type==1){
		var url = h5UrlMain + token + '&systemType=' + systemType ;
		global.openH5Win("mainPartner","../common/h5_header", url, '我的合伙业绩');
	}else {
		var url = h5UrlOrganAccount + token + '&systemType=' + systemType ;
		global.openH5Win("mainOrganPartner","../partner/organAccountHeader", url, '机构账户');
	}
}

function waitForActivation(){
	if(global.getOrgActivationStatus() && global.getOrgActivationStatus() == 1){
		openH5SubWin(2);
	}else{
		api.openFrame({
	        name: 'mainPartnerActivation',
	        url: 'mainPartnerActivation.html',
	        rect:{
	            x: 0,
	            y: 0,
	            w: 'auto',
	            h: 'auto',
	        },
	        bounces: false,
	        vScrollBarEnabled: false
	    });
	}
}

function getBankCard() {
	api.ajax({
		url : global.getRequestUri() + '/bank-accounts/',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret) {
			
			if(ret.success){
				if(ret.obj && ret.obj.status === 1){
					global.setUserBindCard('1');
					$api.html($api.byId('status'), '已认证');
			    }else if(ret.obj && ret.obj.status === 2){
					global.setUserBindCard('1');
					$api.html($api.byId('status'), '解绑中');
			    }else{
			    	global.setUserBindCard('0');
					$api.html($api.byId('status'), '未绑卡');
					validUserStatus();
			    }
			}
	
		}else{
			// global.setUserBindCard('0');
			// $api.html($api.byId('status'), '已认证未绑卡');
			// validUserStatus();


			var userBindCardTmp = global.getUserBindCard();
			
			if(userBindCardTmp && userBindCardTmp =='1'){
				$api.html($api.byId('status'), '已认证');
			}else if(userBindCardTmp && userBindCardTmp =='0'){
				$api.html($api.byId('status'), '已认证未绑卡');
			}else{
				$api.html($api.byId('status'), '未绑卡');
			}
		}
		$api.removeCls($api.byId('status'), 'hide');
	});
}

 
function loadUserInfo(){
	$api.html($api.byId('userName'), '');
	$api.html($api.byId('status'), '');
 	if(!global.isValidUser()){
		return;
 	}
	
	$api.addCls($api.byId('status'), 'hide');
	var userMobile = global.getUserMobile();
	if(userMobile && global.getUserIdCard()){
		$api.html($api.byId('userName'), userMobile);
		getBankCard();
	}else if(userMobile){
		$api.html($api.byId('userName'), userMobile);
		$api.removeCls($api.byId('status'), 'hide');
		validUserStatus();
	}
}

function showHide(){
	if(showFlag === 1){
		showFlag = 0;
	}else{
		showFlag = 1;
	}
	
	showAssets();
}

function showAssets(){
	if(showFlag === 1){
		$api.attr($api.byId('eyeImg'), 'src', '../../image/member/icon-open-eye.png');
		$api.html($api.byId('totalMoney'), global.formatCurrency(totalMoney));
		$api.html($api.byId('yesterdayIncome'), global.formatCurrency(yesterdayIncome));
		$api.html($api.byId('totalIncome'), global.formatCurrency(totalIncome));
		$api.html($api.byId('collectIncome'), global.formatCurrency(collectIncome));
		$api.html($api.byId('totalGoldAmount'), global.formatNumber(totalGoldAmount, 3));
		$api.html($api.byId('accountMoney'), global.formatCurrency(accountMoney));
	}else{
		$api.attr($api.byId('eyeImg'), 'src', '../../image/member/icon-close-eye.png');
		$api.html($api.byId('totalMoney'), '****');
		$api.html($api.byId('yesterdayIncome'), '****');
		$api.html($api.byId('totalIncome'), '****');
		$api.html($api.byId('collectIncome'), '****');
		$api.html($api.byId('totalGoldAmount'), '****');
		$api.html($api.byId('accountMoney'), '****');
	}
}

function changeNoticeStatus() {

		api.ajax({
	        method : 'get',
	        cache : false,
	        dataType : 'json',
	        returnAll : false,
	        headers : global.getRequestToken(),
	        url : global.getRequestUri() + '/notices',
	        data : {
				'start' : 0,
				'maxResults' : 1
			}
	    }, function(ret1, err) {
	        if(ret1){
	        	serviceTimeAjax(ret1);
	        }
	    });
    
	}
	
	
	function serviceTimeAjax(ret1){
		api.ajax({
	        method : 'get',
	        cache : false,
	        dataType : 'json',
	        returnAll : false,
	        headers : global.getRequestToken(),
	        url : global.getRequestUri() + '/service-message/last-time',
	        data : {
				'start' : 0,
				'maxResults' : 1
			}
	    }, function(ret2, err) {
	        if(ret2){
	        	activityTimeAjax(ret1,ret2);
	        } 
	    });
	}
	
	
	function activityTimeAjax(data1,data2){
		api.ajax({
	        method : 'get',
	        cache : false,
	        dataType : 'json',
	        returnAll : false,
	        headers : global.getRequestToken(),
	        url : global.getRequestUri() + '/member-notification/last-time',
	        data : {
				'start' : 0,
				'maxResults' : 1
			}
	    }, function(data3, err) {
	        if(data3){
	        	
	        	var noticeFlag = $api.getStorage('noticeFlag');

				if(!noticeFlag || noticeFlag == 'false'){
					noticeFlag = getNoticeTime(data1);
					$api.setStorage('noticeFlag',noticeFlag);
				}
			
				if(data2 && data2.obj){
					serviceFlag = getServiceTime(data2);
				} else{
					serviceFlag = 'false';
				}

				if(data3 && data3.obj){
					activityFlag = getActivityTime(data3);
				} else{
					activityFlag = 'false';
				}

				if(noticeFlag === 'false' && serviceFlag === 'false' && activityFlag === 'false'){
					$api.addCls($api.byId('unreadNum'), 'hide');
				} else {
					$api.removeCls($api.byId('unreadNum'), 'hide');
				}
	        }
	    });
	}


	//判断平台公告是否已读
	function getNoticeTime(ret){

		var readNoticeTime = global.getReadNoticeTime();
		var publishTime = global.getPublishTime();

		if (ret) {
			if (readNoticeTime && publishTime){

				if(ret.items && ret.items.length >0){
					var lastPublishTime = ret.items[0].publishTime;
					if (lastPublishTime > publishTime) {
						publishTime = lastPublishTime;
					}
					if (readNoticeTime >= publishTime) {
						return 'false';
					} else {
						return 'true';
					}
				}
			} else {
				return 'true';
			}
		}

	}


	/*判断服务通知是否已读*/
	function getServiceTime(ret) {

		if (!global.isValidUser()) {
			return 'false';
		}

	    if (ret && ret.success) {
	    	
	    	var readServiceTime = ret.obj.lastReadTime;
	    	var publishServiceTime = ret.obj.createTime;

	    	if (readServiceTime != null && publishServiceTime != null){
                if (readServiceTime >= publishServiceTime) {
                    return 'false';
                } else {
                    return 'true';
                }
            } else {
                return 'true';
            }
		}

	}

	/*判断活动精选是否已读*/
	function getActivityTime(ret) {

		if (!global.isValidUser()) {
			return 'false';
		}

	    if (ret && ret.success) {

	    	var readActivityTime = ret.obj.lastReadTime;
	    	var publishActivityTime = ret.obj.createTime;

			if (readActivityTime != null && publishActivityTime != null){
				if (readActivityTime >= publishActivityTime) {
                    return 'false';
                } else {
                    return 'true';
                }
			} else {
				return 'true';
			}
		}

	}