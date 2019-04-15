apiready = function(){
    initEvent();
	queryList();
}
    
function queryList() {
    var url = global.getRequestUri() + '/orgmember/getOrgMemberByPage';
    var params = '?start=0&maxResults=15';

    page.init(15, 'member-content', 'member-template', url, params, true, '');
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

function openMemberDetail(id){
    var url= h5UrlMemberDetail + "?memberId=" + id;
    global.openH5Win("openMemberDetail","../common/h5_common_header", url, '成员详情');
}