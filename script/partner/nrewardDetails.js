var tradeType;
var id;
apiready = function(){
	tradeType = api.pageParam.tradeType;
	id = api.pageParam.id;
	
	if(tradeType === 1 || tradeType === 2 || tradeType === 5){
		tradeType = 5;
	}
	
	queryInvitation();
}
    
function queryInvitation() {
    var url = global.getRequestUri() + '/recommend-income/member/reward/detail?id=' + id;

    page.init(10, 'reward-content', 'reward' + tradeType + '-template', url, '', false, '');
}