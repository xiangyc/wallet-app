var closeToWin = 0;
var optSrc;//卖金来源
apiready = function(){
    closeToWin = api.pageParam.closeToWin;
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }

    optSrc = api.pageParam.optSrc;

    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'orderList',
        url: 'orderList.html',
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

    if(optSrc && optSrc == 'sellActiveGold'){
        $api.removeCls($api.byId('buyLi'), 'active');
        $api.removeCls($api.byId('extractLi'), 'active');
        $api.addCls($api.byId('sellLi'), 'active');
      
    }else if(optSrc && optSrc == 'withdrawGold'){
        $api.removeCls($api.byId('buyLi'), 'active');
        $api.removeCls($api.byId('sellLi'), 'active');
        $api.addCls($api.byId('extractLi'), 'active');
    }
}

function selectOrderType(id, el){
    orderType = id;

    var lis = $api.domAll($api.byId('ordertabTypeUl'), 'li');
    for(var i = 0; i < lis.length; i++){
        $api.removeCls(lis[i], 'active');
    }
    $api.addCls(el, 'active');

    api.execScript({
        frameName: 'orderList',
        script: 'queryOrder(' + id + ');'
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
