var h;
var params = {  "title" : "登录" };
var title = "";
var winName;
apiready = function(){
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    //var body_h = api.winHeight;
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;
    var url = global.getH5url()+api.pageParam.url;
    
    if(api.pageParam.fullDomain === 1){
    	url = api.pageParam.url;
    }
    
    h = pos.h;
    
    title = api.pageParam.title;
    global.setHelpTitle(title);
	$api.html($api.byId('title'), title);
	
	winName = api.pageParam.name;
	
    api.openFrame({
        name: api.pageParam.name + 'Frame',
        url: url,
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto'
        },
        reload: true,
        bounces: false,
        vScrollBarEnabled: false
    });

	if(winName && winName =='productBuySuccessH5Win'){
		api.addEventListener({
			name : 'viewappear'
		}, function(ret, err) {
			api.closeWin({name:'productBuyOne'});
			api.closeWin({name:'productBuy'});	
		});
	}
	
    initEvent();
}

function closeWin(){
    api.closeWin();
}

function doCustom(){
    if (!global.isValidUser()) {        
        var params = {  "title" : "登录" };
        global.openWinName("loginWin", '../member/login', params);
        return;
    }

    var params = { "page" : "../custom", "title" : "客服" };
    global.openWinName('customWin', '../common/udesk_header', params);
} 

function initEvent(){            
    api.addEventListener({
        name:'loginRefresh'
    },function(ret,err){
        
        if(ret && ret.value && ret.value.optSrc =='reg' && ret.value.frameIndex ){//app注册事件

            api.closeWin({
                name: 'loginWin'
            });

            api.closeWin({
                name : 'loginSubWin'
            });

        }else{
            api.closeWin({
                name : 'h5Login'
            });

            var token = "";
            var systemType =api.systemType;
                    
            if($api.getStorage(global.getTokenName())){
                token = "?Authorization=Bearer__" + $api.getStorage(global.getTokenName()) + "&Key=Bearer__" + global.getKey() + "&ClientId=Bearer__1"; 
            }else{
                token = "?Authorization=Bearer__&Key=Bearer__&ClientId=Bearer__1"; 
            }

            var url = global.getH5url()+h5UrlMain + token + '&systemType=' + systemType ;

            api.openFrame({
                name: 'mainPartnerFrame',
                url: url,
                rect:{
                    x: 0,
                    y: h,
                    w: 'auto',
                    h: 'auto'
                },
                reload: true,
                bounces: false,
                vScrollBarEnabled: false
            });
        }
    });
        
        
	api.addEventListener({
        name:'webLoginEvent'
    },function(ret,err){
		global.openWinName("loginWin", '../member/login', params);
    });

    api.addEventListener({
        name:'realNameBankCardEvent'
    },function(ret,err){
       var p = { "page" : "../member/bindNewBankCard", "title" : "实名绑卡", "auth" : 1,"reBind": 2 };
       global.openWinName("bindCardWin", '../common/custom_header', p);
    });

    api.addEventListener({
        name:'lookAroundEvent'
    },function(ret,err){

        api.closeWin({
            name : 'registerSuccessForwardH5Win'
        });

        setTimeout(function(){
           api.closeWin();
        }, 500);
       
    });
    
    api.addEventListener({
        name:'openOrderEvent'
    },function(ret,err){

	    var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1 };
		global.openWinName('orderListHeader', '../member/orderListHeader', params);
       
    });
    
}

//********************* 我的合伙业绩页面 **********************/

//合伙人规则
function openUpgradeRule(){
    var url= h5UrlUpgradeRule;
    global.openH5Win("openUpgradeRule","../common/h5_common_header", url, '合伙人规则');
}

//成长值明细
function openGrowthDetails(orgId){
    var param = { title : "成长值明细", page : "../partner/growthDetails", orgId:orgId};
    global.openWinName("growthDetails","../common/header", param);
}

function openOrganDetail(orgId){
    var url= h5UrlOrganDetail+"?orgId="+orgId;
    global.openH5Win("openOrganDetail","../common/h5_common_header", url, '机构详情');
}

function openOrganList(){
   var url= h5UrlOrganList;
   global.openH5Win("openOrganList","../common/h5_common_header", url, '机构列表');
}

function openRankingList(index){
   var url= h5UrlRankingList+'?index='+index;
   global.openH5Win("openRankingList","../common/h5_common_header", url, '邀请达人榜');
}

//面对面邀请(机构、个人主页)
function codeShare(type){
	orgShare(2, type);
}

function share(type){
    orgShare(1, type);
}

function orgShare(index, type){
    api.openFrame({
        name: 'share',
        url: '../partner/personalInvite.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        pageParam : {
            index : index,
            type : type
        },
        bounces: false,
        vScrollBarEnabled: false
    });
}

function openActivityDescription(){    
   var url= h5UrlActivityDescription;
   global.openH5Win("openActivityDescription","../common/h5_common_header", url, '活动说明');
}

function openPersonalAchieve(type){
    if(type ==1){
         var param = { title : "邀请明细", page : "../partner/personalAchieve" , type:type};
        global.openWinName("personalAchieve1","../common/header", param);
    }else{
        var param = { title : "奖励明细", page : "../partner/personalAchieve", type:type};
         global.openWinName("personalAchieve2","../partner/personalAchieveHeader", param);
    }

}

function doList(){
    var param = { title : "历史业绩", page : "../partner/personalHistory"};
    global.openWinName("personalHistory","../common/header", param);
}

function login(){
    var params = {"title" : "登录" };
     global.openWinName('h5Login', '../member/login', params);  
}

function call(){    
    api.call({
        type: 'tel_prompt',
        number: '4006832999'
    }); 
}


function openRecommendOrganList(){
    var param = { title : "推荐机构列表", page : "../partner/organList"};
    global.openWinName("recommendOrganList","../common/header", param);
}