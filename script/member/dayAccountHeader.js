var noteDiv;
var perdiemAmount =0.000;
var yesterdayIncome = 0.00;
var perdiemTotalIncome =0.00;

apiready = function(){

    initEvent();
    getDayDayGold();

    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'dayAccount',
        url: 'dayAccount.html',
        rect:{
            x: 0,
            y: 210 + pos.h,
            w: 'auto',
            h: rect_h - 210 - 45
        },
        pageParam : api.pageParam,
        bounces: false,
        vScrollBarEnabled: false
    });

}

function initEvent(){

   api.addEventListener({
        name:'dayGoldSellRefresh'
    },function(ret,err){       
        getDayDayGold();
    });

    api.addEventListener({
        name:'financeAccountRefreshSuccess'
    },function(ret,err){       
        getDayDayGold();
    });
}

function getDayDayGold() {
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/gold-accounts/my-gold-account/perdiem',
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            if(ret.success){
                perdiemAmount = ret.obj.perdiemAmount /1000;
                yesterdayIncome = ret.obj.yesterdayIncome;
                perdiemTotalIncome = ret.obj.perdiemTotalIncome;

                $api.html($api.byId('perdiemMoney'), global.formatNumber(ret.obj.perdiemMoney,2));

                $api.html($api.byId('perdiemAmount'), global.formatNumber(perdiemAmount,3));
                $api.html($api.byId('yesterdayIncome'), global.formatNumber(yesterdayIncome,2));
                $api.html($api.byId('perdiemTotalIncome'),  global.formatNumber(perdiemTotalIncome,2)); 

            }
        }else{
            global.setErrorToast();
        }
    });

}

//交易明细
function doList(){
    var params = { "page" : "../member/goldTradeLogList", "title" : "交易明细", "closeToWin" : 0, "type" : 4 };
    global.openWinName('goldTradeLogListHeader', '../member/goldTradeLogListHeader', params);
}

function showMessage() {

    api.openFrame({
        name: 'dayAccountInstruction',
        url: 'dayAccountInstruction.html',
        rect:{
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto',
        },
        bounces: false,
        vScrollBarEnabled: false
    });

}

function sale(){
	if(perdiemAmount > 0){
	
	   var header = "../common/header";
	   var params = { "page" : "../member/dayAccountListFrame", "title" : "选择订单"};
	
	   global.openWinName('daydayGoldIncome', header, params);
   
//	     api.openFrame({
//	        name: 'dayAccountListFrame',
//	        url: 'dayAccountListFrame.html',
//	        rect:{
//	            x: 0,
//	            y: 0,
//	            w: 'auto',
//	            h: 'auto',
//	        },
//	        bounces: false,
//	        vScrollBarEnabled: false
//	    });
    }else{
    	//global.setToast('当前未持有天天金');
    }
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

function income(){
   var header = "../common/header";
   var params = { "page" : "../member/dayGoldIncomeList", "title" : "赠金明细"};

   global.openWinName('daydayGoldIncome', header, params);
}

