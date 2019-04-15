var orgId;

apiready = function(){
	orgId = api.pageParam.orgId;
    initEvent();
	queryInvitation();
}
    
function queryInvitation() {
    var url = global.getRequestUri() + '/recommend-income/member/orgs';

    var params = '?start=0&maxResults=10&orgId=' + orgId;
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
        queryInvitation();
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

function showDetail(id, orgId){
	var param = { title : "推荐机构佣金明细", page : "../partner/organRewardDetails", id : id, orgId : orgId};
	global.openWinName("organDetail","../common/header", param);
}