var type = 1;
apiready = function(){
    type = api.pageParam.index;

    initEvent();
	queryPartAchieve(type);
}
    
function queryInvitation() {
    var url = global.getRequestUri() + '/recommend/orgInvitationMembers';

    var params = '?start=0&maxResults=10';
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
}

function queryPartAchieve(index){
    type = index;
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