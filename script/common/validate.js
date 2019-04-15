(function(window) {
	var v = {};

	v.isEmpty = function(param) {
		if (param.length < 1) {
			return true;
		}

		return false;
	}

	v.passwordLength = function(param) {
		if (param.length < 6 || param.length > 20) {
			return false;
		}

		return true;
	}

	v.passwordRule = function(param) {
		if (!/[a-zA-Z]/.test(param) || !/\d/.test(param)) {
			return false;
		}

		if (/[\u4E00-\u9FA5]/i.test(param)) {
			//alert('有中文');
			return false;
		}

		return true;
	}

	v.payPasswordRule = function(param) {
		if(v.isEmpty(param)){
			return false;
		}
		if(param.length !=6){
			return false;
		}

		if(!v.integer(param)){
			
			return false;
		}

		return true;
	}


	v.passwordCompare = function(param1, param2) {
		if (param1 != param2) {
			return false;
		}

		return true;
	}

	v.mobile = function(param) {
		// var phoneRegExp = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
		// if (!phoneRegExp.test(param)) {
		// 	return false;
		// }

		// return true;
		if(v.isEmpty(param)){
			return false;
		}
		if(param.length !=11){
			return false;
		}

		if(!v.integer(param)){
			
			return false;
		}

		return true;
	}

	v.email = function(param) {
		var emailExp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if (!emailExp.test(param)) {
			return false;
		}

		return true;
	}
	
	v.amount = function(param){
		if (!/^\d+(\.\d{2})?$/.test(param)) {
			return false;
		}
		
		return true;
	}

	v.idCard = function(param){
		if (!/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(param)) {
			return false;
		}
		
		return true;
	}

	v.buyNumber = function(param){
		if (!/^[0-9]+([.]{1}[0-9]{1,3})?$/.test(param)) {
			return false;
		}
		
		return true;
	}
	
	v.number = function(param){
		if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(param)) {
			return false;
		}
		
		return true;
	}

	v.money = function(param){
		var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
	  
	     if (reg.test(param)) {// alert("正确~");
	         return true;
	     }else{// alert("有误~");
	         return false;
	     }
	}

	v.integer = function(param){
		if (!/^[0-9]*[1-9][0-9]*$/.test(param)) {
			return false;
		}
		
		return true;
	}

	v.postCode = function(param){
		if (!/^[1-9][0-9]{5}$/.test(param)) {
			return false;
		}
		
		return true;
	}

	window.validate = v;
})(window); 