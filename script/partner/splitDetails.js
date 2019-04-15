

apiready = function(){
    initEvent();
    splitAmount();
    list();
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
    	splitAmount()
        list();
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

function splitAmount() {
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/org/tradelog/total-split'
	}, function(ret, err) {
		if (ret ) {

			$api.html($api.byId('orgSplitedAmout'), global.formatNumber(ret.orgSplitedAmout, 2));
			//$api.html($api.byId('unOrgSplitedAmout'), global.formatNumber(ret.unOrgSplitedAmout, 2));				
		
		}else{
			global.setErrorToast();
		}
	});
}			

function list() {
    var url = global.getRequestUri() + '/org/getOrgSplitAccountByPage';
    var params = '?start=0&maxResults=10';
    
    page.init(10, 'splitDetails-content', 'splitDetails-template', url, params, true, 'no-records');
}

function openSplit(orgId, memberId, name, mobile){
	var url= h5UrlSplite +"?memberId="+memberId+"&name="+encodeURIComponent(name)+"&mobile="+mobile;

	global.openH5Win("openSplit","../common/h5_common_header", url, '分账');
}

function openSplitSelect(){
     var param = { title : "查询成员", page : "../partner/splitSearch"};
    global.openWinName("splitSearch","../common/header", param);
}

function showTips(){

	if($api.hasCls($api.byId('unOrgSplitedAmoutDivId'), 'mui-hidden')){
		$api.removeCls($api.byId('unOrgSplitedAmoutDivId'), 'mui-hidden');
		$api.removeCls($api.byId('messageDropDiv'), 'mui-hidden');
	}else{
		$api.addCls($api.byId('unOrgSplitedAmoutDivId'), 'mui-hidden');
		$api.addCls($api.byId('messageDropDiv'), 'mui-hidden');
	}
}

function contentClose(){
	$api.addCls($api.byId('unOrgSplitedAmoutDivId'), 'mui-hidden');
	$api.addCls($api.byId('backdropDiv'), 'mui-hidden');		
}

function openList(memberId, status){
    var param = { title : "分账明细", page : "../partner/splitList", memberId : memberId, status : status };
    global.openWinName("splitList","../common/header", param);
}