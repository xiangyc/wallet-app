
apiready = function(){
 	list();
}
    
function list() {
	var url = global.getRequestUri() + '/bank-accounts/bankInfos';
	
	api.ajax({
            url: url ,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false
        },function(ret,err){
			if (ret ) {
				bindData(ret);	
			} else{
				global.setErrorToast();
			}
     });
}

function bindData(data) {
	if(data){
		var template = $api.byId('bank-template').text;
		var tempFun = doT.template(template);
      	$api.html($api.byId('bank-content'), tempFun(data));
	}else{
		$api.html($api.byId('bank-content'), '');
	}
}

function formatNum(num){
	var num_  = num/10000;
	
	if(num%10000 >0){
		 num_ = (num/10000).toFixed(2);
	}
	return num_;
}
