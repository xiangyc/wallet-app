apiready = function(){
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    
    api.openFrame({
        name: 'login',
        url: 'login.html',
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto'
        },
        bounces: false,
        pageParam: api.pageParam,
        vScrollBarEnabled: false
    });
}

function doRegister(){
	var header = '../common/header';
	var params = { "page" : "../member/register", "title" : "注册" };
	global.openWinName('registerWin', header, params);
}