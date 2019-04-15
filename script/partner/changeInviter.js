apiready = function(){
	
	if(global.getRecommentMobile()){
		$api.html($api.byId('mobile'), global.getRecommentMobile());
		if(global.getRecommentName()){
			$api.append($api.byId('mobile'), " " + global.getRecommentName());
		}
	}else{
		$api.append($api.byId('mobile'), "暂无推荐人");
	}
}

function bindSubmit() {
	var code = $api.val($api.byId('code'));

	if (code.length === 0) {
		global.setToast('邀请码不能为空');
		return;
	}

	$api.removeAttr($api.byId('confirmBtn'), 'onclick');
	api.ajax({
		method : 'put',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/recommend/updateRecommendRelation',
		data : {
			values : {
				'recommendCode' : code
			}
		}
	}, function(ret, err) {
		if (ret) {
			if(ret.success){
				global.setRecommentMobile(ret.obj.securityMobile);
				global.setRecommentName(ret.obj.securityName);
				api.sendEvent({
	                 name:'recommentRefresh'
                });

				global.setToast('修改成功');

				setTimeout(function(){
					api.closeWin();
				}, 300);
			}else{
				global.setToast(ret.message);
			}
		}else{
			global.setToast('修改失败')
		}

		$api.attr($api.byId('confirmBtn'), 'onclick', 'commit();')
	});
}