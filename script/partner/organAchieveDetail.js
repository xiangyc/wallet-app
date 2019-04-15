var type = 1;
var memberId;
var year ='';
var month ='';
var srcType;//1=现有成员 2=历史成员 3=机构本身
var type = 1;//1 邀请  2 奖励
var inviteUrl = global.getRequestUri() + '/recommend/orgMemberInvitationMembers';
var rewardUrl = global.getRequestUri() + '/recommend-income/org/member';

apiready = function(){
    memberId = api.pageParam.memberId;
    year = api.pageParam.year;
    month = api.pageParam.month; 
    srcType = api.pageParam.type; 

	reloadInfo(true);

    initEvent();
}
    
function queryInvitation() {
    var params = '?start=0&maxResults=10&memberId='+memberId;
    page.init(10, 'invitation-content', 'invitation-template', inviteUrl, params, true, 'no-records');
}

function queryReward() {
    var params = '?start=0&maxResults=10&memberId='+memberId+'&year='+year+'&month='+month;
    page.init(10, 'reward-content', 'reward-template', rewardUrl, params, true, 'no-records');

}

function reloadInfo(flag){
    if(srcType ==1){
        inviteUrl = global.getRequestUri() + '/recommend/orgMemberInvitationMembers';
        rewardUrl = global.getRequestUri() + '/recommend-income/org/member';

        //queryInvitation();
    }else if(srcType ==2){        
        inviteUrl = global.getRequestUri() + '/recommend/orgMemberInvitationMemberHistroy';
        rewardUrl = global.getRequestUri() + '/recommend-income/org/member/exit';

        //queryInvitation();
    }else if(srcType ==3){
         rewardUrl = global.getRequestUri() + '/recommend-income/org/member/exit';
         //queryReward() 
    }
    
    queryPartAchieve(1);
}


function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
       reloadInfo(false);
        
       api.refreshHeaderLoadDone();
    });

    api.addEventListener({
        name : 'scrolltobottom',
        extra : {
            threshold : 0
        }
    }, function(ret, err) {
        page.scrollRefresh();
    });
}

function queryPartAchieve(index){
    if(index){
        type = index;
    }      

    if(srcType ==3){
        $api.addCls($api.byId('activeUlId'), 'hide');

        $api.addCls($api.byId('part-invitation'), 'hide');
        $api.removeCls($api.byId('part-reward'), 'hide');
        queryReward();     
    }else{
        $api.removeCls($api.byId('activeUlId'), 'hide');

        if (index === 2) {
            $api.addCls($api.byId('active2'), 'current');
            $api.removeCls($api.byId('active1'), 'current');

            $api.addCls($api.byId('part-invitation'), 'hide');
            $api.removeCls($api.byId('part-reward'), 'hide');
            queryReward();
        } else {
            $api.addCls($api.byId('active1'), 'current');
            $api.removeCls($api.byId('active2'), 'current');

            $api.addCls($api.byId('part-reward'), 'hide');
            $api.removeCls($api.byId('part-invitation'), 'hide');
            queryInvitation();
        } 
    }
}

function detail(id){
    var winName = "organAchieveDetailWin";
    var params = { "page" : "../partner/personalAchieveDetail", "title" : "详情" ,"id":id};
    global.openWinName(winName, "../common/header", params);

}