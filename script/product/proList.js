var categoryId,key,params;
var sort = 0;
var newType = 1;
var otherParams = "";

apiready = function(){

	key = api.pageParam.key;
	categoryId = api.pageParam.category;
	// 查询商品列表
	querGoodsList(sort);
	initEvent();

}


function initEvent(){
	api.setCustomRefreshHeaderInfo({
	 	bgColor: '#f8f8f8',
	    image: {
	        pull: global.pullImage(),
	        load: global.loadImage()
	    }
	}, function(ret, err) {
		querGoodsList(sort);
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

// 查询商品列表
function querGoodsList(sort) {
	params = "?sort="+sort+"&start=0&maxResults=16";
	if(key && key != undefined){
		otherParams = "&key="+key;
	}

	if(categoryId && categoryId != undefined){
		otherParams = otherParams + "&category="+categoryId;
	}

	params =params + otherParams;

	if(global.getMemberId()){
		memberId =  "&memberId="+global.getMemberId();
		params = params + memberId;
	}

	var url = global.getRequestUri() + '/shop-product/list';
	page.init(16, 'goods-content', 'goods-template', url, params, true, 'no-records');


	setTimeout(function(){
        if(key){
	  		api.sendEvent({
		        name:'proListSuccessEvent'
	        });
	  	}
    }, 2000);
	

	// api.ajax({
 //            url: global.getRequestUri() + '/shop-product/list'+ params,
 //            method: 'get',
 //            timeout: 30,
 //            dataType: 'json',
 //            returnAll: false,
	// 		headers: global.getRequestToken()
 //        },function(ret,err){
	// 		if (ret && ret.obj.items) {
	// 			var data = ret;
	// 			var template = $api.byId('goods-template').text;
	// 			var tempFun = doT.template(template);
	// 	      	$api.html($api.byId('goods-content'), tempFun(data.obj.items));

		      	
	// 		}
	      	
 //     });
}


function openShopDetail(id, name){
	global.openHybridWin('shopWin','../common/adv_header', global.getH5url() + '/html/goldshop/shopDetail.html?productId=' + id + '&backSrc=app', name, 0, '');
}


function sortList(type,el){
	sort = type;
	var lis = $api.domAll($api.byId('sortLi'), 'li');
    for(var i = 0; i < lis.length; i++){
        $api.removeCls(lis[i], 'active');
        $api.removeCls(lis[i], 'ascending');
        $api.removeCls(lis[i], 'descending');
    }
    $api.addCls(el, 'active');
    if(type == 1 && newType == 1){
    	$api.addCls(el, 'ascending');
    	$api.removeCls(el, 'descending');
    	newType = 2;
    } else if(type == 1 && newType == 2) {
    	$api.addCls(el, 'descending');
    	$api.removeCls(el, 'ascending');
    	newType = 1;
    	type = 2;
    }
    querGoodsList(type);
}

function showProlistData(searchCon){
	key = searchCon;
	querGoodsList(0);
}