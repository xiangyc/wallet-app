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
        name: 'goldExtraction',
        url: 'goldExtraction.html',
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
	var params = { "page" : "../member/goldExtractionList", "title" : "提金记录" };
	global.openWinName("goldExtractionListWin", '../common/header', params);
}