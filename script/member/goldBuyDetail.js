var id ;
var profitRate;
var oldGlodPrice;
var amount;
var statusValue;
var money;
var categoryId;
var payMoney;

apiready = function(){
    id = api.pageParam.id;
    
 	detail();

    initEvent();
    //回款计划
 	getGoldIncome();
}

function initEvent(){
    api.addEventListener({
        name : 'goldDetailRefreshEvent'
    }, function(ret) {
        if (ret) {
            showCondition();
            detail();
        }
    });
}

//买金详情
function detail() {
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/investment-orders/'+id,
		headers : global.getRequestToken()
	}, function(ret, err) {

		api.hideProgress();
		if (ret) {
            if(ret.member.isAbroad == 1){
                $api.addCls($api.byId('showHt'), 'hide');
            } else {
                $api.removeCls($api.byId('showHt'), 'hide');
            }
            
            if(ret.code && (ret.code =='2119' || ret.code =='2122')){
                global.setToast(ret.message);
                api.sendEvent({
                     name:'invalidTokenEvent'
                 });
            }else{
                if(ret.couponRecords && ret.couponRecords.length > 0) {
                	for(var i = 0; i < ret.couponRecords.length; i++){
                        var name = ret.couponRecords[i].couponInstance.template.category.name;
                        var couponValue = ret.couponRecords[i].couponInstance.couponValue;
                        var unitName = ret.couponRecords[i].couponInstance.template.category.unitName;
                        var classId = ret.couponRecords[i].couponInstance.template.category.id;

                        $api.append($api.byId('couponContent'), '<i class="coupon-text_'+ classId +'">' + name + couponValue + unitName+ '</i>');
    	                
                    }
                    
                    $api.removeCls($api.byId('couponDiv'), 'hide'); // 优惠
                    $api.html($api.byId('couponMoney'), couponValue + unitName + name);

                } else {
                    $api.html($api.byId('couponMoney'), '--'); // 优惠
                }

                payMoney = ret.money;

                $api.html($api.byId('orderNo'), ret.orderNo);
                $api.html($api.byId('createTime'), global.formatDate(ret.createTime, 'yyyy-MM-dd hh:mm:ss'));
                $api.html($api.byId('name'), ret.investmentProduct.name);
                $api.html($api.byId('money'), global.formatNumber(ret.money,2));
                $api.html($api.byId('originalPrice'), global.formatNumber(ret.originalPrice,2));
                $api.html($api.byId('amount'), global.formatNumber(calculate.div(ret.amount, 1000),3));
                $api.html($api.byId('goldPrice'), ret.goldPrice);
                $api.html($api.byId('perMoney'), global.formatNumber(calculate.div(calculate.mul(ret.money, ret.investmentProduct.profitRate),36500),2));

                if(ret.investmentProduct.reward){
                	profitRate = ret.investmentProduct.profitRate + ret.investmentProduct.reward;
                	$api.html($api.byId('profitRate'), (ret.investmentProduct.profitRate + '%' + (ret.investmentProduct.reward ? '+' + ret.investmentProduct.reward + '%' : '')))
                }else{
                	$api.html($api.byId('profitRate'), ret.investmentProduct.profitRate + '%')
                }

                categoryId  = ret.investmentProduct.category.id;
                //categoryId = 3;
                //随心金   天添金
                if (ret.investmentProduct && (ret.investmentProduct.category.id == 1 || ret.investmentProduct && ret.investmentProduct.category.id == 3)) {
                	$api.html($api.byId('goldPeriod'), "随买随卖");
                	$api.html($api.byId('hkType'), "按日发赠金");
                	//$api.addCls($api.byId('showPeriodGold'), 'hide');

                    if(ret.investmentProduct.category.id === 3){
                        $api.addCls($api.byId('buyLi'), 'hide');
                    }

                    $api.removeCls($api.byId('perMoneyDiv'), 'hide');
                    $api.addCls($api.byId('comeTypeDiv'), 'hide');
                } else {
                	$api.html($api.byId('hkType'), (ret.investmentProduct.profitDesc ? ret.investmentProduct.profitDesc : '一次性返还购金款及赠金'));
                	//$api.removeCls($api.byId('showPeriodGold'), 'hide');
                	$api.removeCls($api.byId('planDiv'), 'hide');
                    $api.removeCls($api.byId('comeTypeDiv'), 'hide');

                    $api.removeCls($api.byId('backDetailDiv'), 'hide');

                    //提前赎回
                    if(ret.status == 2){
                      $api.removeCls($api.byId('beforeBackDiv'), 'hide');  
                      getBeforeIncome();
                    }

                	var reciveValue = 0;

    		        if(ret.investmentProduct.periodUnit === 3){
    		            $api.html($api.byId('goldPeriod'), ret.investmentProduct.period + "小时");
    		            //$api.html($api.byId('endTime'), global.formatDate(ret.createTime + eval(1000*60*60*ret.investmentProduct.period), 'yyyy-MM-dd'));
    		        }else{
						$api.html($api.byId('goldPeriod'), ret.investmentProduct.period + "天");
    		            //$api.html($api.byId('endTime'), global.formatDate(ret.createTime + eval(1000*60*60*24*ret.investmentProduct.period), 'yyyy-MM-dd'));
    		        }

    		        //$api.html($api.byId('incomeTime'), global.formatDate(ret.periodGoldIncome.incomeTime, 'yyyy-MM-dd'));
    		        //填充还款计划
    		        // if(ret.periodGoldIncome && ret.periodGoldIncome.length > 0){
    		        // 	for(var j=0; j<ret.periodGoldIncome.length; j++){
    		        // 		$api.append($api.byId('incomeListUl'), '<li><span>' + global.formatDate(ret.periodGoldIncome[j].incomeTime, 'yyyy-MM-dd') + '</span><span>' + 
    		        // 		(ret.periodGoldIncome[j].status === 1 ? '已还' : '未还') + '</span><span>' + 
    		        // 		global.formatCurrency(eval(ret.periodGoldIncome[j].incomeMoney + ret.periodGoldIncome[j].capitalMoney)) + '</span></li>');
    		        // 	}
    		        // }
                }
                
    			if(ret.productStrategy && ret.productStrategy.name) {
                    profitRate = ret.investmentProduct.profitRate + ret.productStrategy.profitRate;
    				$api.html($api.byId('activityI'), ret.productStrategy.name);
    				$api.removeCls($api.byId('activityI'), 'hide');
    				$api.html($api.byId('profitRate'), profitRate  + '%');
    			}
    			
    			if(ret.statusName){
    				$api.html($api.byId('statusName'), ret.statusName);
    			}
    			
    			if(ret.isWithdraw === 0){
    				$api.html($api.byId('comeType'), '到期回款');
    			}else{
    				$api.html($api.byId('comeType'), '提取金条');
    				
    				switch(ret.resultType){
    					case 1:
                            $api.addCls($api.byId('comeTypeStatus'), 'extraction-state-1');
                            //$api.html($api.byId('comeTypeStatus'), '待提金');
    						break;
    					case 2:
                            $api.addCls($api.byId('comeTypeStatus'), 'extraction-state-2');
                            //$api.html($api.byId('comeTypeStatus'), '提金申请中');
    						break;
						case 3:
                            $api.addCls($api.byId('comeTypeStatus'), 'extraction-state-3');
                            //$api.html($api.byId('comeTypeStatus'), '已提金');
    						break;
    					case 4:
                            $api.addCls($api.byId('comeTypeStatus'), 'extraction-state-4');
                            //$api.html($api.byId('comeTypeStatus'), '已回购');
    						break;
    				}
    			}
    			
    			oldGlodPrice = ret.goldPrice;
    			amount = ret.amount/1000;
    			statusValue = ret.statusValue;
    			money = ret.money;
    			
    			api.sendEvent({
	                name:'goldComeTypeEvent',
	                extra:{
	                	resultType: ret.resultType
	                }
                });
            }
		} else {
			global.setErrorToast();
		}
	});
}

// 回款计划
function getGoldIncome(){  
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/period-income/detail',
        headers : global.getRequestToken(),
        data : {
            values : {
                'orderId' : id,
                'memberId' : global.getMemberId()
            }
        }
    }, function(ret, err) {
        if(ret){
            //alert(JSON.stringify(ret));
	        //$api.html($api.byId('reciveValue'), ret.incomeMoney);
            for(var j=0; j<ret.length; j++){

                $api.append($api.byId('incomeListUl'), (ret[j].status === 1 ? '<li class="grey">' : '<li>') + 
                '<span>' + global.formatDate(ret[j].incomeTime, 'yyyy-MM-dd') + '</span><i>赠金</i><em>' + 
                global.formatCurrency(ret[j].incomeMoney) + '</em></li>');

                if(j == ret.length - 1){
                    $api.append($api.byId('incomeListUl'), (ret[j].status === 1 ? '<li class="grey">' : '<li>') + 
                    '<span>' + global.formatDate(ret[j].incomeTime, 'yyyy-MM-dd') + '</span><i>购金款</i><em>' + 
                    global.formatCurrency(ret[j].capitalMoney) + '</em></li>');
                }
            }
        }
	});
}


// 提前赎回
function getBeforeIncome(){  
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/redeem-order-info/'+id,
        headers : global.getRequestToken()
    }, function(ret, err) {
        if(ret){
            $api.html($api.byId('fee'), global.formatNumber(ret.fee,2) + "元");
            $api.html($api.byId('deductIncome'), global.formatNumber(ret.deductIncome,2) + "元");
            $api.html($api.byId('realMoney'), global.formatNumber(payMoney-ret.deductIncome-ret.fee,2) + "元");
        }
    });
}


function viewContract() {
    var header = '../common/header';
    var params =  { "page" : "../member/goldContractDetail", "title" : "买金合同详情","id" : id};

    global.openWinName('contractWin', header, params);
}

function showCondition(){
	if($api.hasCls($api.byId('conditionDiv'), 'hide')){
		$api.removeCls($api.byId('conditionDiv'), 'hide');
		$api.removeCls($api.byId('conditionDropDiv'), 'hide');
		
	}else{
		$api.addCls($api.byId('conditionDiv'), 'hide');
		$api.addCls($api.byId('conditionDropDiv'), 'hide');
	}
}

function showCome(){
	if($api.hasCls($api.byId('comeDiv'), 'hide')){
		$api.removeCls($api.byId('comeDiv'), 'hide');
		$api.removeCls($api.byId('comeDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('comeDiv'), 'hide');
		$api.addCls($api.byId('comeDropDiv'), 'hide');
	}
}

function selectType(type){
	showCondition();
	
	if(type === 2){
		showCome();
	}else{
		returnGold();
    }
}


//回购
function comeGold(){
	showCome();
    api.ajax({
        method : 'put',
        cache : false,
        dataType : 'json',
        returnAll : false,
        url : global.getRequestUri() + '/investment-orders/buy-back',
        headers : global.getRequestToken(),
        data : {
            values : {
                'orderId' : id
            }
        }
    }, function(ret, err) {
        if(ret){
			global.setToast(ret.message);
			
			global.refreshAsset();
        }else{
        	global.setToast('回购失败');
        }
	});
}

//提金
function returnGold(){
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
	        	var header = '../common/header';
			    var params =  { "page" : "../member/goldExtraction", "title" : "提金","orderId" : id , "oldgoldPrice" : oldGlodPrice, "amount" : amount, "money" : money, "src" : 2};
			

                if(categoryId === 3){
                    params =  { "page" : "../member/goldExtraction", "title" : "提金","orderId" : id , "oldgoldPrice" : oldGlodPrice, "amount" : amount, "money" : money, "src" : 4};
                }

			    global.openWinName('goldExtractionWin', header, params);
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

function backDetail(){

    if($api.hasCls($api.byId('backDiv'), 'hide')){
        $api.removeCls($api.byId('backDiv'), 'hide');
        $api.removeCls($api.byId('backDropDiv'), 'hide');
    }else{
        $api.addCls($api.byId('backDiv'), 'hide');
        $api.addCls($api.byId('backDropDiv'), 'hide');
    }
}

function beforeBack(){

    if($api.hasCls($api.byId('beforeDiv'), 'hide')){
        $api.removeCls($api.byId('beforeDiv'), 'hide');
        $api.removeCls($api.byId('beforeDropDiv'), 'hide');
    }else{
        $api.addCls($api.byId('beforeDiv'), 'hide');
        $api.addCls($api.byId('beforeDropDiv'), 'hide');
    }
}