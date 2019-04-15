var UIMultiSelector = null;
apiready = function() {

	var cityName = api.pageParam.cityName;

	UIMultiSelector = api.require('UICityList');

	selectArea(cityName);	
};


function selectArea(name) {
	
		UIMultiSelector.open({
			 rect: {
		        y: 0,
		        h: api.frameHeight
		    },
			//resource :'widget://script/data/UICityList.json',
			resource :'widget://res/UICityList.json',
			styles : {
				searchBar: {                    //（可选项）JSON对象；顶部搜索条的样式
		       	 	bgColor: '#f0f0f0',         //（可选项）字符串类型；搜索条背景色，支持 rgb、rgba、#；默认：'#696969'
		       	 	cancelColor: '#E3E3E3'      //（可选项）字符串类型；取消文字颜色，支持 rgb、rgba、#，默认：'#E3E3E3'；在安卓平台上不显示取消按钮，所以，此参数只在iOS平台有效
			    },
			    location: {                     //（可选项）JSON对象；定位提示文字样式
			        color: '#666',           //（可选项）字符串类型；定位提示文字颜色，支持 rgb、rgba、#，默认：'#696969'
			        size: 12                    //（可选项）数字类型；定位提示文字大小，默认：12.0
			    },
			    sectionTitle: {                 //（可选项）JSON对象；标题的样式
			        bgColor: '#eee',            //（可选项）字符串类型；标题的背景色，支持 rgb、rgba、#；默认：'#EEEEEE'
			        color: '#333333',              //（可选项）字符串类型；标题文字颜色，支持 rgb、rgba、#；默认：'#000000'
			        size: 12,                   //（可选项）数字类型；标题文字大小；默认：12.0
			        height: 25                  //（可选项）数字类型；区域标题的高度，默认：25.0
			    },
			    item: {                         //（可选项）JSON对象；列表项的样式
			        bgColor: '#fff',            //（可选项）字符串类型；列表项的背景色，支持 rgb、rgba、#；默认：'#FFFFFF'
			        activeBgColor: '#ccc',   //（可选项）字符串类型；列表项按下时的背景色，支持 rgb、rgba、#；默认：'#696969'
			        color: '#333',              //（可选项）字符串类型；列表项的文字颜色，支持 rgb、rgba、#，默认：'#000000'
			        size: 13,                 //（可选项）数字类型；列表项的文字大小，默认：14.0
			        height: 40                  //（可选项）数字类型；列表项的高度，默认：40.0
			    },
			    indicator: {                    //（可选项）JSON对象；右侧字母导航条样式
			        bgColor: '#fff',            //（可选项）字符串类型；字母导航条背景色，支持 rgb、rgba、#，默认：'#FFFFFF'
			        color: '#666'            //（可选项）字符串类型；字母导航条字母颜色，支持 rgb、rgba、#，默认：'#696969'
			    }
			},
			currentCity : name,
			locationWay :'当前区域',
			hotTitle: '热门城市',
			fixedOn: api.frameName,
			placeholder: '输入城市名或首字母查询'
		}, function(ret, err) {
			if (ret) {
				
				if (ret.eventType === 'selected') {
					ajaxSelect(ret.cityInfo.id,ret.cityInfo.city);
				}
				
			} else {
				global.setErrorToast();
			}
		});		
		
	function ajaxSelect(id,name) {
		
		api.sendEvent({
			name : 'citySelectorEvent',
			extra : {
				cityName : name,
				cityId : id
			}
		});	
		
		//UIMultiSelector.close();
		api.closeWin();
	}
}

