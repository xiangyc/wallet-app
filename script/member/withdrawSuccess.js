var withdrawAmount,id;
var header = "../common/header";
apiready = function(){
    withdrawAmount = api.pageParam.withdrawAmount;
    id = api.pageParam.id;
    $api.html($api.byId('money'), global.formatNumber(withdrawAmount, 2));
}

function closeWin(){
	api.closeToWin({
		name:"root"
	});
}

function detail(){
	var params = { "page" : "../member/withdrawDetail", "title" : "提现详情","id":id };
	global.openWinName('withdrawDetailWin', header, params);
}