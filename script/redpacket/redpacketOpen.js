var amount = 0;
var moneyValue = 0;
var token = '';
var securityCode = '';
var status = 0;

apiready = function() {
    for (var i = 1; i <= 4; i++) {
        $api.html($api.byId('nameDiv' +　i), api.pageParam.memberName);
        $api.attr($api.byId('logoImg' +　i), 'src', api.pageParam.logoImg);
    }
    $api.html($api.byId('remark1'), api.pageParam.remark);
    securityCode = api.pageParam.securityCode;

    if(api.pageParam.success){
        token = api.pageParam.token;
        $api.removeCls($api.byId('redPacket02'), 'hide');
    }else{
        showStatusTip(api.pageParam.code);
    }

    initEvent();
}
    
function initEvent(){
    api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {
        api.sendEvent({
            name:'opendRedPacket'
        });
    });
}

function showStatusTip(code){
    switch(code){
        case 3001:
            $api.removeCls($api.byId('redPacket02'), 'hide');
            break;
        case 3002:
            getGEInfo();
            $api.removeCls($api.byId('successDiv'), 'hide');
            break;
        case 3005:
            search_3005();
            break;
        case 3003:
            search_3003();
            break;
        case 500:
            $api.removeCls($api.byId('errorDiv'), 'hide');
            break;
        default:
            $api.removeCls($api.byId('errorDiv'), 'hide');
            break;
    }
}

function search_3005(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/getGoldEnvelopeItemByUserIdSecurityCode?securityCode=' + securityCode,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            getGEInfo();
            $api.removeCls($api.byId('successDiv'), 'hide');
        }else{
            $api.removeCls($api.byId('failDiv'), 'hide');
        }
    });
}

function search_3003(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/getGoldEnvelopeItemByUserIdSecurityCode?securityCode=' + securityCode,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            getGEInfo();
            $api.removeCls($api.byId('successDiv'), 'hide');
        }else{
            $api.removeCls($api.byId('endDiv'), 'hide');
        }
    });
}

function getGEInfo() {
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/getGoldEnvelopeItemByUserIdSecurityCode?securityCode=' + securityCode,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            var goldPrice = $api.getStorage("goldPrice");
            var status = ret.status;
            amount = ret.amount;
            moneyValue = calculate.mul(calculate.div(amount,1000),goldPrice.lastPrice);
            $api.html($api.byId('amountSpan'), amount);
            $api.html($api.byId('priceEm'), global.formatNumber(moneyValue));
//          if(status == 2){
//              $api.removeCls($api.byId('amountPlace'),'hide');
//          }else{
//              $api.removeCls($api.byId('errorInfo'),'hide');
//          }
        }
    });
}

function record(){
    var header = "../common/header";
    var params = { "page" : "../redpacket/record", "title" : "我的黄金红包" };
    global.openWinName('recordSubWin', header, params);
}

function gain(){
    $api.addCls($api.byId('redPacketBtn02'), 'rotate');
    redRobstartPlay();
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/open?securityCode=' + securityCode + '&token=' + token,
        method : 'post',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        $api.removeCls($api.byId('redPacketBtn02'), 'rotate');
        $api.addCls($api.byId('redPacket02'), 'hide');
        if(ret.success){
            getGEInfo();
            $api.removeCls($api.byId('successDiv'), 'hide');
            var goldPrice = $api.getStorage("goldPrice");
            amount = ret.data;

            moneyValue = calculate.mul(calculate.div(ret.data,1000),goldPrice.lastPrice);
            $api.html($api.byId('amountSpan'), ret.data);
            $api.html($api.byId('priceEm'), global.formatNumber(moneyValue));
        }else{
            showStatusTip(ret.code);
        }
    });
}


function redRobstartPlay(){
    api.startPlay({
        path: 'widget://res/open_envelop.mp3'
    }, function(ret, err) {
    });
}

function share(){
    $api.removeCls($api.byId('shareDiv'), 'hide');
    $api.removeCls($api.byId('backdrop'), 'hide');
}

function closeShare(){
    $api.addCls($api.byId('shareDiv'), 'hide');
    $api.addCls($api.byId('backdrop'), 'hide');
}

function shareWx(shareType) {
    var params = 'platType=' + shareType + "&avatar=" + global.getAvatar() + '&nickName=' + (global.getNickName() ? global.getNickName() : global.getUserMobile()) + '&amount=' +
     amount + '&moneyValue=' + global.formatNumber(moneyValue) + '&recommendCode=' + global.getInviterCode() + '&memberId=' + global.getMemberId() + '&mobile=' + global.getUserMobile();

    closeShare();
    var wx = api.require('wx');
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
            wx.shareWebpage({
                scene : shareType,
                title : '我获得了一个黄金红包！',
                description : '人生若只如初见，黄金红包可提现！',
                thumb : 'widget://image/sendreb-img.jpg',
                contentUrl : global.getH5url() + '/html/redpacket/redpacketShare.html?' + params
            }, function(ret, err) {
                if (!ret.status) {
                    global.setToast('分享失败');
                }else{
                    global.setToast('分享成功');
                }
            });
        } else {
            global.setToast('当前设备未安装微信客户端');
        }
    });
}
