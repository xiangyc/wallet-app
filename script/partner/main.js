function openUpgradeRule(){
	var url= h5UrlUpgradeRule;
    global.openH5Win("openManage","../common/h5_header", url, '合伙人规则');
}

function openGrowthDetails(){
	var param = { title : "成长值明细", page : "../partner/growthDetails"};
	global.openWinName("growthDetails","../common/header", param);
}

function openPersonalAchieve(index){
	var param = { title : "我的业绩", page : "../partner/personalAchieve", index : index};
	global.openWinName("personalAchieve","../common/header", param);
}

function openActivityDescription(){
	var param = { title : "活动说明", page : "../partner/activityDescription"};
	global.openWinName("activityDescription","../common/header", param);
}

function openOrganDetail(id){
	var param = { title : "机构详情", page : "../partner/organDetail", id : id};
	global.openWinName("organDetail","../common/header", param);
}

function openOrganList(){
	var param = { title : "机构列表", page : "../partner/organList"};
	global.openWinName("organList","../common/header", param);
}

function openRankingList(){
	var param = { title : "邀请达人榜", page : "../partner/rankingList"};
	global.openWinName("rankingList","../common/header", param);
}

function codeShare(){

}

function share(){

}
