var start = 0;
var maxResults = 30;
var code = '';
var securityCode = '';
var type = 1;
var amount = 0;
var geStatus = 0;
var remark = '';
var totalMoney = 0;
var senderTypeOwer  = '';
var useageOwer = '';
var shareMode = 1;//1：图片，2：地址
var themeCode = '';
var pickCount = 0;

apiready = function(){
    securityCode = api.pageParam.securityCode;
    type = api.pageParam.type;
    totalMoney = api.pageParam.totalMoney;
    amount = api.pageParam.amount;
    if(!remark){
        remark = "财源滚滚，日进斗金";
    }

    receiveListDetails();
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
            $api.html($api.byId('receiveName'), ret.memberName);
            if(ret.remark){
               remark = ret.remark;
            }
            $api.html($api.byId('receiveText'), remark);
            $api.html($api.byId('receiveNoteText'), remark);
            if(type !== 1){
                amount = ret.amount;
            }

            geStatus = ret.status;

            if(ret.useage === 4){
                $api.addCls($api.byId("amountText"), "hide");
                $api.addCls($api.byId("priceText"), "hide");
                $api.addCls($api.byId("redCount"), "hide");
                $api.addCls($api.byId("amount2Span"), "hide");
                $api.addCls($api.byId("statusName"), "hide");
            }

            $api.html($api.byId('amountSpan'), amount);
            $api.html($api.byId('amount2Span'), ret.amount);

            $api.html($api.byId('priceEm'), global.formatCurrency(calculate.mul(calculate.div(amount, 1000), goldPrice.lastPrice)));

            $api.html($api.byId('amountSpanw'), amount);
            $api.html($api.byId('priceEmw'), global.formatCurrency(calculate.mul(calculate.div(amount, 1000), goldPrice.lastPrice)));

            useageOwer = ret.useage;
            senderTypeOwer = ret.senderType;

            themeCode = ret.themeCode;

            if(ret.useage===1){
                 $api.removeCls($api.byId("redRegisterCount"), "hide");
            } else {
                 $api.addCls($api.byId("redRegisterCount"), "hide");
            }

        }


        redStatistics(senderTypeOwer,useageOwer);
    });
}

function redStatistics (senderTypeOwer,useageOwer){
    api.ajax({
        url : global.getRequestUri() + '/envelope/statistics?code='+securityCode,
        method : 'get',
        dataType : 'json',
        headers : global.getRequestToken()
    }, function(ret, err) {
        // alert(JSON.stringify(ret));
        if(ret){
            //加载红包领取情况
            $api.removeCls($api.byId("themeClass1"), "hide");

            pickCount = ret.pickCount;

            //营；系；个
            if(senderTypeOwer === 1 || ( senderTypeOwer === 4 && useageOwer === 1) || useageOwer ===4){
                reddetailsList();
            }
            
            //营
            if(useageOwer === 1){
                $api.removeCls($api.byId('redAdvying'), 'hide');
            }else {
                $api.addCls($api.byId('redAdvying'), 'hide');
            }

            if(useageOwer === 4){
                $api.html($api.byId('pickCount'), ret.pickCount + "个");
            } else {
                 $api.html($api.byId('pickCount'), ret.pickCount + "/");
            }
            $api.html($api.byId('redCount'), ret.quantity);
            // 已被领取的总克重
            $api.html($api.byId('amount1Span'), ret.pickAmount + (useageOwer === 4?"":"/"));

            if(ret.newUserCount){
                $api.html($api.byId('newUserCount'), ret.newUserCount);
             }else{
                $api.html($api.byId('newUserCount'), 0);
            }
            if(ret.oldUserCount) {
                $api.html($api.byId('oldUserCount'), ret.oldUserCount);
            }else{
                $api.html($api.byId('oldUserCount'), 0);
            }

            if(ret.subsidy){
                $api.html($api.byId('subsidy1'), ret.subsidy);
                $api.html($api.byId('subsidy2'), ret.subsidy);
            } else {
                $api.html($api.byId('subsidy1'), 0.00);
                $api.html($api.byId('subsidy2'), 0.00);
            }

            if(ret.subsidyCount){
                $api.html($api.byId('subsidy3'), ret.subsidyCount);
            } else {
                $api.html($api.byId('subsidy3'), 0);
            }

            if(ret.totalSubsidy){
                $api.html($api.byId('subsidy4'), ret.totalSubsidy);
            } else {
                $api.html($api.byId('subsidy4'), 0.00);
            }

            if(ret.quantity === ret.pickCount){
                $api.html($api.byId('statusName'), '已抢完');

                if(ret.subsidyStatus === 1){
                    if(senderTypeOwer === 1){
                        $api.addCls($api.byId('span1'), 'hide');
                        $api.addCls($api.byId('span2'), 'hide');
                        $api.removeCls($api.byId('span3'), 'hide');
                    } else if (senderTypeOwer === 4 && useageOwer === 1) {
                        $api.addCls($api.byId('span1'), 'hide');
                        $api.addCls($api.byId('span3'), 'hide');
                        $api.removeCls($api.byId('span2'), 'hide');
                    }
                } else {

                    if(senderTypeOwer === 1){
                        $api.addCls($api.byId('span2'), 'hide');
                        $api.addCls($api.byId('span3'), 'hide');
                        $api.removeCls($api.byId('span1'), 'hide');
                    } else if (senderTypeOwer === 4 && useageOwer === 1) {
                        $api.addCls($api.byId('span1'), 'hide');
                        $api.addCls($api.byId('span3'), 'hide');
                        $api.removeCls($api.byId('span2'), 'hide');
                    }
                }

            }else{
                if(geStatus === 3){
                    if(ret.subsidyStatus === 1){
                        if(senderTypeOwer === 1){
                            $api.addCls($api.byId('span1'), 'hide');
                            $api.addCls($api.byId('span2'), 'hide');
                            $api.removeCls($api.byId('span3'), 'hide');
                        } else if (senderTypeOwer === 4 && useageOwer === 1) {
                            $api.addCls($api.byId('span1'), 'hide');
                            $api.addCls($api.byId('span3'), 'hide');
                            $api.removeCls($api.byId('span2'), 'hide');
                        }
                    } else {

                        if(senderTypeOwer === 1){
                            $api.addCls($api.byId('span2'), 'hide');
                            $api.addCls($api.byId('span3'), 'hide');
                            $api.removeCls($api.byId('span1'), 'hide');
                        }
                    }
                    $api.html($api.byId('statusName'), '已结束');
                }else{
                    if(ret.subsidyStatus != 1){
                        if(senderTypeOwer === 1){
                            $api.addCls($api.byId('span2'), 'hide');
                            $api.addCls($api.byId('span3'), 'hide');
                            $api.removeCls($api.byId('span1'), 'hide');
                        } else if (senderTypeOwer === 4 && useageOwer === 1) {
                            $api.addCls($api.byId('span1'), 'hide');
                            $api.addCls($api.byId('span3'), 'hide');
                            $api.removeCls($api.byId('span2'), 'hide');
                        }
                    }
                    $api.html($api.byId('statusName'), '进行中');

                    if (useageOwer != 2 && type != 1) {
                        $api.removeCls($api.byId('redcodeshare'), 'hide');
                    }
                }
            }

            if(!themeCode || themeCode === 'default'){
                // 默认主题
                $api.removeCls($api.byId("themeClass1"), 'red-newyear');
                $api.removeCls($api.byId("themeClass1"), 'red-wedding');
                $api.addCls($api.byId("themeClass1"), "red-default");

                $api.addCls($api.byId("receiveNoteText"), "hide");
                $api.removeCls($api.byId("typeDefault"), "hide");

                $api.removeCls($api.byId("detailsText1"), "hide");
                $api.addCls($api.byId("detailsText2"), "hide");
                $api.removeCls($api.byId("receiveText"), "hide");

                //$api.removeCls($api.byId("redRegisterCount"), "hide");
                //$api.removeCls($api.byId("redDetailsList"), "hide");

                $api.removeCls($api.byId("themDefaultbox"), "hide");
                $api.addCls($api.byId("themNewyearbox"), "hide");
                $api.addCls($api.byId("themWeddingbox"), "hide");

            } else if (themeCode === 'newyear') {
                // 新年主题
                $api.addCls($api.byId("themeClass1"), 'red-newyear');
                $api.removeCls($api.byId("themeClass1"), 'red-wedding');
                $api.removeCls($api.byId("themeClass1"), "red-default");

                $api.removeCls($api.byId("receiveNoteText"), "hide");
                $api.addCls($api.byId("typeDefault"), "hide");
                $api.removeCls($api.byId("detailsText1"), "hide");
                $api.addCls($api.byId("detailsText2"), "hide");
                $api.addCls($api.byId("receiveText"), "hide");

                //$api.removeCls($api.byId("redDetailsList"), "hide");

                $api.addCls($api.byId("themDefaultbox"), "hide");
                $api.addCls($api.byId("themWeddingbox"), "hide");

                if(useageOwer == 4) {
                    if(ret.pickCount>3){
                         $api.addCls($api.byId("themNewyearbox"), 'hide');
                         $api.removeCls($api.byId("themNewyearbottom"), 'hide');
                         $api.removeCls($api.byId("themNewyeartop"), "hide");
                    } else if(ret.pickCount<=3){
                         $api.addCls($api.byId("themNewyearbottom"), 'hide');
                         $api.addCls($api.byId("themNewyeartop"), "hide");
                         $api.removeCls($api.byId("themNewyearbox"), 'hide');
                    }
                } else if(useageOwer == 1) {
                    $api.addCls($api.byId("themNewyearbox"), 'hide');
                    $api.removeCls($api.byId("themNewyearbottom"), 'hide');
                    $api.removeCls($api.byId("themNewyeartop"), "hide");
                } else {
                    if(ret.pickCount>1){
                         $api.addCls($api.byId("themNewyearbox"), 'hide');
                         $api.removeCls($api.byId("themNewyearbottom"), 'hide');
                         $api.removeCls($api.byId("themNewyeartop"), "hide");
                    } else if(ret.pickCount<=1){
                         $api.addCls($api.byId("themNewyearbottom"), 'hide');
                         $api.addCls($api.byId("themNewyeartop"), "hide");
                         $api.removeCls($api.byId("themNewyearbox"), 'hide');
                    }
                }

                

                
            } else if (themeCode === 'wedding') {
                // 结婚主题
                $api.removeCls($api.byId("themeClass1"), 'red-newyear');
                $api.addCls($api.byId("themeClass1"), 'red-wedding');
                $api.removeCls($api.byId("themeClass1"), "red-default");

                $api.removeCls($api.byId("receiveNoteText"), "hide");
                $api.addCls($api.byId("typeDefault"), "hide");
                $api.addCls($api.byId("detailsText1"), "hide");
                $api.removeCls($api.byId("detailsText2"), "hide");

                //$api.addCls($api.byId("redRegisterCount"), "hide");
                //$api.removeCls($api.byId("redDetailsList"), "hide");
                //$api.addCls($api.byId("no-records"), "hide");

                $api.removeCls($api.byId("themWeddingbox"), "hide");
                $api.addCls($api.byId("themDefaultbox"), "hide");
                $api.addCls($api.byId("themNewyearbox"), "hide");
            }

        }
    });
}

function reddetailsList(){       
    var url = global.getRequestUri() + '/envelope/datail';
    var params = '?code=' + securityCode + '&start=0&maxResults=' + maxResults;
    page.init(maxResults, 'detail-content', 'detail-template', url, params, true, 'no-records');
}

/*二维码分享*/
function codeshare(){
	shareMode = 1;
	$api.removeCls($api.byId('shareDiv'), 'hide');
    $api.removeCls($api.byId('backdrop'), 'hide');
}


/*分享*/
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
    closeShare();

    var wx = api.require('wx');
    wx.isInstalled(function(ret, err) {
        if (ret.installed) {
        	if(shareMode === 1){
                getImagePath(securityCode, shareType);
        	}else{
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