
apiready = function(){
    initEvent();
	queryList();
}
    
function queryList() {
    var url = global.getRequestUri() + '/orgmember/getOrgMemberByPage';
    var params = '?start=0&maxResults=10';

    page.init(10, 'removeMember-content', 'removeMember-template', url, params, true, '');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        queryList();
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

function showMessage(){
    if($api.hasCls($api.byId('confirmDiv'), 'hide')){
        $api.removeCls($api.byId('confirmDiv'), 'hide');
        $api.removeCls($api.byId('confirmDropDiv'), 'hide');
    }else{
        $api.addCls($api.byId('confirmDiv'), 'hide');
        $api.addCls($api.byId('confirmDropDiv'), 'hide');
    }
}

function cancel(){
	$api.addCls($api.byId('confirmDiv'), 'hide');
    $api.addCls($api.byId('confirmDropDiv'), 'hide');
}

function delMember(){
	var ids =[];
	var r=document.getElementsByName("removeMember");
    for(var i=0;i<r.length;i++){
         if(r[i].checked){
        	 ids.push(r[i].value);
       }
    }  
    
    if(!ids || ids.length <1){
    	global.setToast("请选择要移除的成员");

    	return;
    }

    cancel();

    api.showProgress({
        title: '移除成员中...',
        modal: false
    });

    api.ajax({
        method : "post",
        url : global.getRequestUri() + "/orgmember/removeMember",
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        data : {
            values : {
                'memberIds' : ids.join(',')
            }
        }
    }, function(ret, err) {
        api.hideProgress();
        if(ret){
            if(ret.success){
                global.setToast("移除成员成功");
                queryList();
            }else{
                global.setToast(ret.message);             
            }
        }else{
            global.setToast("移除成员失败");
        }
        
    });
}