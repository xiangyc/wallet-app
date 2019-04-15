function openOrganDetail2(id){
	var param = { title : "邀请好友", page : "../partner/invitationOrgan", id : id};
	global.openWinName("invitationOrgan","../common/header", param);
}

function openYesterdayAward2(){
	var param = { title : "昨日收益", page : "../partner/yesterdayAward"};
	global.openWinName("yesterdayAward","../common/header", param);
}

function openOrganAchieve2(index){
	var param = { title : "奖励", page : "../partner/organAchieveDetail", index : index };
	global.openWinName("organAchieveDetail","../common/header", param);
}

function openSplit(){
	var param = { title : "分账", page : "../partner/splitDetails" };
	global.openWinName("splitDetails","../common/header", param);
}

function openManage2(){
	var url= "http://192.168.4.81/html/partner/organManage.html";
    
    global.openH5Win("mainAccount","../common/h5_header", url, '机构管理');
}

function openBussion2(){
	var param = { title : "机构业绩", page : "../partner/organAchieve"};
	global.openWinName("organAchieve","../common/header", param);
}