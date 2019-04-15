var mobile;
var orgId;
var type;
var maxRate;

apiready = function(){
    api.showProgress({
        title: '加载中...',
        modal: false
    });

    type = api.pageParam.type;
    api.ajax({
        url : global.getRequestUri() + '/orgmember/getOrgMember',
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            if(ret.org && ret.org.id){
                orgId = ret.org.id;
            }
        }
        
        showShare();
    });

    getMaxRate();
    initEvent();
}

function initEvent(){
    api.addEventListener({
        name : 'closeShareImage'
    }, function(ret, err) {
        closeShare();
    });
}

/*二维码分享*/
function codeshare(){
    $api.removeCls($api.byId('shareDiv'), 'hide');
    $api.removeCls($api.byId('buybackdrop'), 'hide');
}

function closeShare(){
    $api.addCls($api.byId('shareDiv'), 'hide');
    $api.addCls($api.byId('buybackdrop'), 'hide');
}

function showShare(){
    if(api.pageParam.index === 1){
        $api.addCls($api.byId('codeDiv'), 'hide');
        $api.addCls($api.byId('orgCodeDiv'), 'hide');
        $api.removeCls($api.byId('shareDiv'), 'hide');
        $api.removeCls($api.byId('buybackdrop'), 'hide');
    }else{
        if(orgId && type !== 1){
            $api.removeCls($api.byId('orgCodeDiv'), 'hide');
            $api.addCls($api.byId('shareDiv'), 'hide');
            $api.addCls($api.byId('buybackdrop'), 'hide');
            $api.addCls($api.byId('codeDiv'), 'hide');
        } else {
            $api.removeCls($api.byId('codeDiv'), 'hide');
            $api.addCls($api.byId('shareDiv'), 'hide');
            $api.addCls($api.byId('buybackdrop'), 'hide');
            $api.addCls($api.byId('orgCodeDiv'), 'hide');
        }
        
        $api.addCls($api.byId('qfriendLi'), 'hide');
        $api.addCls($api.byId('qzoneLi'), 'hide');
        $api.addCls($api.byId('shareUl'), 'two');
        generateQRcode();
    }
}

function generateQRcode(){
    var params = 'platType=code&memberId=' + global.getMemberId() + '&mobile=' + global.getUserMobile() + '&securityName=' + new Base64().encode(global.getUserName());
    var shareUrl = global.getShareUri() + '/register.html?' + params;

    mobile = global.getUserMobile();

    if(orgId && type !== 1){
        $api.html($api.byId('orgMobile'), mobile);

        params = params + '&orgId=' + orgId;
        $api.html($api.byId('titleH'), '邀请好友加入机构、一起获奖励');
        shareUrl = global.getH5url() + '/html/partner/invitationOrgan.html?' + params;

        $('#qrOrgCodeDiv').qrcode({
            width : 200,
            height : 200,
            correctLevel : 0,
            text : shareUrl
        });
    } else {
        $api.html($api.byId('mobile'), mobile);

        $('#qrcodeDiv').qrcode({
            width : 200,
            height : 200,
            correctLevel : 0,
            text : shareUrl
        });
    }
    
}

function shareQzone(shareType) {
    var params = 'platType=' + shareType + '&memberId=' + global.getMemberId() + '&mobile=' + global.getUserMobile() + '&securityName=' + new Base64().encode(global.getUserName());

    var shareUrl = global.getShareUri() + '/register.html?' + params;
    var title = "金算子，会赚钱的黄金零钱包！";
    var description = "购金即享"+maxRate+"%年化赠金！";
    var imgUrl = 'widget://image/activity-invite01.jpg';
    if(shareType === 'qzone'){
        imgUrl = 'https://www.jsz.top/images/activity-invite01.jpg'
    }

    if(orgId && type !== 1){
        title = "加入机构，升级更快，邀请好友购金获得更多奖励";
        description = "升级更快，收益更多，年化3%邀请奖励等你拿！";
        params = params + '&orgId=' + orgId;
        shareUrl = global.getH5url() + '/html/partner/invitationOrgan.html?' + params;
        imgUrl = global.getShareUri() + '/images/org_add.jpg';
        //imgUrl = 'widget://image/org_add.jpg';
    }

    var qq = api.require('qq');
    qq.installed(function(ret, err) {
        if (ret.status) {
            qq.shareNews({
                url : shareUrl,
                title : title,
                description : description,
                imgUrl : imgUrl,
                type : shareType
            },function(ret, err) {
                if (ret.status) {
                    api.ajax({
                        method : 'put',
                        cache : false,
                        dataType : 'json',
                        returnAll : false,
                        url : global.getRequestUri() + '/members/update/shareStatistics',
                        headers : global.getRequestToken(),
                        data : {
                            values : {
                                'platType' : shareType
                            }
                        }
                    }, function(ret, err) {
                    });
                } else {
                    global.setToast('分享失败');
                }
            });
        } else {
            global.setToast('当前设备未安装QQ客户端');
        }
    });
}

function shareWx(shareType) {
    if(api.pageParam.index !== 1){
        if(orgId && type !== 1){
            //机构
            getPartnerImagePath(1,shareType);
        } else {
            //个人
            getPartnerImagePath(0,shareType);
        }
        return;
    }

    var params = 'platType=' + shareType + '&memberId=' + global.getMemberId() + '&mobile=' + global.getUserMobile() + '&securityName=' + new Base64().encode(global.getUserName());
    var shareUrl = global.getShareUri() + '/register.html?' + params;
    var title = "金算子，会赚钱的黄金零钱包！";
    var description = "购金即享"+maxRate+"%年化赠金！";
    var thumb = 'widget://image/activity-invite01.jpg';

    if(orgId && type !== 1){
        title = "加入机构，升级更快，邀请好友购金获得更多奖励";
        description = "升级更快，收益更多，年化3%邀请奖励等你拿！";
        params = params + '&orgId=' + orgId;
        shareUrl = global.getH5url() + '/html/partner/invitationOrgan.html?' + params;
        thumb = 'widget://image/org_add.jpg';
    }

    var wx = api.require('wx');
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
            wx.shareWebpage({
                scene : shareType,
                title : title,
                description : description,
                thumb : thumb,
                contentUrl : shareUrl
            }, function(ret, err) {
                if (ret.status) {
                    api.ajax({
                        method : 'put',
                        cache : false,
                        dataType : 'json',
                        returnAll : false,
                        url : global.getRequestUri() + '/members/update/shareStatistics',
                        headers : global.getRequestToken(),
                        data : {
                            values : {
                                'platType' : shareType
                            }
                        }
                    }, function(ret, err) {
                    });
                } else {
                    global.setToast('分享失败');
                }
            });
        } else {
            global.setToast('当前设备未安装微信客户端');
        }
    });
}

function getMaxRate() {
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-products/max-rate',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if (ret && ret.obj) {
            maxRate = ret.obj;
        } else {
            global.setErrorToast();
        }
    });
}