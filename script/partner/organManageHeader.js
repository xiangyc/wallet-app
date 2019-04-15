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
        name: 'organManageFrame',
         url: global.getH5url()+api.pageParam.url,
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
}
 
function removeMemberList(){
    var param = { title : "移除成员", page : "../partner/removeMember"};
    global.openWinName("removeMemberList","../common/header", param);
} 

function show(){
    if($api.hasCls($api.byId('organManage'), 'hide')){
         $api.removeCls($api.byId('organManage'), 'hide');
    }else{
         $api.addCls($api.byId('organManage'), 'hide');
    }
}
