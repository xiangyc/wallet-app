var lastPrice = 0;
apiready = function(){

    initEvent();

    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'goldAccount',
        url: './goldAccount.html',
		bounces : false,
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
        vScrollBarEnabled: false
    });

    api.addEventListener({
        name:'goldPriceRefreshSuccess'
    },function(ret,err){
        if(ret && ret.value){
            lastPrice = ret.value.value.lastPrice;
            //实时金价
            $api.html($api.byId('lastPrice'), global.formatNumber(lastPrice,2));
        }
    });

}

function doList(){
	var params = { "page" : "../member/goldTradeLogList", "title" : "黄金流水", "closeToWin" : 0  };
	global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}

function initEvent() {

    var goldPrice = $api.getStorage('goldPrice');
    if(goldPrice){
        lastPrice = goldPrice.lastPrice;
        //实时金价
        $api.html($api.byId('lastPrice'), global.formatNumber(lastPrice,2));
    } else{
        api.sendEvent({
            name:'goldPriceRefresh'
        });
    }
}