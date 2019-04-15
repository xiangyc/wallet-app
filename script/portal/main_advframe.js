var initTime = 8;
var type,relativeId,url;
apiready = function() {
	type = api.pageParam.type;
	relativeId = api.pageParam.relativeId;
	url = api.pageParam.url;
	
	$api.attr($api.byId('startAdv'), 'src', global.getImgUri() +'/'+ api.pageParam.imgUrl);
	showCountSeconds();
}

function showCountSeconds(){
	initTime = initTime - 1;

	if (initTime >= 0) {
		$api.html($api.byId('countSeconds'), initTime);

		setTimeout('showCountSeconds();',1000);
	} else {
		//api.closeFrame();
		api.sendEvent({
	        name:'showIndexAdvEvent'
        });
	}
}


function nextStep(){
	api.sendEvent({
        name:'showIndexAdvEvent'
    });	
}

function advDetail(){	
	setTimeout(function(){
       api.sendEvent({
	        name:'showIndexAdvEvent'
	    });
	},800);

	api.sendEvent({
    	name: 'advIndexEvent',
    	extra: {
    		type : type,
    		relativeId : relativeId,
    		url :url
    	}
	});
}