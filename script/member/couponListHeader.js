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
        name: 'couponList',
        url: 'couponList.html',
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

function showdesprition(){
	api.execScript({
		frameName: 'couponList',
	    script: 'showdesprition();'
    });
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
