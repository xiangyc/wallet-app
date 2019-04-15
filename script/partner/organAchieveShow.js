
apiready = function(){

    var isShow = api.pageParam.isShow;
   if(isShow ==1){
         $api.removeCls($api.byId('organManage'), 'hide');
    }else{
      //   $api.addCls($api.byId('organManage'), 'hide');
        api.closeFrame({
            name: 'showWin'
        });
    }
}

function showClick(index){
    $api.addCls($api.byId('organManage'), 'hide');
    api.closeFrame({
        name: 'showWin'
    });
    api.sendEvent({
        name : 'changeOrganAchieve',
        extra : {
            type : index               
        }
    }); 
     
} 

