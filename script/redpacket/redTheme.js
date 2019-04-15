
var id;
var theme;
var text;
var time

apiready = function() {
	//加载数据
	list();
}

function list(){
	var url = global.getRequestUri() + '/envelope/theme?useage=3';//个人红包
	api.ajax({
            url: url,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            returnAll: false,
			headers: global.getRequestToken()
        },function(ret,err){
			if (ret && ret.success) {
				var template = $api.byId('redTheme-template').text;
				var tempFun = doT.template(template);
		      	$api.html($api.byId('redTheme-content'), tempFun(ret.obj));
			}else{
				global.setErrorToast();
			}
     });
}

//选择主题
function selectTheme(code,remark,endtime){
	theme = code;
	text = remark;
	time = endtime;

	api.sendEvent({
	    name:'selectThemeEvent',
	    extra: {
	    	theme: theme,
	    	text: text,
	    	time:time
	    }
    });
}

function browse(id_, code, remark,endtime){
	id = id_;
	theme = code;
	text = remark;
	time = endtime;

	$api.html($api.byId('contentDiv'), "");
	if(code =='newyear'){
		$api.append($api.byId('contentDiv'), '<div class="swiper-slide"><img id="subDetailId1" src="../../image/redpacket/them_newyear/preview-img11.jpg"></div>');
		$api.append($api.byId('contentDiv'), '<div class="swiper-slide"><img id="subDetailId2" src="../../image/redpacket/them_newyear/preview-img12.jpg"></div>');
	}else if(code =='wedding'){
		$api.append($api.byId('contentDiv'), '<div class="swiper-slide"><img id="subDetailId1" src="../../image/redpacket/them_wedding/preview-img21.jpg"></div>');
		$api.append($api.byId('contentDiv'), '<div class="swiper-slide"><img id="subDetailId2" src="../../image/redpacket/them_wedding/preview-img22.jpg"></div>');
	}else{
		$api.append($api.byId('contentDiv'), '<div class="swiper-slide"><img id="subDetailId1" src="../../image/redpacket/them_default/preview-img31.jpg"></div>');
		$api.append($api.byId('contentDiv'), '<div class="swiper-slide"><img id="subDetailId2" src="../../image/redpacket/them_default/preview-img32.jpg"></div>');
	}

	$api.removeCls($api.byId('detailId'), 'hide');
	$api.removeCls($api.byId('backDropId'), 'hide');

	var swiper2 = new Swiper('.swiper-container2', {
        slidesPerView: 1,
        spaceBetween: 30,
        mousewheel: false,
        pagination: {
	      el: '.swiper-pagination',
	    },
    });
}

function use(){
	//发送默认祝福语、克重
	api.sendEvent({
	    name:'selectThemeEvent',
	    extra: {
	    	theme: theme,
	    	text: text,
	    	time:time
	    }
    });
}


function redthemeClose(){

	if($api.hasCls($api.byId('detailId'), 'hide')){
		$api.removeCls($api.byId('detailId'), 'hide');
		$api.removeCls($api.byId('backDropId'), 'hide');
	}else{
		$api.addCls($api.byId('detailId'), 'hide');
		$api.addCls($api.byId('backDropId'), 'hide');
	}
}