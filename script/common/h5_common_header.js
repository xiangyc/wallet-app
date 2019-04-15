var h;
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
    h = pos.h;

	$api.html($api.byId('title'), api.pageParam.title);
	
	var url = global.getH5url()+api.pageParam.url;

	if(api.pageParam.fullDomain === 1){
		url = api.pageParam.url;
	}
	
    api.openFrame({
        name: api.pageParam.name + 'Frame',
        url: url,
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: 'auto'
        },
        bounces: false,
        vScrollBarEnabled: false
    });

}

function closeWin(){
    api.closeWin();
}

function openSplitSelect(){
     var param = { title : "查询成员", page : "../partner/splitSearch"};
    global.openWinName("splitSearch","../common/header", param);
}

function login(){
    var params = {  "title" : "登录" };
     global.openWinName('h5Login', '../member/login', params);  
}

function openMemberDetail(id){
    var url= h5UrlMemberDetail + "?memberId=" + id;
    global.openH5Win("openMemberDetail","../common/h5_common_header", url, '成员详情');
}

function inviteFriends(index){//机构邀请
    api.openFrame({
        name: 'share',
        url: '../partner/personalInvite.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        pageParam : {
            index : index,
            type : 2
        },
        bounces: false,
        vScrollBarEnabled: false
    });
}
