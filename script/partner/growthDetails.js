
var orgId;
apiready = function(){
    orgId = api.pageParam.orgId;
    initEvent();
    list();

}
    
function list() {
    var url = global.getRequestUri() + '/experienceLog/member';
    var params = '?start=0&maxResults=10';
    
    if(orgId){
        url = global.getRequestUri() + '/experienceLog/org';

        params = params +'&orgId='+orgId;
    }   
    
    page.init(10, 'growthDetails-content', 'growthDetails-template', url, params, true, 'no-records');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        list();
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
