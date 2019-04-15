
function loginSuccess(ret){
		
	if(ret.obj.member){//新登录，带设备id验证安全性
		loginSuccessNew(ret);
	}else{
		loginSuccessOld(ret);
	}
    
}

function loginSuccessOld(ret){
	var token = ret.message.split("_");
	if(token && token.length > 1){
		global.setToken(token[0]);
		global.setKey(token[1]);
	}

	global.setTokenExpires(ret.code);
	global.setUserMobile(ret.obj.hideMobile);
	global.setUserName(ret.obj.hideName);
	global.setUserIdCard(ret.obj.hideIdCard);
	global.setUserPayPassword(ret.obj.payPwdFlag);
	global.setUserBindCard(ret.obj.verifiedFlag);
	global.setMemberId(ret.obj.securityMemberId);
	// global.setReadNoticeTime(ret.obj.nickName);
	// global.setPublishTime(ret.obj.email);
	global.setSecurityMobile(ret.obj.securityMobile);
	
	if(ret.obj.recommend && ret.obj.recommend.hideMobile){
		global.setRecommentMobile(ret.obj.recommend.hideMobile);
	}
	if(ret.obj.recommend && ret.obj.recommend.hideName){
		global.setRecommentName(ret.obj.recommend.hideName);
	}
	
	global.setInviterCode(ret.obj.recommendCode);

	if(ret.obj.organizationMember){
		global.setOrgRole(ret.obj.organizationMember.orgRole);
	}

	if(ret.obj.organizationMember && ret.obj.organizationMember.org){
		global.setOrgActivationStatus(ret.obj.organizationMember.org.status);
	}

	// if(ret.obj.idCard){
	// 	global.setUserIdCard(ret.obj.idCard);
	// }

	if(ret.obj.thirdpartyAccount){
		global.setNickName(ret.obj.thirdpartyAccount.nickName);
		global.setAvatar(ret.obj.thirdpartyAccount.avatar);
	}
    
}

function loginSuccessNew(ret){

	global.setToken(ret.obj.token);
	global.setKey(ret.obj.key);

	global.setTokenExpires(ret.obj.expire);
	global.setUserMobile(ret.obj.member.hideMobile);
	global.setUserName(ret.obj.member.hideName);
	global.setUserIdCard(ret.obj.member.hideIdCard);
	global.setUserPayPassword(ret.obj.member.payPwdFlag);
	global.setUserBindCard(ret.obj.member.verifiedFlag);
	global.setMemberId(ret.obj.member.securityMemberId);
	// global.setReadNoticeTime(ret.obj.member.nickName);
	// global.setPublishTime(ret.obj.member.email);
	global.setSecurityMobile(ret.obj.member.securityMobile);
	
	if(ret.obj.member.recommend && ret.obj.member.recommend.hideMobile){
		global.setRecommentMobile(ret.obj.member.recommend.hideMobile);
	}
	if(ret.obj.member.recommend && ret.obj.member.recommend.hideName){
		global.setRecommentName(ret.obj.member.recommend.hideName);
	}
	
	global.setInviterCode(ret.obj.member.recommendCode);

	if(ret.obj.member.organizationMember){
		global.setOrgRole(ret.obj.member.organizationMember.orgRole);
	}

	if(ret.obj.member.organizationMember && ret.obj.member.organizationMember.org){
		global.setOrgActivationStatus(ret.obj.member.organizationMember.org.status);
	}

	// if(ret.obj.member.idCard){
	// 	global.setUserIdCard(ret.obj.member.idCard);
	// }

	if(ret.obj.member.thirdpartyAccount){
		global.setNickName(ret.obj.member.thirdpartyAccount.nickName);
		global.setAvatar(ret.obj.member.thirdpartyAccount.avatar);
	}
    
}

function loginSuccessEvent(){
	api.sendEvent({
        name: 'loginRefresh',
         extra: {
        	optSrc: 'login',
        	frameIndex : frameIndex
   		}
    });

	setTimeout(function(){
		api.closeWin();
      
    }, 300);

}
