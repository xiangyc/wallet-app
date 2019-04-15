var start = 0;
var maxResults = 3;
var code = '2439adc3ccab4b8bbab0c7a8ebb82529';
var securityCode = '';
var pickCount = 0;
var type = 1;

apiready = function(){
    securityCode = api.pageParam.id;
    type = api.pageParam.type;

    if(type === 2){
        $api.removeCls($api.byId('sendoutRedbt'), 'hide');
    }
    receiveListDetails();
    reddetailsList();
}

function receiveListDetails(){
    api.ajax({
        url : global.getRequestGEUri() + '/goldenvelope/getDetailBySecurityCode?securityCode='+securityCode,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            var goldPrice = $api.getStorage("goldPrice");
            $api.html($api.byId('recordText'), (ret.geType === 1 ? "拼" : "普" ));
            $api.html($api.byId('receiveName'), ret.securityMemberName);
            $api.html($api.byId('receiveText'), ret.remark);
            $api.html($api.byId('amountSpan'), ret.amount);
            $api.html($api.byId('priceEm'), global.formatCurrency(calculate.mul(calculate.div(ret.amount, 1000),goldPrice.lastPrice)));
        }
    });
}

function reddetailsList(){
    api.ajax({
        url : global.getRequestUri() + '/envelope/datail?code='+securityCode+'&start=0&maxResults=10',
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret && ret.items.length > 0){
            var template1 = $api.byId('detail-template').text;
            var tempFun1 = doT.template(template1);
            pickCount = ret.recordCount;
            $api.html($api.byId('pickCount'), pickCount);
            $api.html($api.byId('redCount'), ret.items[0].quantity);
            $api.html($api.byId('detail-content'), tempFun1(ret.items));
        }
    });
}

/*分享*/
function share(){
    $api.removeCls($api.byId('shareDiv'), 'hide');
    $api.removeCls($api.byId('backdrop'), 'hide');
}

function closeShare(){
    $api.addCls($api.byId('shareDiv'), 'hide');
    $api.addCls($api.byId('backdrop'), 'hide');
}

function shareWx(shareType) {
    var params = 'platType=' + shareType + "&memberId=" + global.getMemberId() + '&mobile=' + global.getUserMobile();;
    var wx = api.require('wx');
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
            wx.shareWebpage({
                scene : shareType,
                title : '亲，我发了一个黄金红包，快来抢哦！',
                description : $api.html($api.byId('receiveText')),
                thumb : 'widget://image/sendreb-img.jpg',
                contentUrl : global.getShareUri() + '/register.html?' + params
            }, function(ret, err) {
                if (!ret.status) {
                    global.setToast('分享失败');
                }
            });
        } else {
            global.setToast('当前设备未安装微信客户端');
        }
    });
}