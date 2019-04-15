
var defaultColors = ['#fff4d6','#ffffff','#fae5e4','#d3f8ff'];

var activityInstanceId;
var cacheTime = 0;
var cacheData;

//活动属性
var actStatus=1;//活动进行中
var times = 0;//剩余活动次数
var prizeName ='';//一等奖，二等奖，三等奖
var prizeType = 3;//谢谢参与类型
var chanceType = 1;// 1="每天次数限制" 2="总共次数限制"

var loadTimesFlag = false;//加载次数标志
var loadWheelFlag = false;//加载转盘标志

var title='金算子';
var summary='金算子';

var turnplate={
		//restaraunts:["50M免费流量包", "10闪币", "谢谢参与", "5闪币", "10M免费流量包", "20M免费流量包", "20闪币 ", "30M免费流量包", "100M免费流量包", "2闪币", "测试测试测试使用"],				//大转盘奖品名称
		//colors:["#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF", "#FFF4D6", "#FFFFFF","#FFF4D6", "#FFFFFF","#FFF4D6"],					//大转盘奖品区块对应背景颜色
		indexs:[],
		imgs:[],
		restaraunts:[],
		colors:[],
		outsideRadius:192,			//大转盘外圆的半径
		textRadius:125,				//大转盘奖品位置距离圆心的距离
		insideRadius:25,			//大转盘内圆的半径
		startAngle:0,				//开始角度		
		bRotate:false				//false:停止;ture:旋转
};

apiready = function(){
	activityInstanceId = api.pageParam.id;

	initEvent();
	loadDrawRecords();
	validateCache();	

	if (api.systemType === 'ios' ){
    	$api.removeCls($api.byId('sysVersionDiv1'), 'hide');
    	$api.removeCls($api.byId('sysVersionDiv2'), 'hide');
    }
}

function loadDrawRecords(){
	
	var url = global.getRequestUri() + '/prize-draw-record/latest5';
    var params = '';
    page.init(10, 'prize-content', 'prize-template', url, params, false, '');
}

function validateCache(){
	var cacheObj = cache.getActivityDetail(activityInstanceId);
	if(cacheObj && cacheObj.cacheTime){
		cacheTime = cacheObj.cacheTime;
		cacheData = cacheObj.data;
	}

	init();
}

function initEvent() {
	api.addEventListener({
		name : 'loginRefresh'
	}, function(ret, err) {
		
		api.closeWin({
			name: 'loginWin'
        });
		availableTimes();

	});
}

function init(){

	api.showProgress({
		title: '数据加载中...',
		modal: false
    });
	api.ajax({
		method : 'get',
		cache : false,
		dataType : 'json',
		returnAll : true,
		url : global.getRequestUri() + '/prize-draw/list?activityInstanceId='+activityInstanceId + '&cacheTime=' + cacheTime,
		headers : global.getRequestToken()
	}, function(ret, err) {
		api.hideProgress();
		if (ret && ret.body) {
			bindData(ret.body);

			if(ret.headers && ret.headers.cacheTime){
				cacheTime = ret.headers.cacheTime;
			} 

			cache.setActivityDetail(activityInstanceId, ret.body, cacheTime);
		} else if(err && err.statusCode === global.getCacheStatusCode()){
			bindData(cacheData);
		}else {
			global.setErrorToast();
		}
	});
}

//剩余次数
function availableTimes(){

	api.ajax({
		method : 'post',
		cache : false,
		dataType : 'json',
		returnAll : false,
		url : global.getRequestUri() + '/prize-draw/times',
		headers : global.getRequestToken(),
		data : {
			values : {
				'activityInstanceId' : activityInstanceId
			}
		}
	}, function(ret, err) {
		if (ret) {
			if(ret.code && (ret.code =='2119' || ret.code =='2122')){		
				global.setToast(ret.message);
				api.sendEvent({
			   	   name:'invalidTokenEvent'
		    	});
			}else{			
				if(ret.availableTimes){
					times = ret.availableTimes;
					chanceType = ret.type;
				}
				if(actStatus==1){
					$api.removeCls($api.byId('opportunity'), 'hide');
					$api.html($api.byId('times'), times);
				}
				
				loadTimesFlag = true;
			}
		}else{//无记录
			times = 0;
			//forbid();
			loadTimesFlag = true;
		}
	});

}

function bindData(data) {
	var gifts = [];
	var list = data.list;

	title = data.name;
	summary = data.subTitle;	

	for (var i in list) {
		turnplate.restaraunts.push(list[i].prizeName);
		turnplate.indexs.push(list[i].id);
		//turnplate.imgs.push(list[i].prize.imgurl);

		var ran = i%4;
		turnplate.colors.push(defaultColors[ran]);

		if(list[i].type !==3){
			gifts.push("<p>"+list[i].name+":"+list[i].prizeName+"</p>");
		}

	}

	$api.html($api.byId('prizeDiv'), gifts.join(''));

	showData(data);
	drawRouletteWheel(); 

	loadWheelFlag = true;
}

function showData(data){
	if(data){
		$api.html($api.byId('contentDiv'), data.content);

		actStatus = data.status;

		if(data.status==0){//活动未开始

			$api.attr($api.byId('lottery'), 'src', '../../image/activity/prize/turnplate-pointer-notbegin.png');

			forbid();
		}else if(data.status==-1){//活动已结束
			$api.attr($api.byId('lottery'), 'src', '../../image/activity/prize/turnplate-pointer-end.png');
			forbid();
		}
	}

	if(global.isValidUser()){
		availableTimes();
	}
}

//次数用完
function timesUsed(){
	if(times<=0){
		$api.removeCls($api.byId('timesUsedDiv'), 'hide');
		$api.removeCls($api.byId('backdropDiv'), 'hide');

		if(chanceType==1){
			$api.html($api.byId('timesUsedRemark'), '今天抽奖次数已经用完，请明天再来！');
		}else if(chanceType==3){
			$api.html($api.byId('timesUsedRemark'), '本周抽奖次数已经用完，请下周再来！');
		}else if(chanceType==4){
			$api.html($api.byId('timesUsedRemark'), '本月抽奖次数已经用完，请下月再来！');
		}else{
			$api.html($api.byId('timesUsedRemark'), '您的抽奖次数已经用完！');			
		}		
	
		return false;			
	}
	return true;
}

//隐藏弹出框
function hiddenDialog(divId){
	$api.removeCls($api.byId('bodyRoll'), 'bodyrollh');
	$api.addCls($api.byId(divId), 'hide');
	$api.addCls($api.byId('backdropDiv'), 'hide');	
}

//弹出框
function popup(divId){
	$api.addCls($api.byId('bodyRoll'), 'bodyrollh');
	$api.removeCls($api.byId(divId), 'hide');
	$api.removeCls($api.byId('backdropDiv'), 'hide');	
}


function lottery(prizeId){

	//if(turnplate.bRotate)return;
	//turnplate.bRotate = !turnplate.bRotate;
	//获取随机数(奖品个数范围内)
	var item = prizeId;
	//奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
	rotateFn(item, turnplate.restaraunts[item-1]);
}

//点击抽奖
function showClick(){

	if (!global.isValidUser()) {

		$api.addCls($api.byId('bodyRoll'), 'bodyrollh');
		$api.removeCls($api.byId('loginDiv'), 'hide');
		$api.removeCls($api.byId('loginDiv'), 'hide');

		return;
	}

	if( !(loadWheelFlag && loadTimesFlag)){
		global.setToast('数据加载中,请稍后');
		return;
	}
	
	if(turnplate.bRotate) return;
	if(!timesUsed()) return;

	turnplate.bRotate = true;

		api.ajax({
			method : 'post',
			cache : false,
			dataType : 'json',
			returnAll : false,
			url : global.getRequestUri() + '/prize-draw/award',
			headers : global.getRequestToken(),
			data : {
				values : {
					'activityInstanceId' : activityInstanceId
				}
			}
		}, function(ret, err) {
			if (ret) {
				if (ret.code) {

					//forbid();
					global.setToast(ret.message);
					turnplate.bRotate = false;
				} else {
					
					prizeType = ret.prizeType;
					prizeName = ret.prizeName;
					times = ret.availableTimes;		

					$api.removeCls($api.byId('opportunity'), 'hide');
					$api.html($api.byId('times'), times);

					var index = turnplate.indexs.indexOf(ret.prizeInstanceId);

					lottery(index+1);
				}
			} else {
				turnplate.bRotate = false;
				global.setErrorToast();
			}
		});	
}

function forbid(){
	var lottery = $api.byId('lottery');
	$api.removeAttr(lottery, 'onclick');
}

function drawRouletteWheel() {    
  var canvas = $api.byId('wheelcanvas');    
  if (canvas.getContext) {
	  //根据奖品个数计算圆周角度
	  var arc = Math.PI / (turnplate.restaraunts.length/2);
	  var ctx = canvas.getContext("2d");
	  //在给定矩形内清空一个矩形
	  ctx.clearRect(0,0,422,422);
	  //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
	  ctx.strokeStyle = "#FFBE04";
	  //font 属性设置或返回画布上文本内容的当前字体属性
	  ctx.font = '22px Microsoft YaHei';      
	  for(var i = 0; i < turnplate.restaraunts.length; i++) {       
		  var angle = turnplate.startAngle + i * arc;
		  ctx.fillStyle = turnplate.colors[i];
		  ctx.beginPath();
		  //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
		  ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);    
		  ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
		  ctx.stroke();  
		  ctx.fill();
		  //锁画布(为了保存之前的画布状态)
		  ctx.save();   
		  
		  //----绘制奖品开始----
		  ctx.fillStyle = "#E5302F";
		  var text = turnplate.restaraunts[i];
		  var line_height = 17;
		  //translate方法重新映射画布上的 (0,0) 位置
		  ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius);
		  
		  //rotate方法旋转当前的绘图
		  ctx.rotate(angle + arc / 2 + Math.PI / 2);
		  
		  /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
		  if(text.length>8){//奖品名称长度超过一定范围 
			  text = text.substring(0,8)+"||"+text.substring(8);
			  var texts = text.split("||");
			  for(var j = 0; j<texts.length; j++){
				  ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
			  }
		  }else{
			  //在画布上绘制填色的文本。文本的默认颜色是黑色
			  //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
			  ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
		  }
		  
		//添加对应图标
	/*	var img = new Image();
		//img.src = global.getImgUri()+turnplate.imgs[i];

		img.src = '../../image/activity/prize/prize-package.png';

	    img.onload=function(){  
		  ctx.drawImage(img,i*25,100);      
	    }; 
	    ctx.drawImage(img,i*25,100);  */

		 //把当前画布返回（调整）到上一个save()状态之前 
		 ctx.restore();
		 //----绘制奖品结束----
	  }     
  } 
}

//旋转转盘 item:奖品位置; txt：提示语;
function rotateFn(item, txt){

 	var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
		
	if(angles<270){
		angles = 270 - angles; 
	}else{
		angles = 360 - angles + 270;
	}

	$('#wheelcanvas').stopRotate();

	$('#wheelcanvas').rotate({
		angle:0,
		animateTo:angles+1800,
		duration:4000,
		callback:function (){
			gift(txt);
			turnplate.bRotate = !turnplate.bRotate;
		
		}
	});
}

function getRandomNum(Min,Max){   
	var Range = Max - Min;   
	var Rand = Math.random();   
	return(Min + Math.round(Rand * Range));   
}   

function gift(txt){
	if(prizeType!=3){//中奖
		popup('giftDiv');

		$api.html($api.byId('giftWard'), '恭喜您获得'+prizeName);
		$api.html($api.byId('giftName'), txt);

	}else{
		popup('thanksDiv');
		$api.html($api.byId('giftName'), txt);
	}
}

//活动说明显示
function activityRemark(){
	$api.removeCls($api.byId('actContentDiv'), 'hide');
	$api.addCls($api.byId('bodyRoll'), 'bodyrollh');
	$api.removeCls($api.byId('backdropDiv'), 'hide');	
}

//我的奖品
function myPrize(){
	var header = '../common/header';
	var	params = { "page" : "../member/myPrize", "title" : "我的奖品"};

	if (!global.isValidUser()) {
		params = {  "title" : "登录" };
		global.openWinName('loginWin', '../member/login', params);
		return;
	}else{
		global.openWinName('myPrizeWin', header, params);
	}
}

//活动说明隐藏
function contentClose(){
	$api.addCls($api.byId('actContentDiv'), 'hide');
	$api.removeCls($api.byId('bodyRoll'), 'bodyrollh');
	$api.addCls($api.byId('backdropDiv'), 'hide');		
}

//登录	
function login(){
	hiddenDialog('loginDiv');

	var params = {  "title" : "登录" };
	global.openWinName('loginWin', '../member/login', params);
	
	return;
}



function share(){
	$api.addCls($api.byId('shareDiv'), 'share-acin');
	$api.removeCls($api.byId('shareDiv'), 'hide');
	$api.removeCls($api.byId('buybackdrop'), 'hide');
}

function closeShare(){
	$api.removeCls($api.byId('shareDiv'), 'share-acin');
	//$api.addCls($api.byId('shareDiv'), 'share-acout');
	$api.addCls($api.byId('shareDiv'), 'hide');
	$api.addCls($api.byId('buybackdrop'), 'hide');
}

function shareQzone(shareType) {
	var qq = api.require('qq');
	
	qq.installed(function(ret, err) {
		if (ret.status) {
			qq.shareNews({
				url : global.getShareUri() + '/views/activity/activity_detail.html?id=' + activityInstanceId,
				title : title,
				description : summary,
				//imgUrl : imgUrl,
				imgUrl : global.getShareUri() + '/images/contact-logo.jpg',
				type : shareType
			},function(ret, err) {
				if (ret.status) {
			
				} else {
					global.setToast('分享失败');
				}
			});
		} else {
			global.setToast('当前设备未安装QQ客户端');
		}
	});
}

function shareWx(shareType) {
	var wx = api.require('wx');
	wx.isInstalled(function(ret, err) {
		if (ret.installed) {
			wx.shareWebpage({
				scene : shareType,
				title : title,
				description : summary,
				thumb : 'widget://image/icon.png',
				contentUrl :  global.getShareUri() + '/views/activity/activity_detail.html?id=' + activityInstanceId,
			}, function(ret, err) {
				if (ret.status) {
					
				} else {
					global.setToast('分享失败');
				}
			});
		} else {
			global.setToast('当前设备未安装微信客户端');
		}
	});
}