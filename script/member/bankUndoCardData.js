
var filePath = [];

apiready = function(){

	initEvent();
}

function initEvent(){
	api.addEventListener({
		name : 'userBindCardRefresh'
	}, function(ret, err) {

		api.closeWin({
	  		name : 'reBindCardSubWinabc'
	  	});
	  	
		getBankCard();
	});
}

function confirm() {
	if(filePath.length ==0){
		global.setToast('请先上传身份证、银行卡图片');
		return;
	}

	if(!filePath[1]){
		global.setToast('请先上传银行卡图片');
		return;
	}

	if(!filePath[0]){
		global.setToast('请先上传身份证图片');
		return;
	}

	$api.attr($api.byId('confirmId'), 'disabled', 'disabled');
	$api.removeAttr($api.byId('confirmId'), 'onclick');
 	api.showProgress({
		title: '图片提交中...',
		modal: false
    });
	api.ajax({
		url : global.getRequestUri() + '/unbindBankCard/applyUnbindBankCard',
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		data : {
			files : {
				file : filePath
			}
		}
	}, function(ret, err) {
		api.hideProgress();

		if (ret) {
			if (ret.success) {
				//global.setToast('解绑申请已提交，请等待审核');

				api.sendEvent({
	                 name:'bankUndoCardDataEvent'
                });

				api.closeWin({
		        	name : 'bankUnBundlingWin'
				 });

				setTimeout(function(){
		        	api.closeWin({
		        		name : 'bankUndoCardDataWin'
					});	        	
	        	
			    }, 1500);

				var header = "../common/header";
				var params = { "page" : "../member/bankUndoCardDataSuccess", "title" : "解绑银行卡成功" };

				global.openWinName('bankUndoCardDataSuccessWin', header, params);
			} else{
				$api.attr($api.byId('confirmId'), 'onclick', 'confirm();');
				$api.removeAttr($api.byId('confirmId'), 'disabled');
				global.setToast(ret.message);
			}	
		}else{
			$api.attr($api.byId('confirmId'), 'onclick', 'confirm();');
			$api.removeAttr($api.byId('confirmId'), 'disabled');
			global.setErrorToast();
		}
		
	});
}

	/**
	 *选择图片
	 */
function selectImage(id){
	api.getPicture({
		sourceType : 'library',
		encodingType : 'jpg',
		mediaValue : 'pic',
		destinationType : 'url',
		allowEdit : true,
		quality : 90
	}, function(ret, err) {
		if (ret) {
			if (ret.data) {
				var imagePath = ret.data;
				$api.attr($api.byId('img' + id), 'src', imagePath);
				
				filePath[id] = imagePath;
			}
		}
	});
}

function showIcon(type){
	$api.removeCls($api.byId('iconDiv'+type), 'hide');
	$api.removeCls($api.byId('backdrop'), 'hide');
}

function closeIcon(type){
	$api.addCls($api.byId('iconDiv'+type), 'hide');
	$api.addCls($api.byId('backdrop'), 'hide');
}
