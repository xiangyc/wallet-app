var id;
var defaultId;
var addressId;
apiready = function() {
	addressId = api.pageParam.addressId;
	list();
	initEvent();
}
function initEvent() {
	api.addEventListener({
		name : 'deliveryAddressSuccess'
	}, function(ret, err) {
		if (ret) {
			if(api.pageParam.src === 2){
				api.closeWin();
			}

			list();
		}
	});
}

function list() {
	var url = global.getRequestUri() + '/delivery-addresses'
	page.init(20, 'address-content', 'address-template', url, '', false, 'nonAddressId');
}

function setDefaultId(id) {
	defaultId = id;
}

function setDefault(choiceId) {
	if (choiceId == defaultId)
		return;
	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/delivery-addresses/default',
		headers : global.getRequestToken(),
		data : {
			values : {
				'id' : choiceId
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				$api.removeCls($api.byId('defaultParentDivId' + defaultId), 'mui-active');
				$api.removeAttr($api.byId('defaultChildDivId' + defaultId), 'style');
				$api.attr($api.byId('defaultChildDivId' + defaultId), 'style', 'transition-duration: 0.2s; transform: translate(16px, 0px)');
				$api.attr($api.byId('defaultChildDivId' + defaultId), 'style', 'transition-duration: 0.2s; transform: translate(0px, 0px)');

				$api.addCls($api.byId('defaultParentDivId' + choiceId), 'mui-active');
				$api.removeAttr($api.byId('defaultChildDivId' + choiceId), 'style');
				$api.attr($api.byId('defaultChildDivId' + choiceId), 'style', 'transition-duration: 0.2s; transform: translate(0px, 0px)');
				$api.attr($api.byId('defaultChildDivId' + choiceId), 'style', 'transition-duration: 0.2s; transform: translate(16px, 0px)');

				defaultId = choiceId;
				global.setToast('设置默认收货地址成功');

				//设置缓存
				var consignee = $api.html($api.byId('consigneeId'+defaultId));
				var mobile = $api.html($api.byId('mobileId'+defaultId));

				var addressDetail = $api.val($api.byId('regionId'+defaultId)) + $api.html($api.byId('detailId'+defaultId));
				var defaultDeliveryAddress = {
					'consignee': consignee,
					'consigneeMobile':mobile,
					'addressDetail': addressDetail,
					'id':defaultId
				};

				$api.setStorage("defaultDeliveryAddress", defaultDeliveryAddress);

				if(api.pageParam.src !== 1){

					api.sendEvent({
						name : 'addressSelectEvent',
						extra : {
							id:defaultId,
							name : consignee,
							mobile : mobile,
							deliveryAddress : addressDetail
						}
					});
				}
				
			} else {
				global.setToast(ret.message);
			}
		} else {
			global.setErrorToast();
		}
	});
}

function del(choiceId) {
	id = choiceId;

	$api.removeCls($api.byId('delDivId'), 'hide');
	$api.removeCls($api.byId('dropDivId'), 'hide');

}

function addAddress() {
	var header = '../common/header';
	var params = {
		"page" : "../member/deliveryAddressAdd",
		"title" : "新增收货地址"
	};
	global.openWinName('deliveryAddressAddSubWin', header, params);
}

function cancel() {
	$api.addCls($api.byId('delDivId'), 'hide');
	$api.addCls($api.byId('dropDivId'), 'hide');
}

function confirm() {
	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/delivery-addresses/del',
		headers : global.getRequestToken(),
		data : {
			values : {
				'id' : id
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				global.setToast('删除收货地址成功');

				if(ret.obj===1){//删除了默认地址 清除缓存
					$api.rmStorage("defaultDeliveryAddress");
				}
				api.sendEvent({
					name : 'addressInitEvent',
					extra : {
						id:id
					}
				});

				cancel();
				$api.remove($api.byId(id));
			} else {
				global.setToast(ret.message);
			}
		} else {
			global.setErrorToast();
		}
	});
}

function selectAddress(id, name, mobile, provinceName, regionName, detailName,regionId) {
	if(api.pageParam.src !== 1){
		var deliveryAddress = regionName + detailName;

		api.sendEvent({
			name : 'addressSelectEvent',
			extra : {
				id:id,
				name : name,
				mobile : mobile,
				deliveryAddress : deliveryAddress
			}
		});
		api.closeWin();
	}
}
