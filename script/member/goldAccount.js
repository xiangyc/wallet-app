var noteDiv,buyAvgPrice,activeBalance,envelopeAmount,operateSrc;
var lastPrice = 0;
var productIdStr = [];
var perdiemAmount =0.000;
var yesterdayIncome = 0.00;
var perdiemTotalIncome =0.00;

apiready = function() {
    operateSrc =  api.pageParam.operateSrc;//来源  1=天天金详情页面

    showResultData();
    getActiveGoldAccountData();
    getPeriodGoldAccountData();
    getProductIdStr();
    showGoldAccount();
    initEvent();
}

function initEvent() {
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function() {
        api.refreshHeaderLoadDone();
        api.sendEvent({
            name:'getGoldAccountDataRefresh'
        });
        getActiveGoldAccountData();
        getPeriodGoldAccountData();
        showGoldAccount();
    });

    api.addEventListener({
        name:'getGoldAccountDataRefreshSuccess'
    },function(ret,err){
        showResultData();
        showGoldAccount();
    });

    api.addEventListener({
        name:'goldPriceRefreshSuccess'
    },function(ret,err){
        if(ret && ret.value){
            lastPrice = ret.value.value.lastPrice;
            // 浮动盈亏=（实时金价-买入均价）* 克重
            $api.html($api.byId('profitMoney'), global.formatNumber((lastPrice-buyAvgPrice) * activeBalance,2));
        }
    });

    api.addEventListener({
        name:'getActiveGoldAccountDataRefresh'
    },function(ret,err){
        getActiveGoldAccountData();
    });

    api.addEventListener({
        name:'getPeriodGoldAccountDataRefresh'
    },function(ret,err){
        getPeriodGoldAccountData();
    });
}

// 黄金资产
function showResultData() {
    var ret = $api.getStorage("getGoldAccountDataResult");
    if(ret){
        // 黄金资产
        $api.html($api.byId('totalGoldAmount'), global.formatNumber(ret.totalGoldAmount,3));
        // 黄金现值
        $api.html($api.byId('totalGoldMoney'), global.formatCurrency(ret.totalGoldMoney));
        // 提金中(冻结随心+冻结安心+冻结红包金)
        $api.html($api.byId('frozenActiveAmount'), global.formatNumber(ret.frozenActiveAmount + ret.frozenPeriodAmount+ret.frozenEnvelopeAmount+ ret.frozenPerdiemAmount ,3));
    }
    
}

// 随心金资金数据
function getActiveGoldAccountData(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account/active',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.success){
                if(ret.obj && ret.obj.activeBalance > 0){

                    $api.removeCls($api.byId('showActivityDiv'), 'hide');
                    showActiveResultData(ret);
                } else {
                    $api.addCls($api.byId('showActivityDiv'), 'hide');
                }
                
            }
        }else{
            global.setErrorToast();
        }
    });
}

function showActiveResultData(ret) {
    activeBalance = ret.obj.activeBalance;
    buyAvgPrice = ret.obj.buyAvgPrice;

    var goldPrice = $api.getStorage('goldPrice');
    if(goldPrice){
        lastPrice = goldPrice.lastPrice;
        // 浮动盈亏=（实时金价-买入均价）* 克重
        $api.html($api.byId('profitMoney'), global.formatCurrency((lastPrice-buyAvgPrice) * activeBalance));
    } else{
        api.sendEvent({
            name:'goldPriceRefresh'
        });
    }

    // 可用随心金
    $api.html($api.byId('activeBalance'), global.formatNumber(activeBalance,3)  + '克');
    // 历史盈亏
    $api.html($api.byId('totalActiveIncome'), global.formatCurrency(ret.obj.totalActiveIncome));
    // 随心金买入均价
    $api.html($api.byId('buyAvgPrice'),  global.formatNumber(ret.obj.buyAvgPrice,2)); 
    // 随心金累计赠金
    $api.html($api.byId('activeIncome'), global.formatCurrency(ret.obj.activeIncome));

}

function openSubWin(type){
    var header = "../common/header";
    var params = {};
    var openWinName ="";

    switch(type) {
        case 1:
            params = { "page" : "../member/goldExtractionList", "title" : "提金记录" };
            openWinName = "goldAccountSubWin";
            break;
        case 2:
        
            isCanBuyOrSellGold(2);
//          params = { "page" : "../member/goldSell", "title" : "卖金" };
//          openWinName = "goldSellSubWin";
            break;
        case 3:
            isCanBuyOrSellGold(3);
//          params = { "page" : "../productActiveDetail", "title" : "随心金" };
//          openWinName = "goldActiveSubWin";
            break;
        case 4:
            params = { "page" : "../productActivityList", "title" : "买金" ,"productIdStr" : productIdStr};
            openWinName = "goldAnAccountSubWin";
            break;
        case 5:
            params = { "page" : "../member/goldSell", "title" : "卖红包金", "src" : 2 };
            openWinName = "goldRedAccountSubWin";
            break;  
        case 6:
            params = { "page" : "../redpacket/buy", "title" : "买红包金" };
            openWinName = "goldRedAccountSubWin";
            break;  
        case 7:
            params = { "page" : "../redpacket/redUnderstand", "title" : "一分钟了解红包金" };
            openWinName = "goldRedAccountSubWin";
            break;  
    }

    global.openWinName(openWinName, header, params);
}

//随心金买卖时间段判断
function isCanBuyOrSellGold(type){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-orders/time-rule'
    }, function(ret, err) { 
        if(ret){
            if(ret.success){
            
                var header = "../common/header";
                var params = {};
                var openWinName ="";
    
                if(type ==2){
                    params = { "page" : "../member/goldSell", "title" : "卖金" };
                    openWinName = "goldSellSubWin";
                }else if(type ==3){   
                    header = '../common/product_header';                  
                    params = { "page" : "../productActiveDetail", "title" : "随心金", "optSrc" : 1};
                    openWinName = "goldActiveSubWin";
                }
                
                global.openWinName(openWinName, header, params);
            }else{
               global.setToast('随心金买卖时间：周一至周五（上午7:00-次日2:30）');
            }
        }
    }); 
}

// 随心金提金
function carryGold(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/withdrow-gold-applies/condition',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.obj){
                var header = "../common/header";
                params = { "page" : "../member/goldExtraction", "title" : "提金", "src" : 1 };
                global.openWinName('goldAccountSubWin', header, params);
            }else{
                showCarry();
            }
        }else{
            global.setErrorToast();
        }
    });
}

function showCarry() {
    if($api.hasCls($api.byId('carryDiv'), 'hide')){
        $api.removeCls($api.byId('carryDiv'), 'hide');
        $api.removeCls($api.byId('carryDropDiv'), 'hide');
    }else{
        $api.addCls($api.byId('carryDiv'), 'hide');
        $api.addCls($api.byId('carryDropDiv'), 'hide');
    }
}

//提示信息
function showMessage(divId) {
    if($api.hasCls($api.byId(divId), 'hide')){
        $api.removeCls($api.byId(divId), 'hide');
        $api.removeCls($api.byId(divId+'Div'), 'hide');
    }else{
        $api.addCls($api.byId(divId), 'hide');
        $api.addCls($api.byId(divId+'Div'), 'hide');
    }
}

// 随心金交易明细
function doActiveList(){

    var params = { "page" : "../member/goldTradeLogList", "title" : "交易流水", "closeToWin" : 0, "type" : 2 };
    global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}


// 安心金数据
function getPeriodGoldAccountData(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account/period',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.success){
                showPeriodResultData(ret);
            }
        }else{
            global.setErrorToast();
        }
    });
}

function showPeriodResultData(ret) {
    // 安心金可用克重
    $api.html($api.byId('periodGoldAmount'), global.formatNumber(ret.obj.periodGoldAmount,3) + '克');
    // 待收购金款
    $api.html($api.byId('totalPeriodMoney'),  global.formatCurrency(ret.obj.totalPeriodMoney)); 
    // 待收赠金
    $api.html($api.byId('collectIncome'),  global.formatCurrency(ret.obj.collectIncome)); 
    // 昨日赠金
    $api.html($api.byId('yesterdayIncome'),  global.formatCurrency(ret.obj.yesterdayIncome)); 
    // 累计赠金
    $api.html($api.byId('periodTotalIncome'),  global.formatCurrency(ret.obj.periodTotalIncome)); 

}

// 安心金交易明细
function doPeriodList(){
    var params = { "page" : "../member/goldTradeLogList", "title" : "交易流水", "closeToWin" : 0 , "type" : 3 };
    global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}

function getProductIdStr(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-products/period?start=0&maxResults=10',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            for (var i = 0;i < ret.recordCount;i++) {
                if(ret.items[i].type != 2){
                    productIdStr.push(ret.items[i].id);
                }
            }
            $api.removeCls($api.byId('anHide'), 'hide');
            //激活买金按钮事件
            $api.attr($api.byId('anbuy'), 'onclick', 'openSubWin(4);');
        }else{
            global.setErrorToast();
        }
    });
}

//交易明细
function doDayDayList(){
    var params = { "page" : "../member/goldTradeLogList", "title" : "交易明细", "closeToWin" : 0, "type" : 4 };
    global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}


function sale(){

    var header = "../common/header";
    var params = { "page" : "../member/dayAccountListFrame", "title" : "选择订单"};
    
    global.openWinName('goldAccountSubWin', header, params);
}

function buy(){
    
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-products/per-diem?start=0&maxResults=1'
    }, function(ret, err) {
        if(ret){
            if(ret){
                
                if(ret.recordCount >0 && ret.items){
                    var obj = ret.items[0];

                    var id = obj.id;
                    var name = obj.name;

                    var header = "../common/product_header";
                    var params = { "page" : "../productDayDetail", "title" : name, "id" : id, "categoryId" : 3 };
                    global.openWinName("productDetail", header, params);
                }
            }
        }else{
            global.setErrorToast();
        }
    });
}

// 红包金交易明细
function doRedList(){
    params = { "page" : "../redpacket/redTradeLog", "title" : "交易明细"};
    global.openWinName('redTradeLogHeader', '../redpacket/redTradeLogHeader', params);
}

// 红包金数据
function showGoldAccount(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.success && ret.obj){
                $api.setStorage("getGoldAccountDataResult", ret.obj);

                showRedResultData(ret.obj);

            }
        }
    });
}

function showRedResultData(ret) {
    envelopeAmount = ret.envelopeAmount;

    var goldPrice = $api.getStorage('goldPrice');
    if(goldPrice){
        lastPrice = goldPrice.lastPrice;
        // 黄金现值= 实时金价 * 克重
        $api.html($api.byId('envelopeMoney'), global.formatCurrency(lastPrice * envelopeAmount));
    } else{
        api.sendEvent({
            name:'goldPriceRefresh'
        });
    }

    // 可用红包金
    $api.html($api.byId('envelopeAmount'), global.formatNumber(envelopeAmount,3) + '克');
    // 黄金现值= 实时金价 * 克重
    $api.html($api.byId('envelopeMoney'), global.formatCurrency(lastPrice * envelopeAmount));

}

function carryRedGold(){
    var header = "../common/header";
    params = { "page" : "../member/goldExtraction", "title" : "提红包金", "src" : 3 };
    global.openWinName('goldRedAccountSubWin', header, params);
}