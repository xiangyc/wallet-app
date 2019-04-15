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
        name: 'redTradeLog',
        url: './redTradeLog.html',
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
		frameName: 'redTradeLog',
	    script: 'showCondition();'
    });
}

function closeWin(){
	if(closeToWin && closeToWin === 1){
		api.closeToWin({
      		name:"root"
		});
	}else{
		api.closeWin();
	}
}
