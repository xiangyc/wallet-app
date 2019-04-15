
var maxResults = 10;
var year ='';
var month ='';
var type =1;//1=现有成员 2=历史成员 3=机构本身
var type_ = 1;
var url = global.getRequestUri() + '/orgmember/statistics/page';

apiready = function(){
	initEvent();
	//myOrganization();
	queryOrganAchieve();
}

function queryOrganAchieve() {
	
	var params = '?start=0&maxResults=10&year='+year+'&month='+month;
	page.init(maxResults, 'organ-Achieve-content', 'organ-Achieve-template', url, params, true, 'no-records');
}

function myOrganization() {
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		headers : global.getRequestToken(),
		url : global.getRequestUri() + '/org/getMyOrganization'
	}, function(ret, err) {
		if (ret ) {

			$api.html($api.byId('customersId'), ret.customer);
			$api.html($api.byId('totleBrokerageId'), global.formatNumber(ret.totleBrokerage, 2));				
		
		}else{
			//global.setErrorToast();
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
		reloadInfo();
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
        name:'changeOrganAchieve'
    },function(ret,err){
    	
        if(ret && ret.value){
           type = ret.value.type;
           if(type_ !=type){
           	   type_ = type;

	           var content = $api.byId('organ-Achieve-content');
	           content.innerHTML = '';

	           reloadInfo();
       	   }
        }
    
    });
    
    api.addEventListener({
	    name:'selectDateEvent'
    },function(ret,err){
    	if(ret && ret.value){
		    year = ret.value.year;
		    month = ret.value.month;
		    
       		if(month == '' && year == ''){
       			$api.html($api.byId('allTimeId'), '全部时间段');
       		}else{
       			$api.html($api.byId('allTimeId'), year+'年'+month+'月');
       		}
       		
			$api.html($api.byId('organ-Achieve-content'), '');
			queryOrganAchieve();	
        }
    });  
}

function openPersonalAchieve(memberId){
	
	var param = { title : "业绩详情", page : "../partner/organAchieveDetail", memberId : memberId, year:year, month:month, type:type};
	global.openWinName("organAchieveDetail","../common/header", param);
	
}

function reloadInfo(){
	if(type ==1){
		url = global.getRequestUri() + '/orgmember/statistics/page';
		$api.removeCls($api.byId('timeId'), 'hide');
	}else if(type ==2){
		$api.addCls($api.byId('timeId'), 'hide');
		url = global.getRequestUri() + '/orgmember/exit/statistics/page';
		
	}else if(type ==3){
		$api.addCls($api.byId('timeId'), 'hide');
		url = global.getRequestUri() + '/orgmember/statistics/org';
	}

	queryOrganAchieve();
}

function choice(){
	api.openFrame({
	    name: 'dateSelectFrame',
	    url: './dateFrame.html',
	    rect: {
		    x:0,
		    y:0,
		    w:api.winWidth,
		    h:api.winHeight
	    },
	    pageParam: {
	    	src: 2
	    }
    });
}
