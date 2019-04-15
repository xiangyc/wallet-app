var url = global.getRequestUri() + '/coupon-records/couponCategorys';

apiready = function(){
	queryCouponRuleList();
}

function queryCouponRuleList() {
	page.init(10, 'rule-content', 'rule-template', url, '', false, '');
}
