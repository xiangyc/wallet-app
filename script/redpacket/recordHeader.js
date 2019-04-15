var closeToWin = 0;
apiready = function(){
    closeToWin = api.pageParam.closeToWin;
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'record',
        url: './record.html',
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

function marketingReb(){
    var header = "../common/header";
    var params = { "page" : "../redpacket/recordAdv", "title" : "营销红包" };
    global.openWinName('marketingRebWinName', header, params);

}