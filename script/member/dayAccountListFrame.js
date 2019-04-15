var money = 0;
var num =0;
var ids = '';
var itemsLen = 0;
var payPwd = '';

apiready = function(){
	initEvent();
	list();
}

function initEvent(){    
    api.addEventListener({
	    name:'checkPayPwdSuccessEvent'
    },function(ret,err){
    	api.closeFrame({
    		name: 'checkPayPwdFrame'
        });
		if(ret && ret.value){
			payPwd = ret.value.payPwd;
			sell();
		}
    });
}

function list() {
	var url = global.getRequestUri() + '/investment-orders/per-diem?start=-1&maxResults=-1';
	
	api.showProgress({
		title: '数据加载中...',
		modal: false
    });
    
	api.ajax({
            url: url ,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers : global.getRequestToken()
        },function(ret,err){
        	api.hideProgress();
        	
			if (ret ) {
				bindData(ret);	
			} else{
				global.setErrorToast();
			}
     });
}

function bindData(data) {

	if(data && data.recordCount >0){
		var template = $api.byId('order-sell-template').text;
		var tempFun = doT.template(template);
		
		if(data.items){
			itemsLen = data.items.length;
		}		

      	$api.html($api.byId('order-sell-content'), tempFun(data.items));
	}else{
		$api.html($api.byId('order-sell-content'), '');		
		
		$api.removeCls($api.byId('no-records'), 'hide');		
	}
}

function initTips(){
	var dayGoldTips = $api.getStorage('dayGoldTips');
	if(!dayGoldTips){
		$api.setStorage('dayGoldTips','dayGoldTips');

		$api.removeCls($api.byId('tipsInstr'), 'hide');
    	$api.removeCls($api.byId('tipsBg'), 'hide');		
	}
}

function closeTips(){
	$api.addCls($api.byId('tipsInstr'), 'hide');
	$api.addCls($api.byId('tipsBg'), 'hide');
}

function choiceGold(tid){		
	num = 0;
	money = 0;
	ids = '';

	var len =0;
	var el = $api.byId('chk'+tid);
	if(el){
		if(el.checked){
			el.checked = false;
		}else{
			el.checked = true;
		}
	}

	var chkItems = document.getElementsByName('checkbox1');
	for (var i = 0; i < chkItems.length; i++) {
		if(chkItems[i].checked){
			var id = $api.val(chkItems[i]);
			var amountTemp = $api.val($api.byId('amount' + id));
			var moneyTemp = $api.val($api.byId('money' + id));

			num = calculate.add(num, amountTemp);
			money = calculate.add(money, moneyTemp);

			ids = ids + $api.val(chkItems[i]) + ',';
			
			len ++;
		}
	}

	$api.html($api.byId('choiceGoldAmount'), global.formatNumber(num/1000,3));
	
	if(num >0 && itemsLen>0 && itemsLen == len){
		var all=document.getElementById('all');
		all.checked = true;
	}else{
		var all=document.getElementById('all');
		all.checked = false;
	}
}

function cancelSell(){
	$api.addCls($api.byId('submitDiv'), 'hide');
	$api.addCls($api.byId('submitDropDiv'), 'hide');
}

function preSell(){
	//closeTips();

	var chkItems = document.getElementsByName('checkbox1');
	var selectFlag = false;
	for (var i = 0; i < chkItems.length; i++) {
		if(chkItems[i].checked){
			selectFlag = true;
			break;
		}
	}

	if(selectFlag){

		$api.removeCls($api.byId('showDiv2'), 'hide');
    	$api.removeCls($api.byId('dropDiv'), 'hide');

    	$api.html($api.byId('showDivContent2'), '已选择'+global.formatNumber(num/1000,3)+'克黄金，价值'+global.formatNumber(money,2)+'元，确定卖出？' );
	}else{
		global.setToast('请选择订单');
	}
}

function pre2Sell(){
	//cancelShow();
	
	$api.html($api.byId('sellMoney'), global.formatNumber(money,2));
	$api.addCls($api.byId('showDiv2'), 'hide');
	$api.addCls($api.byId('dropDiv'), 'hide');

	api.openFrame({
	    name: 'checkPayPwdFrame',
	    url: './payPasswordFrame.html',
	    rect: {
	        x: 0,
	        y: 0
	    },
	    pageParam: {
	    	payMoney: money
	    },
        bgColor:'rgba(255, 255, 255, 0)'
	});
	
	//$api.removeCls($api.byId('submitDiv'), 'hide');
	//$api.removeCls($api.byId('submitDropDiv'), 'hide');
}

 function checkAll() {  
    var all=document.getElementById('all');
    var one=document.getElementsByName('checkbox1');
    if(all.checked==true){
        for(var i=0;i<one.length;i++){  
            one[i].checked=true;  
        }  

    }else{  
        for(var j=0;j<one.length;j++){  
            one[j].checked=false;  
        }  
    }  

    choiceGold();
 } 

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', '../common/header', params);

}

function sell(){
	if (validate.isEmpty(payPwd)) {
		global.setToast('交易密码不能为空');
		return;
	}

	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
	$api.removeAttr($api.byId('confirmBtn'), 'onclick');	

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/sell-orders/sell/per-diem',
		data : {
			values : {
				'orderIds' : ids,
				'payPwd' : payPwd
			}
		}
	}, function(ret, err) {
		if(ret){
			if(ret.success){

				global.refreshAsset();
				//api.closeFrame();

				$api.removeCls($api.byId('showDiv3'), 'hide');
		    	$api.removeCls($api.byId('dropDiv'), 'hide');

		    	$api.html($api.byId('sellOkMoney'), global.formatNumber(money,2));

		    	api.sendEvent({
			        name:'dayGoldSellRefresh'
		        });
		        
		        list();
		        
		        $api.html($api.byId('choiceGoldAmount'), '0.000');	

				var all=document.getElementById('all');
				all.checked = false;	
            }else{
            	$api.removeAttr($api.byId('confirmBtn'), 'disabled');
            	$api.attr($api.byId('confirmBtn'), 'onclick', 'sell();');
            	
            	if(ret.code && ret.code == 2301){
					$api.removeCls($api.byId('showDiv1'), 'hide');
		    		$api.removeCls($api.byId('dropDiv'), 'hide');
		    		
		    		$api.html($api.byId('showDivContent1'), ret.message);		    		

            	}else{
            	   	global.setToast(ret.message);
            	}        
            }
		}else{
			$api.removeAttr($api.byId('confirmBtn'), 'disabled');
			$api.attr($api.byId('confirmBtn'), 'onclick', 'sell();');
			global.setToast('卖金失败');
		}
		
	});
}

function openOrderList(){
	var params = { "page" : "../member/orderList", "title" : "订单记录", "closeToWin" : 1  };
	global.openWinName('orderListHeader', '../member/orderListHeader', params);
}

function cancelShow(){	
	$api.addCls($api.byId('showDiv1'), 'hide');
	$api.addCls($api.byId('showDiv2'), 'hide');
	$api.addCls($api.byId('showDiv3'), 'hide');
	
	$api.addCls($api.byId('dropDiv'), 'hide');
}