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
	
	$api.html($api.byId('title'), api.pageParam.title);
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

function initEvent(){

    api.addEventListener({
        name : 'loginRefresh'
    }, function(ret, err) {
        
        api.closeWin({
                name: 'loginWin'
            });

        api.closeWin({
            name : 'loginSubWin'
        });
            
        api.closeWin({name:'thirdLoginWin'});

    });

}