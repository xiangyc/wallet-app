var choiceId = null;
var index_=0;
var tradeType = '';
var period = 3;

apiready = function(){
    index_ = api.pageParam.type;

    initEvent();
    queryTradeLogType();
    queryPartAchieve(index_);
}
    
function listMeb() {
    var url = global.getRequestUri() + '/recommend/invitationMemberHistroy';
    var params = '?start=0&maxResults=10&period=' + period + '&tradeType=' + tradeType;
    page.init(10, 'personalAchieve0-content', 'personalAchieve0-template', url, params, true, 'no-records');
}

function listAch() {
    var url = global.getRequestUri() + '/recommend-income/member/achievement';
    var params = '?start=0&maxResults=10&period=' + period + '&tradeType=' + tradeType;

    page.init(10, 'personalAchieve1-content', 'personalAchieve1-template', url, params, true, 'no-records');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        if(index_ ==1){
           listMeb();
        }else{
           listAch();    
        }
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
}

function queryPartAchieve(index){
    index_ = index;
    if (index === 1) {
        $api.addCls($api.byId('active1'), 'current');
        $api.removeCls($api.byId('active2'), 'current');

        $api.addCls($api.byId('personalAchieve1-content'), 'hide');
        $api.removeCls($api.byId('personalAchieve0-content'), 'hide');

		listMeb();
    } else if (index === 2) {
        $api.addCls($api.byId('active2'), 'current');
        $api.removeCls($api.byId('active1'), 'current');

        $api.addCls($api.byId('personalAchieve0-content'), 'hide');
        $api.removeCls($api.byId('personalAchieve1-content'), 'hide');
		listAch();
    } 
}

function showContent(id){
	if($api.hasCls($api.byId('li'+id), 'mui-collapse')){
		$api.removeCls($api.byId('li'+id), 'mui-collapse');
	}else{
		$api.addCls($api.byId('li'+id), 'mui-collapse');
	}
	
	if(choiceId !=null && choiceId != id){
		$api.addCls($api.byId('li'+choiceId), 'mui-collapse');
	}

	choiceId = id;
}


function showCondition(){
	if($api.hasCls($api.byId('conditionDiv'), 'hide')){
		$api.removeCls($api.byId('conditionDiv'), 'hide');
		$api.removeCls($api.byId('conditionDropDiv'), 'hide');
		
	}else{
		$api.addCls($api.byId('conditionDiv'), 'hide');
		$api.addCls($api.byId('conditionDropDiv'), 'hide');
	}
}

function queryTradeLogType() {
	api.ajax({
            url: global.getRequestUri() + '/options?name=RecommendRewardType',
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
            headers: global.getRequestToken()
        },function(ret,err){
            if (ret) {
                var template = $api.byId('type-template').text;
                var tempFun = doT.template(template);
                $api.html($api.byId('typeUl'), tempFun(ret));
            }
     });
}

function selectType(id, el){
	tradeType = id;
	
	var lis = $api.domAll($api.byId('typeUl'), 'li');
	for(var i = 0; i < lis.length; i++){
		$api.removeCls(lis[i], 'mui-active');
	}
	
	$api.addCls(el, 'mui-active');
	showCondition();
	queryTradeLog();
}

function selectPeriod(id, el){
	period = id;
	
	var lis = $api.domAll($api.byId('periodUl'), 'li');
	for(var i = 0; i < lis.length; i++){
		$api.removeCls(lis[i], 'mui-active');
	}
	
	$api.addCls(el, 'mui-active');
	showCondition();
	queryTradeLog();
}

function queryTradeLog() {
	queryPartAchieve(index_);
}

function openDetail(tradeType, id){
	var param = { title : "奖励详情", page : "../partner/nrewardDetails", id : id, tradeType : tradeType };
	global.openWinName("nrewardDetailsWin","../common/header", param);
}