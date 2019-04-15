/**
 * Created by Yao on 2018/6/7.
 */
// var validateStr = '';
// var numEricId = '';
$(function(){
    //填写信息
    $('.infor-sub').click(function(e){
        $('.layer').hide();
        $('.form').hide();
        e.preventDefault();		//阻止表单提交
    });
    // 监听#div内容变化，改变支付按钮的颜色
    $('#div').bind('DOMNodeInserted', function(){
        if($("#div").text()!="" || $("#div").text()>'0'){
            $('.submit').removeClass('active');
            $('.submit').attr('disabled', false);
        }else{
            $('.submit').addClass('active');
            $('.submit').attr('disabled', true);
        }
    });
    $('#div').trigger('DOMNodeInserted');

    $('.shuru').click(function(e){
        $('.layer-content').animate({
            bottom: 0
        }, 200);
        $('.layer-content').removeClass('hide');

        // $("input[name='payPassword_rsainput']").focus();
        $('.mui-haveTitle').animate({
            top: '22%'
        }, 400);
        e.stopPropagation();
    });
    $('.wrap').click(function(){
        $('.layer-content').animate({
            bottom: '-256px'
        }, 200);
        $('.mui-haveTitle').animate({
            top: '50%'
        }, 400);
    });
    // $('.closeWrap').click(function(){
    //     $('.layer-content').animate({
    //         bottom: '-256px'
    //     }, 200);
    //     $('.mui-haveTitle').animate({
    //         top: '50%'
    //     }, 400);
    // });

    // $('.form_edit_left .num').click(function(){
    //     var numEricHtml = this.innerHTML;
    //     callbackAddNumEric(numEricHtml,numEricId);
    // });

    // $('#remove').click(function(){
    //     callbackRemoveNumEric(numEricId);
    //     });

    // $('#beSure').click(function(){
    //     callbackBeSure(numEricId);
    // })
});

// function setNumEricId(id){
//     numEricId =id;
// }