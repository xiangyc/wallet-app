var remark = '';
var amount,quantity,remark,securityCode,lastPrice;
apiready = function() {
	amount = api.pageParam.amount;
    quantity = api.pageParam.quantity;
    remark = api.pageParam.remark;
    lastPrice = api.pageParam.lastPrice;
    if(!remark){
        remark = "财源滚滚，日进斗金";
    }
    securityCode = api.pageParam.securityCode;
    
  $('#qrcodeDiv').qrcode({
      width : 140,
      height : 140,
      correctLevel : 0,
      text : global.getH5url() + '/html/redpacket/index.html?securityCode=' + securityCode
  });

    initData();
}

function initData(){
    $api.html($api.byId('amount'), amount);
    if(remark){
        $api.html($api.byId('remark'), remark);
    }

    $api.html($api.byId('money'), global.formatNumber(calculate.div(calculate.mul(amount,lastPrice),1000),2));
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
    closeShare();
    var wx = api.require('wx');
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
            wx.shareWebpage({
                scene : shareType,
                title : '亲，我发了一个黄金红包，快来抢哦！',
                description : remark,
                thumb : 'widget://image/sendreb-img.jpg',
                contentUrl : global.getH5url() + '/html/redpacket/index.html?securityCode=' + securityCode
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
