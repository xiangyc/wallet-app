var data =[] ;
var time =[];
var timer;
var tickInterval = 12;
var header = './common/header';
	
apiready = function(){
	initEvent();
	showGoldPrice();
 	load(1);
}

function initEvent(){
	api.addEventListener({
	    name:'goldPriceRefreshSuccess'
    },function(ret,err){
    	if(ret ){
			showGoldPrice();
		}
		
    });
}

function showGoldPrice(){
 	$api.addCls($api.byId('refreshDiv'), 'animation-rotate');
 	//$api.addCls($api.byId('lastPrice'), 'lastprice-ac');
 	//setTimeout("$api.removeCls($api.byId('lastPrice'), 'lastprice-ac');", 1000);
 	setTimeout("$api.removeCls($api.byId('refreshDiv'), 'animation-rotate');", 1000)
 	
	var goldPrice = $api.getStorage('goldPrice');
	if(goldPrice){
		$api.html($api.byId('lastPrice'), goldPrice.lastPrice);
	}
}


function refresh(){
	api.sendEvent({
	    name:'goldPriceRefresh'
    });
}

//type 1=24h 2=7d 3=30d
function load(type) {

	var method = 'history/24h';
	if(type == 1){
 		method = 'history/24h';
 		tickInterval = 12;

 		$api.addCls($api.byId('timeInteval1'), 'current');
 		$api.removeCls($api.byId('timeInteval2'), 'current');
 		$api.removeCls($api.byId('timeInteval3'), 'current');
	}else if(type == 2){
 		method = 'history/7d';
		tickInterval = 24;

 		$api.addCls($api.byId('timeInteval2'), 'current');
 		$api.removeCls($api.byId('timeInteval1'), 'current');
 		$api.removeCls($api.byId('timeInteval3'), 'current');

	}else if(type == 3){
 		method = 'history/30d';
		tickInterval = 42;

 		$api.addCls($api.byId('timeInteval3'), 'current');
 		$api.removeCls($api.byId('timeInteval1'), 'current');
 		$api.removeCls($api.byId('timeInteval2'), 'current');

	}

	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/gold-prices/' + method
	}, function(ret, err) {
		if (ret) {
			data=[];
			time =[];

			if(timer!=null)
				window.clearInterval(timer);

			for (var i in ret) {

				data.push(ret[i].price);

				if(type == 1){

			 		time.push(ret[i].createTime);

			 		if(i == (ret.length -1)){
			 			var secDayTime = ret[0].createTime + 1000 * 60 * 60 * 24;//第二天的零点
			 			var maxTime = ret[i].createTime;//数组的最大时间
			 			var n = maxTime + 1000 * 60 * 5;//增加5分钟

			 			while(secDayTime > n){
			 				time.push(n);
			 				data.push(null);

			 				n += 1000 * 60 * 5;

			 			}			 			
			 		}
				}else if(type == 2){
					time.push(ret[i].createTime);
				}else if(type == 3){
					time.push(ret[i].createTime);
			 		//time.push(global.formatDate(ret[i].createTime, 'MM-dd'));
				}
			
			}
	
			chart(data,time,type);

			if(type ==1)
				timer = window.setInterval("load("+type+");", 300000);

		} else {
			global.setErrorToast();
		}
	});

}

function chart(data,times,type){
   var chart = new Highcharts.Chart('container', {

            chart: {
                zoomType: 'x',
                marginTop: 30,
	            marginBottom: 50,
	            marginLeft: 11,
	            marginRight: 1
            },
            title: {
		        text: null,
		        y:-20
            },
       
            xAxis: {              
                categories:times,
                tickInterval: tickInterval,
                //type: 'datetime',
                labels: {
              	  formatter: function() {                       
                  	  //return  Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value);
                  	  if(type==1){
                  	 	 return global.formatDate(this.value, 'hh:mm');
                  	  }else{
                  	  	 return global.formatDate(this.value, 'MM-dd');
                  	  }
              	  }
                }
            },
		    yAxis: {
		        title: {
		            text:null
		        },
		        offset:-35,
		        allowDecimals : false,  
	            lineWidth : 0,  
		        plotLines: [{
		            value: 0,
		            width: 1,
		            color: '#808080'
		        }]
		    },
			tooltip:{
			   formatter:function(){
			       	return global.formatDate(this.x,'yyyy-MM-dd hh:mm') +
				      		'<br><strong>'+this.series.name+'</strong>'+
				       		': '+this.y+' 元/克';
			   }
			},
            legend: {
                enabled: false ,   //图例  
	        	borderWidth: 0	
            },
            credits:{//右下角的文本  
	        	enabled: false
	   		},  
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, '#ffe9dc'],
                            [1, '#fff']
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
            	type: 'area',
		        name: '金价',
		        data: data,
		        color : "#ed742b"
		        // pointInterval: 2 * 3600 * 1000 // one day
            }]
        });
}

function goldSource(){
	var	params = { "page" : "../statics/goldSource", "title" : "金价来源" };
	global.openWinName('goldSourceSubWin', header, params);
}

function sell() {
	var params;
	if (!global.isValidUser()) {
		params = {"title" : "登录" };
		global.openWinName("loginWin", "./member/login", params);
		return;
	}
	
	params = { "page" : "../member/goldSell", "title" : "卖金"};
	global.openWinName("goldSell", header, params);
}

function buy(){
	var header = './common/product_header';
	params = { "page" : "../productActiveDetail", "title" : "随心金" ,"optSrc" : 1};
	global.openWinName("productActiveDetail", header, params);
}
