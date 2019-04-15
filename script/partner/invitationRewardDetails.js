
var id ;
var tradeType;
apiready = function(){
    id = api.pageParam.id;
    tradeType = api.pageParam.tradeType;

    showDiv();
}

function showDiv(){
    if (tradeType === 2) {//奖励分账
        $api.removeCls($api.byId('handDiv'), 'hide');

        queryHand();
    } else if (tradeType === 3) {//邀请奖励
        $api.removeCls($api.byId('autoDiv'), 'hide');
        
        queryAuto();
    } else if (tradeType === 4){
    	$api.removeCls($api.byId('activityDiv'), 'hide');
    	
    	queryActivity();
    }
}

function queryAuto() {
	api.ajax({
            url: global.getRequestUri() + '/org/tradelog/detail?id='+id+'&tradeType='+tradeType,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers: global.getRequestToken()
        },function(ret,err){
            if (ret) {
                
                $api.html($api.byId('totalMoney'), global.formatNumber(ret.tradeAmount, 2));
                $api.html($api.byId('gather'), ret.rewardMemberName+' '+ ret.rewardMemberMobile);
                $api.html($api.byId('createTime'), global.formatDate(ret.tradeTime, 'yyyy-MM-dd hh:mm'));
                $api.html($api.byId('no'), ret.orderNo );
                $api.html($api.byId('commission'), global.formatNumber(ret.incomeMoney, 2) +'元'); 
                $api.html($api.byId('reward'), ret.recommendRate+'%');
                $api.html($api.byId('rate'), ret.brokerageRate+'%');               
                $api.html($api.byId('buyer'), ret.hideName +' '+ret.hideMobile);
                $api.html($api.byId('productName'),ret.productName );       
                $api.html($api.byId('payMoney'), global.formatNumber(ret.orderMoney, 2));
                $api.html($api.byId('way'),ret.sendRewardType );      
                $api.html($api.byId('type'),ret.tradeTypeName );         
            }else{
                global.setErrorToast();
            }
     });
}

function queryHand() {
    api.ajax({
            url: global.getRequestUri() + '/org/tradelog/detail?id='+id+'&tradeType='+tradeType,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers: global.getRequestToken()
        },function(ret,err){
            if (ret) {
                
                $api.html($api.byId('totalMoney1'), global.formatNumber(ret.tradeAmount, 2));
                $api.html($api.byId('gather1'), ret.rewardMemberName+' '+ ret.rewardMemberMobile);
                $api.html($api.byId('createTime1'), global.formatDate(ret.tradeTime, 'yyyy-MM-dd hh:mm'));
                $api.html($api.byId('no1'), ret.orderNo );
                $api.html($api.byId('way1'),ret.sendRewardType );      
                $api.html($api.byId('type1'),ret.tradeTypeName );  
            }else{
                global.setErrorToast();
            }
     });
}

function queryActivity(){
    api.ajax({
            url: global.getRequestUri() + '/org/tradelog/detail/' + id,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers: global.getRequestToken()
        },function(ret,err){
            if (ret) {
            	$api.html($api.byId('type2'), ret.tradeTypeName );
                $api.html($api.byId('totalMoney2'), global.formatNumber(ret.tradeAmount, 2));
                $api.html($api.byId('createTime2'), global.formatDate(ret.tradeTime, 'yyyy-MM-dd hh:mm'));
                $api.html($api.byId('no2'), ret.tradeNo );
                $api.html($api.byId('note2'),ret.note );
            }else{
                global.setErrorToast();
            }
     });
}
