var closeToWin = 0;
var theme = "default";
var defaultData = "";
var time = "";
var shortData = "";

apiready = function(){
    closeToWin = api.pageParam.closeToWin;

	//读取选中皮肤 redpacketSendWin
	theme = $api.getStorage("theme");
	defaultData = $api.getStorage("themeData");
	time = $api.getStorage("time");

	if(defaultData){
		defaultData = defaultData;
	}

	if(!theme){
		api.ajax({
			method : 'get',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/envelope/theme/default',
			headers : global.getRequestToken()
		}, function(ret, err) {
			if(ret && ret.code){
				//系统设置默认
				theme = ret.code;
				defaultData = JSON.parse(ret.config);
				$api.setStorage("theme", theme);
				$api.setStorage("themeData", defaultData);
			}else{
				//default	newyear	wedding
				theme = "default";
			}
			
			openSubFrame();
		});
	}else{
		getDefaultData();
	}
	
	initEvent();
}

function initEvent(){
	api.addEventListener({
	    name:'selectThemeEvent'
    },function(ret,err){
    	if(ret && ret.value){
    		api.closeWin({ name : 'redThemeWin' });

    		theme = ret.value.theme;
    		defaultData = JSON.parse(ret.value.text);
    		time = ret.value.time;

			$api.setStorage('theme',theme);
			$api.setStorage('themeData',defaultData);
			$api.setStorage('time',time);
    		openSubFrame();
    	}
    });
}

function openSubFrame(){
    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }
    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;

    api.openFrame({
        name: 'prepareFrame',
        url: './' + theme + '/sendRed.html',
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: rect_h
        },
        pageParam:{
 			defaultData: defaultData,
            theme:theme
        },
        bounces: false,
        vScrollBarEnabled: false,
        reload: true
    });
}

function selectTheme(){
    var params = { "page" : "../redpacket/redTheme", "title" : "红包主题" };
    global.openWinName('redThemeWin', "../common/header", params);
}

function getDefaultData(){
	api.ajax({
		method : 'get',
		cache : false,
		timeout : 30,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/envelope/theme/code?code=default',
		headers : global.getRequestToken()
	}, function(ret1, err) {
		if(ret1 && ret1.code){
			shortData = JSON.parse(ret1.config);

			api.ajax({
				method : 'get',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
				url : global.getRequestUri() + '/envelope/theme/code?code='+theme ,
				headers : global.getRequestToken()
			}, function(ret, err) {
				if(ret && ret.code){
					if(ret.endTime < new Date().getTime()){
						theme = "default";
						defaultData = shortData;
					}
				}
				openSubFrame();

			});

		}
	});
}
