var orderId ;
apiready = function(){
    orderId = api.pageParam.id;
 	queryContract(orderId);

}

var pdfDoc = null,
pageNum = 1,
scale = 1.5,
canvas = document.getElementById('the-canvas'),
ctx = canvas.getContext('2d');

//买金合同详情
function queryContract(orderId) {
    api.showProgress({
        title: '数据加载中...',
        modal: false
    });

    var url = global.getRequestUri()+'/contract/'+orderId+"?token="+global.getToken()+"&key="+global.getKey();

    PDFJS.disableWorker = true;

    PDFJS.getDocument(url).then(function getPdfHelloWorld(_pdfDoc) {
      pdfDoc = _pdfDoc;
      renderPage(pageNum);
    },function(error) {
      api.hideProgress();
      global.setToast('合同生成中，请稍后再试');
    });
}

function renderPage(num) {
      api.hideProgress();
      pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(scale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        page.render(renderContext);
      });

      document.getElementById('page_num').textContent = pageNum;
      document.getElementById('page_count').textContent = pdfDoc.numPages;
      $api.removeCls($api.byId('contract'), 'hide');
      $api.removeCls($api.byId('contractDiv'), 'hide');
}

function goPrevious() {
    if (pageNum <= 1)
    return;
    pageNum--;
    renderPage(pageNum);
}

function goNext() {
    if (pageNum >= pdfDoc.numPages)
    return;
    pageNum++;
    renderPage(pageNum);
}

function showOrderDetail(){
      api.closeWin();
      if($api.hasCls($api.byId('contract'), 'hide')){
            $api.removeCls($api.byId('contract'), 'hide');
            $api.removeCls($api.byId('contractDiv'), 'hide');

      }else{
            $api.addCls($api.byId('contract'), 'hide');
            $api.addCls($api.byId('contractDiv'), 'hide');
      }
}