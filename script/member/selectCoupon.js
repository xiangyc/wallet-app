var id;
var originalPrice;
var choiceId;
var price;
var ids = '';
var names = '';
var couponIds='';
var amount='';
var comeType;

var useCoupon=[];
var unUseCoupon=[];
var noRecordsId='no-records';

apiready = function(){
	id = api.pageParam.id;
	originalPrice = api.pageParam.originalPrice;
	couponIds = api.pageParam.couponIds;
	amount = api.pageParam.amount;
	comeType = api.pageParam.comeType;
	
	queryCouponList();

	if(couponIds){
		addClassSelected();
	}
	
	if(originalPrice && originalPrice > 0){
		$api.removeCls($api.byId('confirmBtn'), 'hide');
	}

	init();
}

function init(){
	api.showProgress({
		title : '数据加载中...',
		modal : false
	});

	api.ajax({
			method : 'get',
			cache : false,
			dataType : 'json',
			returnAll : false,
			headers : global.getRequestToken(),
			url : global.getRequestUri() + '/coupon-records/new/product/' + id,
			data : {
				values : {
					'amount' : amount,
					'originalPrice' : originalPrice
				}
			}
		}, function(ret, err) {		
			api.hideProgress();	
			if(ret && ret.length > 0){
				if(ret.code && (ret.code =='2119' || ret.code =='2122')){	
					global.setToast(ret.message);
					api.sendEvent({
			   	   		name:'invalidTokenEvent'
		    		});
				}else{
					queryCouponList(ret);
				}
			}else{
				//global.setToast('暂无优惠券');

				$api.removeCls($api.byId(noRecordsId), 'hide');
			}
	});
}

function queryCouponList(data) {
	if(data){	
		for(var d in data){
			if(data[d].canUse){
				useCoupon.push(data[d]);
			}else{
				unUseCoupon.push(data[d]);
			}
		}

	    var template1 = $api.byId('coupon-template1').text;
	    var tempFun1 = doT.template(template1);
		$api.byId('coupon-content1').innerHTML = tempFun1(useCoupon);

		var template0 = $api.byId('coupon-template0').text;
	    var tempFun0 = doT.template(template0);
		$api.byId('coupon-content0').innerHTML = tempFun0(unUseCoupon);

		if(useCoupon.length<1){
			//global.setToast('暂无优惠券');
			$api.removeCls($api.byId(noRecordsId), 'hide');
		}
		
		if(!isNaN(couponIds)){
			confimCoupon(couponIds);
		}
	}
}

function queryList(index) {
	$api.addCls($api.byId(noRecordsId), 'hide');

	$api.removeCls($api.byId('couponLi0'), 'current');
	$api.removeCls($api.byId('couponLi1'), 'current');
	
	if (index === 0) {
		$api.addCls($api.byId('couponLi0'), 'current');

		$api.addCls($api.byId('coupon-content1'), 'hide');
		$api.removeCls($api.byId('coupon-content0'), 'hide');

		$api.addCls($api.byId('confirmBtn'), 'hide');

		if(unUseCoupon.length<1){
			//global.setToast('暂无优惠券');
			$api.removeCls($api.byId(noRecordsId), 'hide');
		}

	} else if (index === 1) {
		$api.addCls($api.byId('couponLi1'), 'current');

		$api.addCls($api.byId('coupon-content0'), 'hide');
		$api.removeCls($api.byId('coupon-content1'), 'hide');

		$api.removeCls($api.byId('confirmBtn'), 'hide');

		if(useCoupon.length<1){
			//global.setToast('暂无优惠券');
			$api.removeCls($api.byId(noRecordsId), 'hide');
		}
	} 
	
}

function showDetail(id){
	if($api.hasCls($api.byId('detail'+id), 'hide')){
		$api.removeCls($api.byId('detail'+id), 'hide');
	}else{
		$api.addCls($api.byId('detail'+id), 'hide');
	}
	if(choiceId != null && choiceId != id){
		$api.addCls($api.byId('detail'+choiceId), 'hide');
	}
	choiceId = id;
}

function confimCoupon(id) {
	if(originalPrice && originalPrice > 0){
		if($api.hasCls($api.byId(id), 'hide')){

			var tempId = '';
			var items = $api.domAll($api.byId('coupon-content1'), '.select_cutover');
			for (var i = 0; i < items.length; i++) {
				if(!$api.hasCls(items[i], 'hide')){
					tempId = $api.attr(items[i], 'id');
					$api.addCls($api.byId(tempId), 'hide');
				}
			}
			$api.removeCls($api.byId(id), 'hide');

		}else{
			$api.addCls($api.byId(id), 'hide');
		}
	}
}


function submit() {
	getSelectId(); 
	if(ids.length < 1){
		sendCouponEvent(0, ids, names);
		return;
	}

	ids = ids.substring(0, ids.length - 1);
	names = names.substring(0, names.length - 1);
	
	$api.attr($api.byId('confirmBtn'), 'disabled', 'disabled');
	api.ajax({
			method : 'GET',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/investment-orders/calculate',
			headers : global.getRequestToken(),
			data : {
				values : {
					'ids' : ids,
					'productId' : id,
					'originalPrice' : originalPrice,
					'amount':amount,
					'isWithdraw' : comeType
				}
			}
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					sendCouponEvent(ret.obj.originalPrice,ret.obj.realPrice,ret.obj.incomeMoney, ids, names);
				} else {
					global.setToast(ret.message);

				}
				$api.removeAttr($api.byId('confirmBtn'), 'disabled');
			} else {
				global.setErrorToast();
			}

	});
}

function sendCouponEvent(initPrice,price, incomeMoney,ids, names){
	api.sendEvent({
		 name:'selectCouponSuccess',
			extra: {
				initPrice: initPrice,
				price: price,
				incomeMoney: incomeMoney,
				ids: ids,
				names: names
			}
	});
}

function getSelectId(){
	ids = '';
	names = '';
	var tempId = 0;

	var items = $api.domAll($api.byId('coupon-content1'), '.select_cutover');
	for (var i = 0; i < items.length; i++) {
		if(!$api.hasCls(items[i], 'hide')){
			tempId = $api.attr(items[i], 'id');
			ids = ids + tempId + ',';
			names = names + $api.html($api.byId('name' + tempId)) + ',';
		}
	}
}

function addClassSelected(){
	
	var sels = couponIds.split(',');
	var items = $api.domAll($api.byId('coupon-content1'), '.select_cutover');
	for (var i = 0; i < items.length; i++) {
		var tempId = $api.attr(items[i], 'id');
		for(var j = 0; j < sels.length; j++) {
			if(tempId == sels[j]){
				$api.removeCls($api.byId(tempId), 'hide');
			}
		}
	}
}