var url = global.getRequestUri() + '/org/getOrgMemberSplitAccountDetailByPage';
var memberId;
var status;
apiready = function(){
	memberId = api.pageParam.memberId;
	status = api.pageParam.status;
    initEvent();
	queryList();
}
    
function queryList() {
    var params = '?start=0&maxResults=10&memberId=' + memberId + '&status=' + status;
    page.init(10, 'detail-content', 'detail-template', url, params, true, 'no-records');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        queryList();
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