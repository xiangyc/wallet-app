var isDefault = 1;

apiready = function(){
	initEvent();
}

function initEvent(){
    api.addEventListener({
		name : 'citySelectorEvent'
	}, function(ret) {
		if (ret) {
			var data = ret.value;
			var cityName = data.cityName;
			var cityId = data.cityId;
			if (cityName && cityId) {
				$api.html($api.byId('cityName'), cityName);
				$api.val($api.byId('cityId'), cityId);
			}
		}
	});
	
	api.addEventListener({
        name:'tap'
    },function(){
    });
}

function choiceCity() {
 	//document.getElementById('btnSave').focus();
 	//document.getElementById('postcode').blur();
 	//dom.blur();
	var cityName =  $api.val($api.byId('cityName'));
	var params = { "page" : "../member/citySelect", "title" : "选择城市", "cityName" : cityName  };
	global.openWinName('citySelectHeader', "../common/header", params);
}

function setDefault(){
	if(isDefault == 1){
		$api.removeCls($api.byId('defaultParentDivId'), 'mui-active');
		$api.removeAttr($api.byId('defaultChildDivId'), 'style');
		$api.attr($api.byId('defaultChildDivId'), 'style', 'transition-duration: 0.2s; transform: translate(16px, 0px)');
		$api.attr($api.byId('defaultChildDivId'), 'style', 'transition-duration: 0.2s; transform: translate(0px, 0px)');
		
		isDefault = 0;
	}else{
		$api.addCls($api.byId('defaultParentDivId'), 'mui-active');
		$api.removeAttr($api.byId('defaultChildDivId'), 'style');
		$api.attr($api.byId('defaultChildDivId'), 'style', 'transition-duration: 0.2s; transform: translate(0px, 0px)');
		$api.attr($api.byId('defaultChildDivId'), 'style', 'transition-duration: 0.2s; transform: translate(16px, 0px)');

		isDefault = 1;
	}
}

function saveAddress() {
	var consignee = $api.val($api.byId('consignee'));
	var mobile = $api.val($api.byId('mobile'));
	var addressDetail = $api.val($api.byId('addressDetail'));
	var postcode = $api.val($api.byId('postcode'));
	var cityId = $api.val($api.byId('cityId'));

	if (validate.isEmpty(consignee)) {
		global.setToast('收货人不能为空');
		return;
	}

	if (consignee.length < 2) {
		global.setToast('收货人输入过短,请输入2-20位字符');
		return;
	}

	if (validate.isEmpty(mobile)) {
		global.setToast('手机号不能为空');
		return;
	}

	if (!validate.mobile(mobile)) {
		global.setToast('请输入正确的手机号码');
		return;
	}

	if (validate.isEmpty(cityId)) {
		global.setToast('市区不能为空');
		return;
	}

	if (validate.isEmpty(addressDetail)) {
		global.setToast('详情地址不能为空');
		return;
	}

	if (addressDetail.length < 4 ) {
		global.setToast('详情地址输入过短');
		return;
	}
	if (addressDetail.length >250) {
		global.setToast('详情地址过长');
		return;
	}
/*
	if (validate.isEmpty(postcode)) {
		global.setToast('邮政编码不能为空');
		return;
	}*/

	if (postcode!=null && postcode.length>0 && !validate.postCode(postcode)) {
		global.setToast('邮政编码不符合规范');
		return;
	}

	$api.attr($api.byId('btnSave'), 'disabled', 'disabled');

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/delivery-addresses/add',
		headers : global.getRequestToken(),
		data : {
			values :  {
				'consignee' : consignee,
				'consigneeMobile' : mobile,
				'addressDetail' : addressDetail,
				'postcode' : postcode,
				'region' : cityId,
				'isDefault' : isDefault
			}
		}
	}, function(ret, err) {
		
		if (ret) {
			if (ret.success) {
				global.setToast('收货地址添加成功');

				var detail = ret.obj.region.regionName + addressDetail;

				if(isDefault === 1){
					var defaultDeliveryAddress = {
						'consignee': consignee,
						'consigneeMobile':mobile.substring(0,3)+'***'+mobile.substring(6,10),
						'addressDetail': detail,
						'id':ret.obj.id
					};
					$api.setStorage("defaultDeliveryAddress", defaultDeliveryAddress);
					
				}

				api.sendEvent({
					name : 'addressSelectEvent',
					extra : {
						id:ret.obj.id,
						name : consignee,
						mobile : mobile.substring(0,3)+'***'+mobile.substring(6,10),
						deliveryAddress : detail
					}
				});

				api.sendEvent({
	                 name:'deliveryAddressSuccess'
                });

                setTimeout("api.closeWin();", 1000);
			} else {
				$api.removeAttr($api.byId('btnSave'), 'disabled');
				global.setToast(ret.message);
			}
		} else {
			$api.removeAttr($api.byId('btnSave'), 'disabled');
			global.setErrorToast();
		}
	});
}
