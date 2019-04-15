
var type = 1;
var noRecordsId='no-records';
var index_=1;

apiready = function(){
	type = api.pageParam.index;
	
/*	if(type === 2){
		$api.removeCls($api.byId('active1'), 'current');
		$api.addCls($api.byId('active2'), 'current');
		$api.addCls($api.byId('part-invitation'), 'hide');
		$api.removeCls($api.byId('part-reward'), 'hide');
	}*/
	
	initEvent();
    list(true);
	queryPartAchieve(type);
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        if(index_ ==1){
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
   
function list(flag) {
    var url = global.getRequestUri() + '/recommend/invitationMemberHistroy';
    var params = '?start=0&maxResults=10';

    page.init(10, 'personalHistory0', 'personalHistory0-template', url, params, true, 'no-records');

    if(flag){
        setTimeout("list2();", 2000);
    }

}

function list2() {
    var url = global.getRequestUri() + '/recommend-income/member';
    var params = '?start=0&maxResults=10';

    page.init(10, 'personalHistory1', 'personalHistory1-template', url, params, true, 'no-records');

}

function queryPartAchieve(index){
    index_ = index;

   // $api.addCls($api.byId(noRecordsId), 'hide');
    
    if (index === 1) {
        $api.addCls($api.byId('active0'), 'current');
        $api.removeCls($api.byId('active1'), 'current');

        $api.addCls($api.byId('personalHistory1'), 'hide');
        $api.removeCls($api.byId('personalHistory0'), 'hide');

    } else if (index === 2) {
         $api.addCls($api.byId('active1'), 'current');
         $api.removeCls($api.byId('active0'), 'current');

        $api.addCls($api.byId('personalHistory0'), 'hide');
        $api.removeCls($api.byId('personalHistory1'), 'hide');

    } 
}
