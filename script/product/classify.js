var classifyId = 1;
apiready = function(){
	// 查询一级分类列表
	queryOneClassifyList();
	initEvent();
	global.networkStatus('noneNetworkDiv', 'mainDiv');
}

function initEvent(){

	api.addEventListener({
	    name:'networkConnection'
    },function(ret,err){
		global.networkStatus('noneNetworkDiv', 'mainDiv');
    });

    api.addEventListener({
	    name:'connectionSuccess'
    },function(ret,err){
    	queryOneClassifyList();
    });

}


// 查询一级分类列表
function queryOneClassifyList() {

	api.ajax({
            url: global.getRequestUri() + '/shop-product/category/top',
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
			headers: global.getRequestToken()
        },function(ret,err){
			if (ret) {
				classifyId = ret[0].id;

				var data = ret;
				var template = $api.byId('classify-template').text;
				var tempFun = doT.template(template);
		      	$api.html($api.byId('classify-content'), tempFun(data));

		      	var lis = $api.domAll($api.byId('segmentedControls'), 'a');
			    for(var i = 0; i < lis.length; i++){
			        $api.removeCls(lis[i], 'mui-active');
			    }

			    $api.addCls($api.byId(classifyId), 'mui-active');

		      	// 查询二级分类列表
				querySecondClassifyList();

			} 
     });
}

// 查询二级分类列表
function querySecondClassifyList() {

	var params = '?id=' + classifyId;
	api.ajax({
            url: global.getRequestUri() + '/shop-product/category/child' + params,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
			headers: global.getRequestToken()
        },function(ret,err){
        	//alert(JSON.stringify(ret));
			if (ret) {
				var data = ret;
				var template = $api.byId('product-template').text;
				var tempFun = doT.template(template);
		      	$api.html($api.byId('product-content'), tempFun(data));
			} 
     });
}


function detail(id){
	var header = "../common/search_header";
	var params = { "page" : "../product/proList", "title" : "产品列表" ,"category":id};

	global.openWinName('classifySubWin', header, params);
}



function changeClassify(id,el){
	classifyId = id;
	var lis = $api.domAll($api.byId('segmentedControls'), 'a');
    for(var i = 0; i < lis.length; i++){
        $api.removeCls(lis[i], 'mui-active');
    }
    $api.addCls(el, 'mui-active');
    querySecondClassifyList();
}