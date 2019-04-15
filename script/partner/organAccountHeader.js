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
        name: 'mainAccountFrame',
      //  url: './organAccount.html',
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
	var param = { title : "账户明细", page : "../partner/accountDetails"};
	global.openWinName("accountDetails","../partner/accountDetailsHeader", param);
}

//********************* 机构账户页面 **********************/

function openManage(){
    var url= h5UrlOrganManage;
    global.openH5Win("organManageFrame","../common/h5_common_header", url, '机构管理');
}

function openBussion(){//机构业绩
    var param = { title : "现有成员", page : "../partner/organAchieve", type:1};
    global.openWinName("organAchieve","../partner/organAchieveHeader", param);
}

function openSplit(){
    var param = { title : "分账", page : "../partner/splitDetails"};
    global.openWinName("splitDetails","../common/header", param);
}

function inviteFriends(){//邀请好友
    api.openFrame({
        name: 'share',
        url: '../partner/invite.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
        },
        pageParam : {
            index : 2
        },
        bounces: false,
        vScrollBarEnabled: false
    });
}

function checkMember(){
    var url= h5UrlCheckMember;
    global.openH5Win("checkMember","../common/h5_common_header", url, '审核成员');
}   

function organMemberList(){
    var param = { title : "成员列表", page : "../partner/organMemberList"};
    global.openWinName("organMemberList","../common/header", param);
}   

function openYesterdayAward(){
    var param = { title : "昨日佣金", page : "../partner/yesterdayAward"};
    global.openWinName("openYesterdayAward","../common/header", param);

}

function openOrganAchieve(type,orgId){
    if(type==1){
        var param = { title : "累计邀请", page : "../partner/organTotalDetail" , type:type, orgId:orgId};
        global.openWinName("organTotalDetail","../common/header", param);
    }else{
        var param = { title : "累计佣金", page : "../partner/organTotalDetail", type:type, orgId:orgId};
        global.openWinName("organTotalDetail","../common/header", param);
    }
}

function removeMember(){
     var param = { title : "移除成员", page : "../partner/removeMember"};
    global.openWinName("removeMember","../common/header", param);
}

function openOrganDetail(orgId){
    var url= h5UrlOrganDetail+"?orgId="+orgId;
    global.openH5Win("openOrganDetail","../common/h5_common_header", url, '机构详情');
}

function login(){
    var params = {  "title" : "登录" };
     global.openWinName('h5Login', '../member/login', params);  
}