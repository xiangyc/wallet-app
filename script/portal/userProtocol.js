
function protocol(item) {
	var header = '../common/header';
	var params;
	
	switch(item) {
		case 1:
			params = { "page" : "../statics/regProtocol", "title" : "注册协议"};
			break;
		case 2:
			params = { "page" : "../statics/buyActiveProtocol", "title" : "随心金购买协议"};
			break;
		case 3:
			 params = { "page" : "../statics/buyPeriodProtocol", "title" : "安心金购买协议"};
		break;	
	}
	global.openWinName('protocolSubWin', header, params);
}