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
        name: 'mainPartnerFrame',
        url: './main.html',
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: rect_h
        },
        pageParam : api.pageParam,
        bounces: false,
        vScrollBarEnabled: false
    });
}

function doList(){
	var param = { title : "历史业绩", page : "../partner/personalHistory"};
	global.openWinName("personalHistory","../common/header", param);
}