var header_h = 0;
var body_h = 0;
var rect_h = 0;
var ajpush;
var websocket;
var frameIndex = 0;
var NVTabBar;

apiready = function() {
	ajpush = api.require('ajpush');
	
	changeNoticeStatus();
	//hasFirstLoad();
	initFrame();
	initTabBar();
	initEvent();
	
	hasNetworkConnection();
}

function initTabBar(){
	NVTabBar = api.require('NVTabBar');
	NVTabBar.open({
	    styles: {
	        bg: '#fff',
	        h: 50,
	        dividingLine: {
	            width: 0.5,
	            color: '#f4f4f4'
	        }
	    },
	    items: [{
	        w: api.winWidth / 5.0,
	        bg: {
	            marginB: -3,
	            image: '#fff'
	        },
	        iconRect: {
	            w: 28.0,
	            h: 28.0,
	        },
	        icon: {
	            normal: 'widget://image/ic_tab_index01.png',
	            selected: 'widget://image/ic_tab_index02.png'
	        },
	        title: {
	            text: '首页',
	            size: 11,
	            normal: '#b5b5b5',
	            selected: '#ffb11b',
	            marginB: 2
	        }
	    }, {
	        w: api.winWidth / 5.0,
	        bg: {
	            marginB: -3,
	            image: '#fff'
	        },
	        iconRect: {
	           w: 28.0,
	            h: 28.0,
	        },
	        icon: {
	            normal: 'widget://image/ic_tab_pr01.png',
	            selected: 'widget://image/ic_tab_pr02.png'
	        },
	        title: {
	            text: '分类',
	            size: 11,
	            normal: '#b5b5b5',
	            selected: '#ffb11b',
	            marginB: 2
	        }
	    }, {
	        w: api.winWidth / 5.0,
	        bg: {
	            marginB: 10,
	            image: 'widget://image/share/qq.png' //中间背景图
	        },
	        iconRect: {
	            w: 72,
	            h: 72,
	        },
	        icon: {
	            normal: 'widget://image/ic_tab_red01.png',
	            highlight: 'widget://image/ic_tab_red01.png',
	            selected: 'widget://image/ic_tab_red01.png'
	        },
	        title: {
	            //text : '333',
	            size: 11,
	            normal: '#b5b5b5',
	            selected: '#ffb11b',
	            marginB: 2
	        }
	    }, {
	        w: api.winWidth / 5.0,
	        bg: {
	            marginB: -3,
	            image: '#fff'
	        },
	        iconRect: {
	            w: 28.0,
	            h: 28.0,
	        },
	        icon: {
	            normal: 'widget://image/ic_tab_find01.png',
	            selected: 'widget://image/ic_tab_find02.png'
	        },
	        title: {
	            text: '发现',
	            size: 11,
	            normal: '#b5b5b5',
	            selected: '#ffb11b',
	            marginB: 2
	        }
	    }, {
	        w: api.winWidth / 5.0,
	        bg: {
	            marginB: -3,
	            image: '#fff'
	        },
	        iconRect: {
	            w: 28.0,
	            h: 28.0,
	        },
	        icon: {
	            normal: 'widget://image/ic_tab_my01.png',
	            selected: 'widget://image/ic_tab_my02.png'
	        },
	        title: {
	            text: '我的',
	            size: 11,
	            normal: '#b5b5b5',
	            selected: '#ffb11b',
	            marginB: 2
	        }
	    }],
	    selectedIndex: frameIndex
	}, function(ret, err) {		
		if (!global.isValidUser() && (ret.index === 4 || ret.index === 2)) {
			if(global.networkConnection()){
				var params = {};
				if(ret.index == 4){
					params = {"frameIndex": 4 };
				}
				global.openWinName("loginWin", "./html/member/login", params);
	
				NVTabBar.setSelect({
				    index: frameIndex,
				    selected: true,
				});
			}else{
				global.setToast('网络连接出错,请检查网络配置');
			}
			return;
		}
		
		if(ret.index === 2){
			//打开红包
            global.openWinName("redpacketSendWin", "./html/redpacket/prepareHeader", "");
            
            setTimeout(function(){
            NVTabBar.setSelect({
			    index: frameIndex,
			    selected: true,
			});}, 300);
		}else{
			switchBar(ret.index);
		}
	});
}

function switchBar(index){
	frameIndex = index;
	if(frameIndex === 0){
		api.setFrameAttr({
		    name: 'indexHeadFrame',
		    hidden: false
		});
	}else{
		api.setFrameAttr({
		    name: 'indexHeadFrame',
		    hidden: true
		});
	}
		
	var $header = $api.byId('header');
	var $titleBar = $api.domAll($header, '.topbar');
	for (var i = 0; i < $titleBar.length; i++) {
		$api.removeCls($titleBar[i], 'activebar');
	}
	if(index === 1 || index === 3){
		var obj = (index === 1 ? 'asset' : 'activity');
		$api.addCls($api.byId(obj), 'activebar');
		header_h = $api.offset($header).h
		
		api.setFrameGroupAttr({
		    name: 'frameGroup',
		      rect : {
		            x : 0,
		            y : header_h,
		            w : 'auto',
		            h : rect_h
		        }
		});
	}else{
		header_h = 0;
		api.setFrameGroupAttr({
		    name: 'frameGroup',
		      rect : {
		            x : 0,
		            y : 0,
		            w : 'auto',
		            h : rect_h
		        }
		});
	}
	
	if(index > 2){
		index = index - 1;
	}

	api.setFrameGroupIndex({
		name : 'frameGroup',
		index : index
	});
}

//连接socket
function connectWebsocket(){
	if(api.systemType === 'android' && (api.systemVersion == '8.0.0' || api.systemVersion == '8.0' || api.systemVersion == '8' || 
	api.systemVersion == '7.0.0' || api.systemVersion == '7.0' || api.systemVersion == '7' || 
	api.systemVersion == '8.1.0' || api.systemVersion == '8.1')){
		return;
	}
	
	return;
	var memberId = global.getMemberId();
	if (memberId === undefined || memberId == "") {
		memberId = null;
	}
	
	websocket = new WebSocket(global.getWebSocketUri() + "/websocket/webSocketServer?memberId=" + memberId);

    websocket.onopen = onOpen;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = onClose;
    
    window.close = function(){
    	websocket.onclose();
    }
}

function onOpen(evt) {
	//global.setToast('成功建立连接');
	//console.log('成功建立连接');
}
    
function onMessage(evt) {
	//global.setToast('Retrieved data from server: ' + evt.data);
	var socketData = eval('(' + evt.data + ')');
	var message = socketData.message;
	var type = socketData.type;

	//针对返回不同的业务类型处理相应的跳转和刷新动作
	if (type == 1) {
		//现金资产方法
		api.sendEvent({
        	name: 'financeAccountRefresh'
    	});
		//我的资产和收益
    	api.sendEvent({
        	name: 'accountIncomeRefresh'
    	});

	} else if(type == 2) {
		//黄金资产更新事件
		api.sendEvent({
        	name: 'goldAccountRefresh'
    	});

    	api.sendEvent({
        	name: 'getGoldAccountDataRefresh'
    	});

    	//现金资产方法
		api.sendEvent({
        	name: 'financeAccountRefresh'
    	});
		//我的资产和收益
    	api.sendEvent({
        	name: 'accountIncomeRefresh'
    	});

	} else if(type == 3) {
		//刷新红包
		api.sendEvent({
        	name: 'showRedpackageRefresh',
        	extra: {
        		code : message
        	}
    	});
	} else if(type == 4){
		//关闭红包
		api.sendEvent({
        	name: 'closeRedpackageRefresh',
        	extra: {
        		code : message
        	}
    	});
	} else {
		api.sendEvent({
        	name: 'goldAccountRefresh'
    	});
	}
}

function onError(evt) {
}

function onClose(evt) {
	//
}


function hasFirstLoad(){
	if(global.getGuideFlag() !== global.getVersion()){
		global.setGuideFlag();
		global.openWin('html/statics/guide', '{}');
	}
}

function initFrame() {
	var $header = $api.byId('header');
	var systemType = api.systemType;
    var systemVersion = parseFloat(api.systemVersion);
    if (systemType == "ios" || (systemType == "android" && systemVersion >= 4.4)) {
		if (systemType == "android") {
			header.style.paddingTop = '22px';
			// 'dark',//light
			api.setStatusBarStyle({
			    style: 'dark',
			    color: 'rgba(0, 0, 0, 0)'
			});
		}else{
			$api.fixStatusBar(header);
		}
    } else {
       	$api.fixIos7Bar(header);
	}

	var $body = $api.dom('body');
	//var $footer = $api.byId('footer');
	header_h = $api.offset($header).h;
	var body_h = $api.offset($body).h;
	//var footer_h = $api.offset($footer).h;
	rect_h = body_h - 50;

	api.openFrameGroup({
		name : 'frameGroup',
		scrollEnabled : false,
        rect : {
            x : 0,
            y : 0,
            w : 'auto',
            h : rect_h,
            marginLeft : 0,
            marginTop  : 0,
            marginBottom : 0,
            marginRight : 0
        },
		index : 0,
		frames : [{
			name : 'indexFrame',
			url : 'html/main.html',
			pageParam : {
				headerHeight : rect_h
			},
			 bounces:false
		}, {
			name : 'assetFrame',
			url : 'html/product/classify.html',
			pageParam : {
				headerHeight : rect_h
			},
		}, {
			name : 'discoverFrame',
			url : 'html/discover.html',
			pageParam : {
				headerHeight : rect_h
			},
		}, {
			name : 'accountFrame',
			url : 'html/member/main.html',
			pageParam : {
				headerHeight : rect_h
			}
		}]
	}, function(ret, err) {
	
	});

	//初始化ajpush
	initAJPush();

	//是否强制更新
	versionCheck();

	//是否系统维护
	 systemMaintenance();
}

function initEvent(){
    
    api.addEventListener({
	    name:'networkConnection'
    },function(ret,err){
		hasNetworkConnection();
    });
	
	api.addEventListener({
	    name:'loginRefresh'
    },function(ret,err){
    	initAJPush();
    	connectWebsocket();
    });

    api.addEventListener({
	    name:'showNoticeCss'
    },function(ret,err){
    	changeNoticeStatus();
    });
    
    api.addEventListener({
	    name:'resume'
	}, function(ret, err){        
    	ajpush.setBadge({
	    	badge:0
		});

		systemMaintenance();
	});

	api.addEventListener({
	    name:'openGoldExtraction'
	}, function(ret, err){        
    	if(ret && ret.value){
    		openGoldExtraction(ret.value);//h5提金
		}
	});
	
	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
		var price = $api.getStorage('goldPrice');
		if(price){
			$api.html($api.byId('goldPrice'), global.formatNumber(price.lastPrice, 2));
		}
    });
    
    //NVTabBar
    api.addEventListener({
	    name:'frameSwitchEvent'
    },function(ret,err){
        if (ret.value  && ret.value.index != 4) {
	    	api.closeToWin({
		        name: 'root'
	        });
       	}

    	NVTabBar.setSelect({
	        index: ret.value.index
        });
        switchBar( ret.value.index);
    });

    api.addEventListener({
	    name:'goOnBuyEvent'
    },function(ret,err){

    	api.closeToWin({
	        name: 'root'
        });
        
    	NVTabBar.setSelect({
	        index: 1
        });
    	switchBar(1);
    });


    api.addEventListener({
        name:'realNameBankCardEvent'
    },function(ret,err){
        var p = { "page" : "../member/bindNewBankCard", "title" : "实名绑卡", "auth" : 1,"reBind": 2 };
       global.openWinName("bindCardWin", './html/common/custom_header', p);
    });
}

function hasNetworkConnection(){
	if(global.networkConnection()){
		connectWebsocket();
		$api.removeCls($api.byId('notice1'), 'hide');
		$api.removeCls($api.byId('notice2'), 'hide');
		$api.removeCls($api.byId('notice3'), 'hide');
		$api.removeCls($api.byId('set1'), 'hide');
		$api.removeCls($api.byId('mainSpan'), 'hide');
	}else{
		$api.addCls($api.byId('notice1'), 'hide');
		$api.addCls($api.byId('notice2'), 'hide');
		$api.addCls($api.byId('notice3'), 'hide');
		$api.addCls($api.byId('set1'), 'hide');
		$api.addCls($api.byId('mainSpan'), 'hide');
	}
}

function doNotice() {
	var params = { "page" : "../noticeList", "title" : "公告" };
	global.openWinName('noticeWin', 'html/common/header', params);
}

function doSet(){
	api.execScript({
		frameName: 'accountFrame',
	    script: 'openSubWin(17);'
    });
}

function changeNoticeStatus() {
	var readNoticeTime = global.getReadNoticeTime();
	var publishTime = global.getPublishTime();

	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/notices',
		headers : global.getRequestToken(),
		data : {
				values : {
					'start' : 0,
					'maxResults' : 1
				}
			}
	}, function(ret, err) {
		if (ret) {
			if (readNoticeTime != null && publishTime != null){
				if(ret.items && ret.items.length >0){
					var lastPublishTime = ret.items[0].publishTime;
					if (lastPublishTime > publishTime) {
						publishTime = lastPublishTime;
					}
					if (readNoticeTime >= publishTime) {
						$api.addCls($api.byId('show1'), 'hide');
					} else {
						$api.removeCls($api.byId('show1'), 'hide');
					}
				}
			} else {
				$api.removeCls($api.byId('show1'), 'hide');
			}
		}
	});

}

function initAJPush(){
	if(api.systemType === 'ios'){
		bindAlias();
		addListener();
	}else{
		ajpush.init(function(ret, err){
			if(ret && ret.status){
				bindAlias();
				addListener();
			}
		});
	}
}

function bindAlias(){
	ajpush.bindAliasAndTags({
		alias: global.getSecurityMobile(),
		tags: ['' + global.getSecurityMobile() + '']
	}, function(ret, err){
	});
}

function addListener(){
	// ajpush.setListener(function(ret){
	// 	if(ret){
 //    		messageHandle(ret.id, ret.content, ret.extra);
	// 	}
	// });

	if(api.systemType === 'ios'){
		api.addEventListener({
	   		name: 'noticeclicked'
		}, function(ret, err) {
		    if (ret && ret.value) {
		        var data = ret.value;
				messageHandle(data.id, data.content, data.extra);
		    }
		});
	}else{
		api.addEventListener({
	    	name: 'appintent'
		}, function(ret, err) {
			//alert('appintent='+JSON.stringify(ret));
		    if (ret && ret.appParam.ajpush) {
		        var data = ret.appParam.ajpush;
				messageHandle(data.id, data.content, data.extra);
		    }
		});
	}

}

function openPalaceWin(headType, extra){
	var palaceHeader = "./html/common/adv_header";
	var palaceWinName = 'palaceWin';
	switch(headType){
		//case 1:
			//公共
			//break;
		case 2:
			//混合
			palaceWinName = "mainPartner";
			palaceHeader = "./html/common/h5_header";
			break;
		case 3:
			//H5
			palaceHeader = "./html/common/adv_header";
			break;
	}
	
	global.openOtherWin(palaceWinName, palaceHeader, extra);
}

/**
 *处理监听消息
*/
function messageHandle(id, content, extra){
	var extraJson = eval("(" + JSON.stringify(extra) + ")");
	extraJson = eval("(" + extraJson.from + ")");

	if(extraJson.type === undefined){
		return;
	}

	if(extraJson.type == 7){
		openPalaceWin(extraJson.headType, extra);
	}else if(extraJson.type == 1){//弹出框
		api.alert({
			msg : content,
			title : '推送消息'
	    },function(ret,err){
		
	    });		
	}else if(extraJson.type == 2){// 站内
		var url = extraJson.url;

		api.confirm({
			msg : content,
			buttons : ['去看看', '稍后']
	    },function(ret,err){
	    	if (ret.buttonIndex === 1) {

	    		var header = extraJson.header;
	    		var params = extraJson.params;

	    		global.openWinName('pushIndexSubWin', header, params);
			}
	    });		
	}else if(extraJson.type == 3){//站外

		api.confirm({
			msg : content,
			buttons : ['去看看', '稍后']
	    },function(ret,err){
	    	if (ret.buttonIndex === 1) {
				var linkSrc = extraJson.linkSrc;
				var title = extraJson.title;
	    		var subTitle = extraJson.subTitle;

	    		var params = {"id" : id, "linkSrc" : linkSrc, "title": title, "subTitle": subTitle };
				global.openWinName('activityWebWin', './html/activity/activityWebHeader',  params);
			}
	    });	
		    
	}else if(extraJson.type == 4){//h5

		api.confirm({
			msg : content,
			buttons : ['去看看', '稍后']
	    },function(ret,err){
	    	if (ret.buttonIndex === 1) {
				var h5UrlMain = extraJson.linkSrc;
				var title = extraJson.title;
	    		var header = extraJson.header;
	    		var frameName = extraJson.frameName;

				var token = "";
		        var systemType =api.systemType;
		                
		        if($api.getStorage(global.getTokenName())){
		            token = "?Authorization=Bearer__" + $api.getStorage(global.getTokenName()) + "&Key=Bearer__" + global.getKey() + "&ClientId=Bearer__1"; 
		        }else{
		            token = "?Authorization=Bearer__&Key=Bearer__&ClientId=Bearer__1"; 
		        }

				var url = h5UrlMain + token + '&systemType=' + systemType ;
				global.openH5Win(frameName,header, url, title);

			}
	    });	
		    
	}else if(extraJson.type == 6){// 解绑银行卡

		api.confirm({
			msg : content,
			buttons : ['去看看', '稍后']
	    },function(ret,err){
	    	
	    	var params = extraJson.params;
	    	
	    	if(params ){
	    		if( params.status ==1){
	    			global.setUserBindCard(false);
	    		}else{
					global.setUserBindCard(true);
	    		}
	    	}
	    	if (ret.buttonIndex === 1) {

	    		var header = extraJson.header;
	    		var params = extraJson.params;

	    		api.execScript({
					frameName: '../member/withdraw',
				    script: 'closeWithdrawTip();'
			    });

	    		global.openWinName('bindCardWin', header, params);

			}
	    });		
	}

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

			if (ret.currentVersion ) {
				var params = {　"downloadUrl" : ret.downloadUrl, "description": ret.description, "updateInstall":ret.updateInstall };
				api.openFrame({
			       name: 'versionWin',
			       url : './html/statics/version.html',
			       pageParam : params,
			        rect:{
			            x: 0,
			            y: 0,
			            w: 'auto',
			            h: 'auto'
			        },
			        bounces: false,
			        vScrollBarEnabled: false
			    });
			}
		}
	});
}



function doCustom2(helpTitle){
	alert('test');
	
	api.openFrame({
        name: 'custom1',
        url: 'http://reocar.udeskb1.com/im_client/?web_plugin_id=1',
        rect:{
            x: 0,
            y: 10,
            w: 'auto',
            h: 'auto'
        },
        pageParam : api.pageParam,
        bounces: false,
        vScrollBarEnabled: false
    });

}


function doCustom(helpTitle){
	if (!global.isValidUser()) {		
		var params = {  "title" : "登录" };
		global.openWinName("loginWin", './html/member/login', params);
 		return;
	}
	
	global.setHelpTitle(helpTitle)
	var params = { "page" : "../custom", "title" : "客服"};
	global.openWinName('customWin', 'html/common/udesk_header', params);
}

function openGoldExtraction(obj){
	var header = "html/common/header";
	var src = obj.src;
	var title = obj.title;

	var params = { "page" : "./html/member/goldExtraction", "title" : title, "src" : src };

	if(src ==2){
 		params =  { "page" : "../member/goldExtraction", "title" : title,"orderId" : obj.orderId , "oldgoldPrice" : obj.oldGlodPrice, "amount" : obj.amount, "money" : obj.money, "src" : src};
		
	}else{
		params = { "page" : "./html/member/goldExtraction", "title" : title, "src" : src };
	}
	
	global.openWinName('goldRedAccountSubWin', header, params);

}

function  systemMaintenance(){
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'text',
		returnAll : false,
		url : global.getShareUri() + '/jsz/app/system/maintenance',
	}, function(ret, err) {
		if (err && err.statusCode =='555') {			
			alert(JSON.stringify(err.msg));
		}
	});
}

function openGoldChart(){
	var params = { "page" : "../goldPriceLog", "title" : "金价走势"};
	global.openWinName("goldPriceLog", "./html/common/header", params);
}


function search(){
	global.openWinName('searchWin', './html/product/proSearch', '');
}