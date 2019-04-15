var rankValue = 5;
var maxLen = 5;

apiready = function() {
    document.body.addEventListener('touchmove', function (event) {
        if(!document.getElementById("content").focus()){
            event.preventDefault();
        }
    }, false);

    document.body.addEventListener('touchmove', function (event) {
        if(!document.getElementById("contactWay").focus()){
            event.preventDefault();
        }
    }, false);

}

function rank(id) {
	for(var i=2; i<=id; i++){
		$api.addCls($api.byId('rank'+i), 'mui-icon-star-filled');
	}

	for(var j=id+1; j<=maxLen; j++){
		$api.removeCls($api.byId('rank'+j), 'mui-icon-star-filled');
		$api.addCls($api.byId('rank'+j), 'mui-icon-star');
	}

	rankValue = id;
}

function save() {
	var content = $api.val($api.byId('content'));
	var contactWay = $api.val($api.byId('contactWay'));

	if (validate.isEmpty(content)) {
		global.setToast('问题和意见不能为空');
		return;
	}

	if (content.length >500) {
		global.setToast('问题和意见过长');
		return;
	}

	if (!validate.isEmpty(contactWay) && contactWay.length >20) {
		global.setToast('联系方式过长');
		return;
	}

	$api.attr($api.byId('btnSave'), 'disabled', 'disabled');

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/feedback/add',
		headers : global.getRequestToken(),
		data : {
			values :  {
				'content' : content,
				'contactWay' : contactWay,
				'rank' : rankValue
			}
		}
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				global.setToast('意见反馈成功，感谢您的宝贵意见');
				setTimeout(api.closeWin, 1000);
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