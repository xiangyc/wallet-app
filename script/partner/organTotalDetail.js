var type = 1;
var orgId;
var flag = true;

apiready = function(){
    type = api.pageParam.type;
    orgId = api.pageParam.orgId;

    initEvent();
	queryPartAchieve(type); 
}
    
function queryInvitation() {
    var url = global.getRequestUri() + '/recommend/orgInvitationMembers';

    var params = '?start=0&maxResults=10&orgId='+orgId;
    page.init(10, 'invitation-content', 'invitation-template', url, params, true, 'no-records');
}

function queryReward() {
    var url = global.getRequestUri() + '/recommend-income/org';
    var params = '?start=0&maxResults=10';

    page.init(10, 'reward-content', 'reward-template', url, params, true, 'no-records');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
		queryPartAchieve(type);
        
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
    
    api.addEventListener({
        name : 'pageCallSuccessEvent'
    }, function(ret, err) {
        flag = true;
    });
        
}

function queryPartAchieve(index){
	if(flag){
		flag = false;
		type = index;
	    if (type === 2) {
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
    var params = { "page" : "../partner/personalAchieveDetail", "title" : "详情" ,"id" : id};
    global.openWinName(winName, "../common/header", params);
}