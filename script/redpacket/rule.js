function switchDiv(id){
    if(id === 1){
        $api.addCls($api.byId('receiveRuleLi'), 'active');
        $api.removeCls($api.byId('receiveRuleDiv'), 'hide');

        $api.removeCls($api.byId('sendRuleLi'), 'active');
        $api.addCls($api.byId('sendRuleDiv'), 'hide');
    }else{
        $api.addCls($api.byId('sendRuleLi'), 'active');
        $api.removeCls($api.byId('sendRuleDiv'), 'hide');

        $api.removeCls($api.byId('receiveRuleLi'), 'active');
        $api.addCls($api.byId('receiveRuleDiv'), 'hide');
    }
}
