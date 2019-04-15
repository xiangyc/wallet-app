var orderType = 0;
var period = 4;
var maxResults = 20;
var url = global.getRequestUri() + '/investment-orders';
var header = "../common/header";

apiready = function(){
    receiveList();
    initEvent();
}

function initEvent(){
    api.addEventListener({
        name : 'scrolltobottom',
        extra : {
            threshold : 0
        }
    }, function(ret, err) {
        page.scrollRefresh();
    });
}

function switchDiv(id){
    if(id === 1){
        $api.addCls($api.byId('receiveLi'), 'active');
        $api.removeCls($api.byId('receiveDiv'), 'hide');

        $api.removeCls($api.byId('sendLi'), 'active');
        $api.addCls($api.byId('sendDiv'), 'hide');
        receiveList();
    }else{
        $api.addCls($api.byId('sendLi'), 'active');
        $api.removeCls($api.byId('sendDiv'), 'hide');

        $api.removeCls($api.byId('receiveLi'), 'active');
        $api.addCls($api.byId('receiveDiv'), 'hide');
        sendList();
    }
}

function receiveList(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/statisticsReceivedGoldEnvelope',
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.receiveAmount){
               $api.html($api.byId('totalReceived'), ret.receiveAmount);
            }
            if(ret.receiveCount){
                $api.html($api.byId('totalReceivedNum'), ret.receiveCount);
            }
            if(ret.receiveLuckCount){
                $api.html($api.byId('rebOptimum'), ret.receiveLuckCount);
            }
            if(ret.refundedAmount){
                $api.removeCls($api.byId('PReturn'), 'hide');
                $api.html($api.byId('totalReturn'), ret.refundedAmount);
            }
        }
    });

    var url = global.getRequestGEUri() + '/goldenvelope/qryReceivedGeItemByPage';
    var params = '?start=0&maxResults=' + maxResults
    page.init(maxResults, 'received-content', 'received-template', url, params, true, 'no-records');
}

function sendList(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/statisticsSentGeItem',
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        //alert(JSON.stringify(ret));
        if(ret){
            if(ret.sentAmount) {
                $api.html($api.byId('totalIssue'), ret.sentAmount);
            }
            if(ret.sentCount) {
                $api.html($api.byId('totalIssueNum'), ret.sentCount);
            }
        }
    });

    var url = global.getRequestGEUri() + '/goldenvelope/qrySentGoldEnvelopeItemByPage';
    var params = '?start=0&maxResults=' + maxResults
    page.init(maxResults, 'send-content', 'send-template', url, params, true, 'no-records');
}

function openDetail(id, type, amount){
    var header = "../common/header";
    var params = { "page" : "../redpacket/redList", "title" : "黄金红包详情", "securityCode" : id, "type" : type, "amount" : amount };
    global.openWinName('redListSubWin', header, params);
}

function openSubWin(type){
    var header = "../common/header";
    var params = {};

    if(type === 1 || type === 4 || type === 5){
        //实名
        if(!global.getUserIdCard()){
            params = { "page" : "../member/bindNewBankCard", "title" : "实名认证", "auth" : 1  };
            header = "../common/custom_header";
            return global.validIdCardTooltip("goldWin", header, params);
        }
        //绑卡
        if(global.getUserBindCard() === '0'){
            params = { "page" : "../member/bindNewBankCard", "title" : "绑定银行卡" };
            header = "../common/custom_header";
            return global.validBindCardTooltip("goldWin", header, params);
        }
        //交易密码
        if(global.getUserPayPassword() === '0'){
            params = { "page" : "../member/payPasswordSet", "title" : "设置交易密码" };
            return global.validPayPasswordTooltip("goldWin", header, params);
        }
    }
	
	var winName = "goldRedAccountSubWin";
    switch(type) {
        case 1:
        	winName = "redpacketSendWin";
            header = "../redpacket/prepareHeader";
            params = "";
            break;
        case 4:
            params = { "page" : "../member/goldSell", "title" : "卖红包金", "src" : 2 };
            break;
        case 5:
            params = { "page" : "../redpacket/buy", "title" : "买红包金" };
            break;
    }
    global.openWinName(winName, header, params);
}
function carryGold(){
    var header = "../common/header";
    params = { "page" : "../member/goldExtraction", "title" : "提红包金", "src" : 3 };
    global.openWinName('goldRedAccountSubWin', header, params);
}