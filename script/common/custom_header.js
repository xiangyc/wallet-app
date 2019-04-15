var title;
apiready = function(){
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    //var body_h = api.winHeight;
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

	title = api.pageParam.title;

	$api.html($api.byId('title'), title);
    api.openFrame({
        name: api.pageParam.page,
        url: api.pageParam.page + '.html',
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

    initEvent();
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

function doCustom(){
    if (!global.isValidUser()) {        
        var params = {  "title" : "登录" };
        global.openWinName("loginWin", '../member/login', params);
        return;
    }
    global.setHelpTitle(title);

    var params = { "page" : "../custom", "title" : "客服" };
    global.openWinName('customWin', '../common/udesk_header', params);

} 

function initEvent(){
    api.addEventListener({
        name:'userBindCardRefresh'
    },function(ret,err){

       api.closeWin({
            name: 'loginWin'
        });

        api.closeWin({
                name: 'loginSubWin'
        });

        api.closeWin({
            name : 'registerSuccessForwardH5Win'
        });

        setTimeout(function(){
            api.closeWin({
                name : 'bindCardWin'
            });
        }, 1500);

    });

}

