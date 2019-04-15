
var id ;
var url = '/recommend-income/org/detail?id='

apiready = function(){
    id = api.pageParam.id;
    tradeType = api.pageParam.tradeType;

    if(api.pageParam.tradeType){
        url = '/org/tradelog/detail?tradeType='+tradeType+'&id='
    }
    query();
}

function query() {
	api.ajax({
            url: global.getRequestUri() + url +id,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers: global.getRequestToken()
        },function(ret,err){
            if (ret) {
                $api.html($api.byId('totalMoney'), global.formatNumber(ret.tradeAmount, 2));
                $api.html($api.byId('type'), ret.tradeTypeName);
                $api.html($api.byId('sendTime'), global.formatDate(ret.tradeTime, 'yyyy-MM-dd hh:mm'));
                $api.html($api.byId('rate'), ret.recommendRate+'%');
                if(api.pageParam.tradeType){
                	$api.html($api.byId('name'), (ret.incomeMemberName?ret.incomeMemberName:'无'));
                }else{
                	$api.html($api.byId('name'), (ret.rewardMemberName?ret.rewardMemberName:'无'));
                }
                $api.html($api.byId('no'), ret.orderNo);
                $api.html($api.byId('buyer'), ret.hideName+' '+ret.hideMobile);
                $api.html($api.byId('productName'),ret.productName );       
                $api.html($api.byId('payMoney'), global.formatNumber(ret.orderMoney, 2));
            }else{
                global.setErrorToast();
            }
     });
}

