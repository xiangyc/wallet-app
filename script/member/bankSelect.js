apiready = function() {

   api.readFile({
        path : 'widget://res/UIBankList.json'
    }, function(ret, err) {
        if (ret) {
        
            var template = $api.byId('bankList-template').text;
            var tempFun = doT.template(template);
            var jsonObject = eval("(" + ret.data + ")");

            $api.html($api.byId('bankList-content'), tempFun(jsonObject));
        }
    });
}

function selectBank(bankId, bankName) {
	api.sendEvent({
	    name:'bankSelect',
		extra: {
        	id: bankId,
        	text: bankName
   		}
    });
}
