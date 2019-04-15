apiready = function() {
	var url = global.getRequestUri() + '/delivery-addresses';
    var params = '';
    page.init(10, 'addressList-content', 'addressList-template', url, params, false, 'no-records');
}

function selectAddress(id,name,mobile,provinceName,provinceName,detailName) {
     var deliveryAddress = provinceName + provinceName + detailName;
    api.sendEvent({
        name : 'addressSelectEvent',
        extra : {
            id:id,
            name:name,
            mobile:mobile,
            deliveryAddress : deliveryAddress
        }
    });
    api.closeWin();

}
