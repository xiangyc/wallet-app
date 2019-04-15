apiready = function(){
    initEvent();
	queryList();
}
    
function queryList() {
    var url = global.getRequestUri() + '/recommend-income/org/ytd';

    var params = '?start=0&maxResults=10';
    page.init(10, 'award-content', 'award-template', url, params, true, 'no-records');
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

function detail(id){
    var winName = "organAchieveDetailWin";
    var params = { "page" : "../partner/personalAchieveDetail", "title" : "详情" ,"id" : id};
    global.openWinName(winName, "../common/header", params);
}