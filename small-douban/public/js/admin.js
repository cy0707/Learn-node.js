// 利用ajax对后台电影进行删除
$(function(){
  $('.del').on('click', function(event) {
    // 获取目标元素的id
    const target = $(event.target);
    // 自定义的id属性
    const targetId = target.data('id');
    // 获取tr元素
    const tr = $('.item-id-' + targetId);

    $.ajax({
      url: '/admin/list?id=' + targetId,
      type: 'DELETE'
    })
    .done(function(result) {
      // 如果后台返回的1,这请求成功
      console.log(result.success);
      if (result.success === 1) {
        // 如果tr存在的话
        if (tr.length > 0) {
          // 移除掉这个节点
          tr.remove();
        }
      }
    })
    .fail(function() {
      console.log('error');
    });
    
  });
})