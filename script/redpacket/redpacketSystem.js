var header = "../common/header";
var token = "";
var securityCode;
var envelopeType;
var memberName = "";
var name = "";
var remark = "财源滚滚，日进斗金";
var logoImg;

apiready = function(){
    envelopeType = api.pageParam.envelopeType;
    securityCode = api.pageParam.securityCode;

    initEvent();

    queryRedPacketDetail();
}


function initEvent(){
    api.addEventListener({
        name: 'opendRedPacket'
    }, function(ret, err) {
        closeRedpacket();
    });
}

function queryRedPacketDetail(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/getDetailBySecurityCode?securityCode=' + securityCode,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.remark){
                remark = ret.remark;
            }
            if(ret.memberName){
                memberName = ret.memberName;
            }
            $api.html($api.byId('remark1'), remark);
            $api.html($api.byId('nameDiv'), ret.memberName);
            $api.attr($api.byId('logoImg'), 'src', global.getImgUri() + ret.avatarUrl);

            memberName = ret.memberName;
            logoImg = global.getImgUri() + ret.avatarUrl;
        }
        
    });
}

function getRedPacketToken(){
    $api.addCls($api.byId('redPacketBtn'), 'rotate');
    redRobBtn();
}


function closeRedpacket(){
    api.closeFrame();
}

function redRobBtn(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/seckilling?securityCode=' + securityCode,
        method : 'post',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        var params = { "page" : "../redpacket/redpacketOpen", "title" : "黄金红包", "code" : ret.code, "success": ret.success, "token" : ret.data, "securityCode" : securityCode,
        "memberName" : memberName, "remark" : remark, "logoImg" : logoImg };
        global.openWinName('redpacketSubWin', header, params);
    });
}