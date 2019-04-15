apiready = function(){
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'suiAccount',
        url: './suiAccount.html',
		bounces : false,
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto'
        },
        pageParam : api.pageParam,
        bounces: false,
        vScrollBarEnabled: false
    });
}

function doList(){
	var params = { "page" : "../member/goldTradeLogList", "title" : "交易流水", "closeToWin" : 0, "type" : 2 };
	global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}