apiready = function(){
    initEvent();
	queryInvitation();
}
    
function queryInvitation() {
    var url = global.getRequestUri() + '/recommend-income/member/org/statistics';

    var params = '?start=0&maxResults=10';
    page.init(10, 'organ-content', 'organ-template', url, params, true, 'no-records');
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

function showDetail(orgId){
	var param = { title : "推荐机构佣金", page : "../partner/organRewardList", orgId : orgId};
	global.openWinName("organRewardList","../common/header", param);
}