
var keyword='';

apiready = function(){
    initEvent();
    list();
}
    
function list() {
    var url = global.getRequestUri() + '/orgmember/getOrgMemberByPage';
    var params = '?start=0&maxResults=10&keyword='+keyword;

    page.init(10, 'splitSearch-content', 'splitSearch-template', url, params, true, 'no-records');
}

function initEvent(){
    api.setCustomRefreshHeaderInfo({
        bgColor: '#f8f8f8',
        image: {
            pull: global.pullImage(),
            load: global.loadImage()
        }
    }, function(ret, err) {
        list();
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

function inputSearch(){
  keyword =  $api.val($api.byId('keyword'));
    if(keyword && keyword.length >0){
     
     //  $api.addCls($api.byId('searchCharId'), 'mui-active');
    }else{
      $api.removeCls($api.byId('searchCharId'), 'mui-active');
    }

    $api.html($api.byId('splitSearch-content'), '');

    list() ;
}

function search(){     
    $api.addCls($api.byId('searchCharId'), 'mui-active');  
    $api.byId('keyword').focus(); 

}

function split(orgId, memberId, memberName, mobile){
   var url= h5UrlSplite+"?memberId="+memberId+"&name="+encodeURIComponent(memberName)+"&mobile="+mobile;
  
   global.openH5Win("openSplit","../common/h5_common_header", url, '分账');

}
