var maxResults = 10;
var buyUrl = global.getRequestUri() + '/members/recommender-investment';
var noBuyUrl = global.getRequestUri() + '/members/recommender-noinvestment';
var flag = true;

apiready = function(){
	initEvent();
	queryBuyFriends();
}

function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		if (flag) {
			queryBuyFriends();
		} else {
			queryNoBuyFriends();
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

function queryBuyFriends() {
	var params = '?start=0&maxResults=10';
	page.init(maxResults, 'buyInviteFriends-content', 'buyInviteFriends-template', buyUrl, params, true, 'no-records');
}

function queryNoBuyFriends() {
	var params = '?start=0&maxResults=10';
	page.init(maxResults, 'noBuyInviteFriends-content', 'noBuyInviteFriends-template', noBuyUrl, params, true, 'no-records');
}

function changeBuyGoldStatus(type){
    if(type == 1){
    	flag=true;
    	$api.addCls($api.byId('showNoBuyGoldFriends'), 'hide');
        $api.removeCls($api.byId('showBuyGoldFriends'), 'hide');
        $api.addCls($api.byId('buy'), 'current');
        $api.removeCls($api.byId('noBuy'), 'current');
       
        queryBuyFriends();
    } else {
    	flag=false;
    	$api.addCls($api.byId('showBuyGoldFriends'), 'hide');
        $api.removeCls($api.byId('showNoBuyGoldFriends'), 'hide');
        $api.addCls($api.byId('noBuy'), 'current');
        $api.removeCls($api.byId('buy'), 'current');
        
        queryNoBuyFriends();
    }
}
