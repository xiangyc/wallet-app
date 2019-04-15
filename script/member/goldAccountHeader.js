apiready = function(){
    var header = $api.byId('header');

	$api.fixStatusBar(header);

    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'goldAccount',
        url: 'goldAccount.html',
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
}

function doList(){
	var params = { "page" : "../member/goldTradeLogList", "title" : "黄金流水", "closeToWin" : 0  };
	global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}