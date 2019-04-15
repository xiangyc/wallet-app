var envelopeAmount = 0;
var amount = 0;
var lastPrice = 0;
var defaultData;
var swiper;
var defaultIndex = 0;
var count = 0;
var header = "../../common/header";
var themeCode = '';

apiready = function() {
	themeCode = api.pageParam.theme;
	var getGoldAccountDataResult = $api.getStorage("getGoldAccountDataResult");
	if (getGoldAccountDataResult) {
        envelopeAmount = getGoldAccountDataResult.envelopeAmount;
	}
	var goldPrice = $api.getStorage('goldPrice');
	if(goldPrice){
		lastPrice = goldPrice.lastPrice;
	}

	if(api.pageParam.defaultData){
		defaultData = api.pageParam.defaultData;
		count = defaultData.length;
		var text = "";
		for(var i=0; i<defaultData.length; i++){
			text =  '<div class="swiper-slide swiper-slide-active"><input onfocus="showSend(0);" onblur="showSend(1);" value="' + defaultData[i].amount +  
					'" onkeyup="calAmount(' + i + ')" type="number" readonly="true" oninput="if(value.length>4)value=value.slice(0,4);" maxlength="4" id="amount' + i + '"><em>毫克</em></div>';
			$api.append($api.byId('swiperDiv'), text);
		}
		
		if(defaultData.length > 1){
			defaultIndex = 1;
		}
	
		$api.val($api.byId('remark'), defaultData[defaultIndex].greetings);
		document.getElementById('amount' + defaultIndex).removeAttribute('readonly');
		calAmount(defaultIndex);
		initSwiper();
	}
}

function initSwiper(){
    swiper = new Swiper('.swiper-container', {
     	initialSlide : defaultIndex,
        slidesPerView: 3,
        spaceBetween: 0,
        centeredSlides: true,
        on: {
            slideChangeTransitionEnd: function () {
                for(var i=0; i<count; i++){
                    $api.attr($api.byId('amount' + i), "readonly", "true");
                    $api.val($api.byId('amount' + i), defaultData[i].amount);
                }

				$api.val($api.byId('remark'), defaultData[this.activeIndex].greetings);
				$api.removeAttr($api.byId('amount' + this.activeIndex), "readonly");
                document.getElementById('amount' + this.activeIndex).focus();
                calAmount(this.activeIndex);
                defaultIndex = this.activeIndex;
            },
        }
    });
}

function next(){
	amount = $api.val($api.byId('amount' + defaultIndex));

	if (validate.isEmpty(amount)) {
		global.setToast('红包克重不能为空');
		return false;
	}
	if (!validate.integer(amount)) {
		global.setToast('无效的红包克重');
		return false;
	}
	if(amount > envelopeAmount * 1000){
		global.setToast('可用克重不足');
		return false;
	}
	
	$api.html($api.byId('showAmount'), amount + '毫克');
	showMessage();
}

function confirm(){
	var payPwd = $api.val($api.byId('payPwd'));
	remark = $api.val($api.byId('remark'));
	
	if(!remark){
        remark = "新婚快乐 百年好合";
    }

	if(validate.isEmpty(payPwd)){
		global.setToast('交易密码不能为空');
		return;
	}
	
	payPwd = new Base64().encode(payPwd);
	$api.removeAttr($api.byId('submitBtn'), 'onclick');

	api.ajax({
        method : 'post',
        cache : false,
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        url : global.getRequestGEUri() + '/goldenvelope/sendGeneralEnvelope',
        data : {
            values : {
                'payPwd' : payPwd,
                'amount' : amount,
                'quantity' : 1,
                'remark' : remark,
                'themeCode':themeCode
            }
        }
    }, function(ret, err) {
        if(ret){
            if(ret.success){
            	showMessage();
            	api.sendEvent({
	                name:'getGoldAccountDataRefresh'
                });
            	
                var page = "../redpacket/default/readyRed";
                if($api.getStorage("theme")){
                	page = "../redpacket/" + $api.getStorage("theme") + "/readyRed";
                }
                
				var params = { "page" : page, "title" : "黄金红包" ,"amount":amount,"quantity":1,"remark":ret.data.remark,"securityCode":ret.data.securityCode,"lastPrice":lastPrice};
				global.openWinName('redpacketSubWin', header, params);
            }else{
                global.setToast(ret.message);
            }
        }else{
            global.setToast('红包发放失败');
        }
        $api.attr($api.byId('submitBtn'), 'onclick', 'confirm();')
    });
}

function showMessage(){
	$api.val($api.byId('payPwd'), '');
	if($api.hasCls($api.byId('messageDiv'), 'hide')){
		$api.removeCls($api.byId('messageDiv'), 'hide');
		$api.removeCls($api.byId('messageDropDiv'), 'hide');
	}else{
		$api.addCls($api.byId('messageDiv'), 'hide');
		$api.addCls($api.byId('messageDropDiv'), 'hide');
	}
}

function calAmount(i){
	amount = $api.val($api.byId('amount' + i));

	if(amount.length > 0){
		$api.html($api.byId('totalMoney'), global.formatNumber(calculate.div(calculate.mul(amount,lastPrice),1000),2));
	}else{
		$api.html($api.byId('totalMoney'), "0.00");
	}
}

function redRule(){
    var params = { "page" : "../redpacket/rule", "title" : "红包规则" };
    global.openWinName("ruleSubWin", header, params);
}

function openPayPassword(){
	var params = { "page" : "../member/payPasswordFind", "title" : "忘记交易密码" };
	global.openWinName('passwordFindWin', header, params);
}

function showSend(flag){
//	if(flag === 1){
//		$api.removeCls($api.byId('sendDiv'), 'hide');
//	}else{
//		$api.addCls($api.byId('sendDiv'), 'hide');
//	}
}