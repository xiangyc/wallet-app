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
        name: 'recordAdv',
        url: './recordAdv.html',
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

/*function doList(){
	global.openWinName('redTradeLogHeader', '../redpacket/redTradeLogHeader', '');
}*/


function marketingRebExplain(){
    var header = "../common/header";
    // var params = { "page" : "../helpList", "title" : "帮助中心"};
    // global.openWinName('recordAdvExplainWin', header, params);

    var params = { "page" : "../helpCategoryList", "title" : "黄金红包帮助中心", "id" : 15 };
    global.openWinName('helpCategorySubWin', header, params);

}