var clickNum =0;
var h;
apiready = function(){
    initEvent();

    var header = $api.byId('header');
    if(header){
        $api.fixIos7Bar(header);
    }

    $api.html($api.byId('title'), api.pageParam.title);

    var pos = $api.offset(header);
    var $body = $api.dom('body');
    var body_h = $api.offset($body).h;
    var rect_h = body_h - pos.h;
    h = pos.h;
	
    api.openFrame({
        name: 'organAchieveFrame',
        url: api.pageParam.page + '.html',
        rect:{
            x: 0,
            y: pos.h,
            w: 'auto',
            h: rect_h
        },
        pageParam : api.pageParam,
        bounces: false,
        vScrollBarEnabled: false
    });
}

function initEvent(){
    api.addEventListener({
        name:'changeOrganAchieve'
    },function(ret,err){
        if(ret && ret.value){
           var type = ret.value.type;
           var title='现有成员';
            if(type ==2){
                title='历史成员';
            }else if(type ==3){
                title='机构';
            }

            $api.html($api.byId('title'),title);

        }
    
    });
 }
    
function show(){
    clickNum++;

    var params = {isShow : clickNum%2};

    api.openFrame({
       name: 'showWin',
       url : 'organAchieveShow.html',
       pageParam : params,
       reload :true,
        rect:{
            x: api.winWidth-72,
            y: h-8,
            w: '72',
            h: '108'
        },
        bounces: false,
        vScrollBarEnabled: false
    });
}

