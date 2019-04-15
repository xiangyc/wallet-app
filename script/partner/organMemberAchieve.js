var noRecordsId='no-records';
var index_=0;
apiready = function(){
    initEvent();
    list(true);

}
    
function list() {
    var url = global.getRequestUri() + '/recommend-income/org';
    var params = '?start=0&maxResults=10';
    page.init(10, 'organMemberAchieve0-content', 'organMemberAchieve0-template', url, params, true, 'no-records');
   
    if(flag){
        setTimeout("list2();", 2000);
    }
}

function list2() {
    var url = global.getRequestUri() + '/recommend-income/org';
    var params = '?start=0&maxResults=10';

    page.init(10, 'organMemberAchieve1-content', 'organMemberAchieve1-template', url, params, true, 'no-records');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        if(index_ ==0){
            list(false);
        }else{
           list2();    
        }
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

function queryPartAchieve(type){
    index_ = index;

    $api.addCls($api.byId(noRecordsId), 'hide');

    $api.removeCls($api.byId('active0'), 'current');
    $api.removeCls($api.byId('active1'), 'current');
    
    if (index === 0) {
        $api.addCls($api.byId('active0'), 'current');

        $api.addCls($api.byId('organMemberAchieve1-content'), 'hide');
        $api.removeCls($api.byId('organMemberAchieve0-content'), 'hide');

    } else if (index === 1) {
        $api.addCls($api.byId('active1'), 'current');

        $api.addCls($api.byId('organMemberAchieve0-content'), 'hide');
        $api.removeCls($api.byId('organMemberAchieve1-content'), 'hide');

    } 
}
