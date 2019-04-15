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
        name: 'goldTradeLogFrame',
        url: api.pageParam.page + '.html',
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

function showCondition(){
	api.execScript({
		frameName: 'goldTradeLogFrame',
	    script: 'showCondition();'
    });
}

// apiready = function(){
//     var header = $api.byId('header');
//     if(header){
//         $api.fixIos7Bar(header);
//     }
//     var pos = $api.offset(header);
//     var $body = $api.dom('body');
//     //var body_h = api.winHeight;
//     var body_h = $api.offset($body).h;
//     var rect_h = body_h - pos.h;
//     var url = global.getH5url()+h5UrlGoldTradeLogList +'?type='+api.pageParam.type;
    
//     h = pos.h;
 
//     api.openFrame({
//         name: 'h5UrlGoldTradeLogListFrame',
//         url: url,
//         rect:{
//             x: 0,
//             y: pos.h,
//             w: 'auto',
//             h: 'auto'
//         },
//         reload: true,
//         bounces: false,
//         vScrollBarEnabled: false
//     });

// }