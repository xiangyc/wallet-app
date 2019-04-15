var maxResults = 10;
var header = "../common/header";

apiready = function(){
    initEvent();
    redpacketStatistics();
    redpacketList();
  
  	loadConfig();
}

function loadConfig(){
	api.ajax({
		url : global.getRequestUri() + '/orgmember/getOrgMember',
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false
	}, function(ret, err) {
		if (ret && ret.org && ret.org.id) {
			$api.removeCls($api.byId('sendDiv'), 'hide');
		}else{		
			api.ajax({
		        method : 'get',
		        cache : false,
		        dataType : 'json',
		        returnAll : false,
		        headers : global.getRequestToken(),
		        url : global.getRequestUri() + '/sys/config'
		    }, function(ret, err) {
		        if(ret && ret.app_ge_marketing_switch_member == true){
		    		$api.removeCls($api.byId('sendDiv'), 'hide');
		        }
		    });
		}
	});
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        redpacketStatistics();
        redpacketList();
        api.refreshHeaderLoadDone();
    });

    api.addEventListener({
        name : 'scrolltobottom',
        extra : {
            threshold : 0
        }
    }, function(ret, err) {
        page.scrollRefresh();
    });

    api.addEventListener({
        name : 'getRedpacketDataRefresh',
    }, function(ret, err) {
        redpacketList();
    });
}

function redpacketStatistics(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        url : global.getRequestUri() + '/envelope/member/statistics',
    }, function(ret, err) {
        if(ret){
            $api.html($api.byId('pickCount'), ret.pickCount);
            if (ret.totalSubsidy) {
                $api.html($api.byId('totalSubsidy'), global.formatNumber(ret.totalSubsidy,2));
            } else {
                $api.html($api.byId('totalSubsidy'), 0.00); 
            }
            $api.html($api.byId('newUserCount'), ret.newUserCount);
            $api.html($api.byId('oldUserCount'), ret.oldUserCount);
        }
    });
}

function redpacketList(){
    var url =  global.getRequestGEUri() + '/goldenvelope/qryMarketGoldEnvelopeByPage';
    var params = '?start=0&status=SEND&maxResults='  + maxResults;
    page.init(maxResults, 'yxredpacket-content', 'yxredpacket-template', url, params, true, 'no-records');
}

function sendRedExplain(){
    global.openWinName('prepareAdvSubWin', "../redpacket/prepareAdvHeader", null);
}

function openRebExplainDetail(code,type,amount,price){
    var params = { "page" : "../redpacket/redList", "title" : "营销红包详情" ,"securityCode" : code, "type" : type, "amount" : amount,"price" : price};

    global.openWinName('redListSubWin', header, params);
}

function funCal(amount,price){

    var totalMoney = global.formatNumber(calculate.div(calculate.mul(amount,price),1000),2);
    return totalMoney;
}

function funDate(expireTime){
    var now = new Date().getTime();
    if(expireTime >= now){
        return true;
    } else {
        return false;
    }
}