var payInterval = 60;
var payIntervalTemp = 60;
var payTimer;
var payTimerId;

function initPayTimer(id, interval){
	payTimerId = id;
	payInterval = interval;
	payIntervalTemp = interval;
	payCleanInterval();
	payTimer = window.setInterval("payMsgInterval();", 1000);
}

function payResetInterval(){
	api.sendEvent({
	    name:'timeOutEvent'
    });
	$api.html($api.byId(payTimerId), '已超时');
	window.clearInterval(payTimer);
}

function payCleanInterval(){
	payInterval = payIntervalTemp;
	$api.html($api.byId(payTimerId), payInterval);
	window.clearInterval(payTimer);
}

function payMsgInterval() {
	if (eval(payInterval < 1) && payIntervalTemp > 400 ) {
		payInterval = payIntervalTemp;
		payInterval = payInterval - 1;
		return false;
	}else if(eval(payInterval < 1)){
		payResetInterval();
		return;
	}
	
	if (isNaN(payInterval - 1) || isNaN(payInterval)) {
		$api.html($api.byId(payTimerId), payIntervalTemp);
		payInterval = payIntervalTemp;
	} else {
		$api.html($api.byId(payTimerId), payInterval);
	}

	payInterval = payInterval - 1;
}