var searchCon;

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

    //操作来源
    var optSrc =  api.pageParam.optSrc;
    if(optSrc && optSrc ==1){
        initEvent();
        showGoldPrice();
        $api.attr($api.byId('title'), "onclick", "openGoldChart();");
    }else{	
	   $api.html($api.byId('title'), api.pageParam.title);
    }
    api.openFrame({
        name: api.pageParam.page,
        url: api.pageParam.page + '.html',
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto',
            marginLeft: 0,
    		marginTop: 0,
   			marginBottom: 0,
    		marginRight: 0
        },
        pageParam : api.pageParam,
        bounces: false,
        reload:true,
        vScrollBarEnabled: false
    });

    // 搜索框赋值
    var key = api.pageParam.key;
    if(key && key != undefined){
        $api.val($api.byId('comonKey'), key);
        validateValue();
    } else {
        $api.val($api.byId('comonKey'), '');
    }

    $("#comonKey").bind("input propertychange",function(){
        validateValue();
    });
    
}

function initEvent(){
    
    api.addEventListener({
        name:'goldPriceRefreshSuccess'
    },function(ret,err){
        showGoldPrice();
    });
}

function showGoldPrice(){
    var goldPrice = $api.getStorage('goldPrice');
    if(goldPrice){
        $api.html($api.byId('title'), goldPrice.lastPrice+'元/克');
    }
}

function openGoldChart(){
	var params = { "page" : "../goldPriceLog", "title" : "金价走势"};
	global.openWinName("goldPriceLog", "./header", params);
}

function closeWin(){
	if(api.pageParam.closeToWin && api.pageParam.closeToWin === 1){
		api.closeToWin({
      		name:"root"
		});
	}else{
		api.closeWin();
	}
}


function doCustom(helpTitle){
    if (!global.isValidUser()) {        
        var params = {  "title" : "登录" };
        global.openWinName("loginWin", './html/member/login', params);
        return;
    }
    
    global.setHelpTitle(helpTitle)
    var params = { "page" : "../custom", "title" : "客服"};
    global.openWinName('customWin', '../../html/common/udesk_header', params);
}

// function search(){
//     global.openWinName('searchGoodsWin', '../../html/product/proSearch', '');
// }


/**
 * 显示/隐藏 删除搜索内容按钮
 */
function validateValue(){

    if (!validate.isEmpty($api.val($api.byId("comonKey")))){
        $api.removeCls($api.byId("searchClose"),'hide');
    }else{
        $api.addCls($api.byId("searchClose"),'hide');
    }
}


/**
 * 删除搜索内容
 */
function cleanInput(){
    $api.addCls($api.byId("searchClose"),'hide');
    $api.val($api.byId("comonKey"),'');
    if (api.systemType === 'ios'){
        document.getElementById("comonKey").focus();
    }else{
        setTimeout(function(){
            document.getElementById("comonKey").focus();
        }, 100);
    }
}


/**
 * 搜索
 * @param key
 */
function searchBegin(){

    searchCon = $api.val($api.byId("comonKey"));

    if(searchCon.match(/^\s+$/)){
        global.setToast('请输入关键字搜索');
        return;
    }

    if (validate.isEmpty(searchCon)){
        global.setToast('请输入搜索内容');
    }else{
        api.execScript({
            frameName: api.pageParam.page,
            script: 'showProlistData("' + searchCon + '");'
        });
    }

}