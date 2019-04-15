apiready = function() {
	initEvent();
}

function initEvent(){
	api.addEventListener({
		name : 'addressSelectEvent'
	}, function(ret) {
		if (ret) {
			var data = ret.value;
			var deliveryAddress = data.deliveryAddress;
			var name = data.name;
			var mobile = data.mobile;
			if (deliveryAddress) {
				$api.html($api.byId('deliveryAddress'), name + " " + mobile + "<em class='mui-pb10'>" + deliveryAddress+ "</em>");
				$api.addCls($api.byId('hideAddress'), 'hide');
				$api.removeCls($api.byId('showAddress'), 'hide');
			}
		}
	});
}
