/**
 * Created by Yao on 2018/12/28.
 */
var searchCon;
var maxResults = 10;
var url = global.getRequestUri() + '/shop-product/searchRecord';
apiready = function(){
    historyList();

    $("#searchValue").bind("input propertychange",function(){
        validateValue();
    });

    if (api.systemType === 'ios'){
        var softInput = api.require('softInputMgr');
        document.getElementById("searchValue").focus();
        softInput.toggleKeyboard();
    }else{
        setTimeout(function(){
            var softInput = api.require('softInputMgr');
            document.getElementById("searchValue").focus();
            softInput.toggleKeyboard();
        }, 100);
    }

    initEvent();
};
function initEvent(){
    api.addEventListener({
        name:'proListSuccessEvent'
    },function(ret,err){
        // $api.val($api.byId("searchValue"),'');
        historyList();
    });
}
/**
 * 显示/隐藏 删除搜索内容按钮
 */
function validateValue(){

    if (!validate.isEmpty($api.val($api.byId("searchValue")))){
        $api.removeCls($api.byId("searchClose"),'hide');
    }else{
        $api.addCls($api.byId("searchClose"),'hide');
    }
}
/**
 * 删除搜索内容
 */
function cleanInput(){
    $api.addCls($api.byId("searchClose"),'hide');
    $api.val($api.byId("searchValue"),'');
    if (api.systemType === 'ios'){
        document.getElementById("searchValue").focus();
    }else{
        setTimeout(function(){
            document.getElementById("searchValue").focus();
        }, 100);
    }
}
/**
 * 搜索
 * @param key
 */
function searchBegin(){

    searchCon = $api.val($api.byId("searchValue"));

    if(searchCon.match(/^\s+$/)){
        global.setToast('请输入关键字搜索');
        return;
    }

    if (validate.isEmpty(searchCon)){
        global.setToast('请输入搜索内容');
    }else{
        openProListWin($api.trimAll(searchCon));
    }

}


function openProListWin(searchCon){
    var header = '../common/search_header';
    var params =  { "page" : "../product/proList", "key" : searchCon};

    //global.openWinName('proListWin', header, params);
    api.openWin({
        name : "searchResultWin",
        reload : true,
        url : header + '.html',
        pageParam : params
    });

}


/**
 * 搜索历史记录
 * @param key
 */
function historyList() {
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        url : global.getRequestUri() + '/shop-product/searchRecord'
    }, function(ret) {

        if(global.isValidUser()) {
            if(ret){
                $api.removeCls($api.byId('searchHistory'),'hide');
                var str="";
                for(var i=0;i<ret.length;i++){
                    var historyCon = ret[i];
                    str += '<li onclick="openProListWin(\'' + historyCon + '\')"><a>' + historyCon + '</a></li>';
                }

                $api.html($api.byId('historyList-content'), str);
               
            }else {
                $api.addCls($api.byId('searchHistory'),'hide');
            } 
        } else {
            $api.addCls($api.byId('searchHistory'),'hide');
        }
            
    });
}

/**
*删除历史记录
*/
function clearHistory(){
    $api.removeCls($api.byId("clearHistoryCon"),'hide');
    $api.removeCls($api.byId("clearHistoryConDiv"),'hide');
}
/**
 * 确定删除历史记录
 */
function sureDelete(){
    api.ajax({
        method : 'get',
        cache : false,
        dataType : 'json',
        returnAll : false,
        headers : global.getRequestToken(),
        url : global.getRequestUri() + '/shop-product/searchRecord/clear'
    }, function(ret) {
        if(ret && ret.success){
            $api.addCls($api.byId('searchHistory'),'hide');
            if (api.systemType === 'ios'){
                document.getElementById("searchValue").focus();
            }else{
                setTimeout(function(){
                    document.getElementById("searchValue").focus();
                }, 100);
            }
        }
        cancelDelete();
    });
}

/**
 * 取消删除历史记录
*/
function cancelDelete(){
    $api.addCls($api.byId("clearHistoryCon"),'hide');
    $api.addCls($api.byId("clearHistoryConDiv"),'hide');
}