(function(window){
    var p = {};

    var pageSize = 10;
    var pageNo = 1;
    var pageCount = 0;
    var contentId = '';
    var templateId = '';
    var noRecordsId = '';
    var requestUrl = '';
    var requestData = '';
    var hasRows = true;
    var headerData = '{}';
	
    function getData(currentPage, reload){
        api.showProgress({
            title: '数据加载中...',
            modal: false
        });

        pageNo = reload ? 1 : currentPage;
        api.ajax({
            url: requestUrl + requestData,
            method: 'get',
            timeout: 30,
            dataType: 'json',
            headers: global.getRequestToken(),
            returnAll: false
        },function(ret,err){
            api.hideProgress();
            if (ret) {
            	api.sendEvent({
			        name: 'pageCallSuccessEvent'			         
			    });
    
            	if(reload && ((hasRows && ret.recordCount === 0) || ret.length === 0) && noRecordsId){
            		/*api.toast({
	                    msg: '没有查询到数据',
	                    duration:2000,
	                    location: 'middle'
                	});*/
                	$api.html($api.byId(contentId), '');
                	$api.removeCls($api.byId(noRecordsId), 'hide');
                	return;
            	}
            	
            	if(hasRows){
	                if(ret.recordCount % pageSize == 0){
	                	pageCount = eval(ret.recordCount / pageSize);
	                }else{
	                	pageCount = Math.ceil(eval(ret.recordCount / pageSize));
	                }
	                
	                if(reload){
	                    $api.setStorage("currentPage", 1); 
	                }
                }

                var content = $api.byId(contentId);
                var template = $api.byId(templateId).text;
                var tempFun = doT.template(template);
                var data = hasRows ? ret.items : ret;
		        if (data) {
                	if(reload){
                		content.innerHTML = tempFun(data);
               	    }else {
                        //添加判断，判断是否已加载
                        //代码实现……
                        
                        content.innerHTML = content.innerHTML + tempFun(data);
                    }
                }else if(reload){
                    content.innerHTML = '';
                }
            }else {
                 api.toast({
                    msg: '加载数据异常',
                    duration:2000,
                    location: 'middle'
                });
            }
        });
    }

    p.setRequestData = function(params){
        if(params == ""){
            return;
        }

        requestData = params;
        getData(1, true);
    }

    p.init = function(pageRecord, contId, tempId, url, params, isRows, noId){
        /*if(!$api.isElement(contentId)){
            alert('非元素');
            return;
        }
        if(!$api.isElement(templateId)){
            alert('非元素');
            return;
        }*/

        pageSize = pageRecord < 1 ? 10 : pageRecord;
        contentId = contId;
        templateId = tempId;
        requestUrl = url;
        requestData = params;
        hasRows = isRows;
        noRecordsId = noId;
        
    	if(noRecordsId){
			$api.addCls($api.byId(noRecordsId), 'hide');
		}
            	
        getData(1, true);
    }

    p.scrollRefresh = function(){
        var currentPage = parseInt($api.getStorage("currentPage"));
        if(noRecordsId && pageCount > 0){
            $api.addCls($api.byId(noRecordsId), 'aui-hide');
        }

        if(currentPage + 1 <= pageCount){
            requestData = requestData.replace('start=' + eval((currentPage - 1) * pageSize), 'start=' + eval(currentPage * pageSize));
            //requestData = requestData.replace('start=' + eval(currentPage - 1), 'start=' + eval(currentPage));
            currentPage = currentPage + 1;
            $api.setStorage("currentPage", currentPage);

            getData(currentPage, false);
        }else if(noRecordsId && currentPage === pageCount && $api.html($api.byId(contentId)).length < 1){
            $api.removeCls($api.byId(noRecordsId), 'aui-hide');
        }
    }

    window.page = p;
})(window);