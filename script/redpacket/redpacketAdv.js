var remark = '';
var amount,quantity,remark,securityCode,totalSendMoney,subsidy,endTime;
var shareMode = 1;//1：图片，2：地址

apiready = function() {
	amount = api.pageParam.amount;
    quantity = api.pageParam.quantity;
    remark = api.pageParam.remark;
    totalSendMoney = api.pageParam.totalSendMoney;
    subsidy = api.pageParam.subsidy;
    endTime = api.pageParam.endTime;

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

    initEvent();
}


function initEvent(){
    api.addEventListener({
        name : 'closeShareImage'
    }, function(ret, err) {
        closeShare();
    });
}


function initData(){
    $api.html($api.byId('totalAmount'), amount);
    $api.html($api.byId('totalMoney'), global.formatNumber(totalSendMoney,2));
    if(remark){
        $api.html($api.byId('remark'), remark);
    }
    $api.html($api.byId('subsidy'), subsidy);
    $api.html($api.byId('endTime'), global.formatDate(endTime, 'yyyy-MM-dd hh:mm'));
}


/*二维码分享*/
function codeshare(){
    shareMode = 1;
    $api.removeCls($api.byId('shareDiv'), 'hide');
    $api.removeCls($api.byId('backdrop'), 'hide');
}

// function redcodeClose(){
//     $api.addCls($api.byId('redcodeDiv'), 'hide');
//     $api.addCls($api.byId('redcodeBox'), 'hide');
// }


/*文字分享*/
function share(){
    shareMode = 2;
    $api.removeCls($api.byId('shareDiv'), 'hide');
    $api.removeCls($api.byId('backdrop'), 'hide');
}

function closeShare(){
    $api.addCls($api.byId('shareDiv'), 'hide');
    $api.addCls($api.byId('backdrop'), 'hide');
}


function shareWx(shareType) {
    //closeShare();

    var wx = api.require('wx');
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
            if(shareMode === 1){
                getImagePath(securityCode, shareType);
            }else{
                closeShare();
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
            }
        } else {
            global.setToast('当前设备未安装微信客户端');
        }
    });
}
