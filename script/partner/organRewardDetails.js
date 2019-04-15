var id;
var orgId;

apiready = function(){
	id = api.pageParam.id;
	orgId = api.pageParam.orgId;
	queryInvitation();
}
    
function queryInvitation() {
    var url = global.getRequestUri() + '/recommend-income/member/org/detail';

    var params = '?start=0&maxResults=10&id=' + id + '&orgId=' + orgId;
    page.init(10, 'reward-content', 'reward-template', url, params, false, '');
}