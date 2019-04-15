var id;
var data;
var type;
apiready = function() {
	id = api.pageParam.id;
	detail(id);
	initEvent();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		api.refreshHeaderLoadDone();
		detail(id);
	});
}

function detail(id) {
    api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/withdrow-gold-applies/' + id,
		headers : global.getRequestToken()
	}, function(ret, err) {
		//alert(JSON.stringify(ret));
		api.hideProgress();
		if (ret) {
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){	
				global.setToast(ret.message);
				api.sendEvent({
			   	   name:'invalidTokenEvent'
		    	});
			}else{
				type = ret.type;
				if(ret.status < 0){
					$api.addCls($api.byId('detailDiv'), 'overrule-icon');
				}
				
				if (ret.status == 1 || ret.status == 2 || ret.status == 3 ) {
					$api.removeCls($api.byId('hideBtn'), 'hide');
				}
				if (ret.status == 4) {
					$api.addCls($api.byId('hideBtn'), 'hide');
				}
				if (ret.status == 5) {
					$api.removeCls($api.byId('reciveBtn'), 'hide');
				}
				if (ret.status == 6) {
					$api.addCls($api.byId('reciveBtn'), 'hide');
				}
				if (ret.expressType == 1) {
					$api.html($api.byId('expressType'), "自提");
					$api.removeCls($api.byId('extractAddress'), 'hide');

				} else {
					$api.html($api.byId('expressType'), "快递");
					$api.removeCls($api.byId('reciveAddress'), 'hide');
					var deliveryAddress = '';
					if(ret.address.region){
						var deliveryAddress = ret.address.region.province.name + ret.address.region.regionName + ret.address.addressDetail;
					}
					$api.html($api.byId('deliveryAddress'), ret.address.consignee + " " + ret.address.hideMobile + "<em class='mui-pb10'>" + deliveryAddress + "</em>");

					if (ret.status == 5 || ret.status == 6) {
						var companyName = ret.express.companyName;
						var expressNo = ret.expressNo;

						$api.html($api.byId('companyNo'), companyName + '：' + expressNo);

						$api.removeCls($api.byId('expressDiv'), 'hide');
					}
				}

				var applyCount = ret.amount;
				var weight = ret.goldProduct.weight;
				//金条总毫克数
				var totalGoldAmount = applyCount * weight;

				$api.html($api.byId('applyNo'), ret.applyNo);
				$api.html($api.byId('createTime'), global.formatDate(ret.createTime, 'yyyy-MM-dd hh:mm:ss'));
				$api.html($api.byId('statusName'), ret.statusName);
				$api.html($api.byId('amount'), global.formatNumber(totalGoldAmount / 1000, 3));

				var type = ret.expressType;
				var expressFee = 0.00;
				var insuredFee = 0.00;
				var serviceFee = totalGoldAmount * 12;
				$api.html($api.byId('serviceFee'), global.formatCurrency(serviceFee / 1000));
				if (type == 2) {
					insuredFee = totalGoldAmount * 1.5;
					expressFee = 20;
				}
				$api.html($api.byId('expressFee'), expressFee.toFixed(2));
				$api.html($api.byId('insuredFee'), global.formatCurrency(insuredFee / 1000));
				$api.html($api.byId('totalFee'), global.formatCurrency((serviceFee + insuredFee) / 1000 + expressFee));

				if(ret.order){
					$api.removeCls($api.byId('diffDiv'), 'hide');
					$api.removeCls($api.byId('surplusDiv'), 'hide');
					$api.html($api.byId('diffEm'), global.formatCurrency(ret.compensationFee));
					$api.html($api.byId('surplusEm'), global.formatCurrency(ret.buyBackMoney));
				}

				$api.attr($api.byId('detailBtn'), 'onclick', 'openFlowList();');
				data = ret.flows;

				$api.html($api.byId('fee'), global.formatCurrency(ret.fee));
			}
		} else {
			global.setErrorToast();
		}
	});
}

function cancleApply() {
	if(type === 2){
		$api.removeCls($api.byId('periodDiv'), 'hide');
	}
	
	$api.removeCls($api.byId('cancleApply'), 'hide');
	$api.removeCls($api.byId('cancleApplyDiv'), 'hide');
}

function showDiv() {
	if ($api.hasCls($api.byId('cancleApply'), 'hide')) {
		$api.removeCls($api.byId('cancleApply'), 'hide');
		$api.removeCls($api.byId('cancleApplyDiv'), 'hide');
	} else {
		$api.addCls($api.byId('cancleApply'), 'hide');
		$api.addCls($api.byId('cancleApplyDiv'), 'hide');
	}
}

function confirmRecive() {
	$api.removeCls($api.byId('confirmRecive'), 'hide');
	$api.removeCls($api.byId('confirmReciveDiv'), 'hide');
}

function showReciveDiv() {
	if ($api.hasCls($api.byId('confirmRecive'), 'hide')) {
		$api.removeCls($api.byId('confirmRecive'), 'hide');
		$api.removeCls($api.byId('confirmReciveDiv'), 'hide');
	} else {
		$api.addCls($api.byId('confirmRecive'), 'hide');
		$api.addCls($api.byId('confirmReciveDiv'), 'hide');
	}
}

function cancelRecive() {
	$api.addCls($api.byId('confirmRecive'), 'hide');
	$api.addCls($api.byId('confirmReciveDiv'), 'hide');
}

function cancleWithdrawGold() {
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');

	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/withdrow-gold-applies/' + id,
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret) {
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){			
				global.setToast(ret.message);
			}else{
				if (ret.status == 4) {
					global.setToast('已成功取消提金申请');
					showDiv();
					
					detail(id);
					api.sendEvent({
			                name:'orderListRefresh'
		            });

					global.refreshAsset();
				} else {
					global.setToast(ret.message);
				}
			}
		} else {
			global.setErrorToast();
		}
		$api.removeAttr($api.byId('confirmBtn'), 'disabled');
	});
}


function reciveWithdrawGold() {
	$api.attr($api.byId('confirmReciveBtn'), 'disabled', 'disabled');
	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/withdrow-gold-applies/delivered/received/' + id,
		headers : global.getRequestToken()
	}, function(ret, err) {
		if (ret) {
			if(ret.success){
				global.setToast('已确认收货');
				cancelRecive();
				detail(id);
				api.sendEvent({
		            name:'orderListRefresh'
	            });

				global.refreshAsset();
		}else{
			global.setToast(ret.message);
		}
		} else {
			global.setErrorToast();
		}
		$api.removeAttr($api.byId('confirmReciveBtn'), 'disabled');
	});
}


function openFlowList(){
	var params = { "page" : "../member/goldExtractionDetailFlow", "title" : "提金记录流程", "data" : data };
	global.openWinName('flowList', '../common/header', params);
}