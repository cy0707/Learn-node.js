// 评论的叠加
$(function(){
  $('.comment').on('click', function(event) {
    const target = $(this);
    const toId = target.data('tid'); 
    // 评论人的id 
    const commentId = target.data('cid'); 
    //这一条评论的id

    if ($('#toId').length > 0) {
      $('#toId').val(toId);
    } else {
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId
      }).appendTo('#commentForm');
    }

    // 点击一个头像进行评论，如果点击头像
    // 两次的话，那么就选择第二次
    if ($('#commentId').length > 0) {
      $('#commentId').val(commentId);
      // 第二次不插入---只改变其值
    } else {
      $('<input>').attr({
        type: 'hidden',
        id: 'commentId',
        name: 'comment[cid]',
        value: commentId
      }).appendTo('#commentForm');
      // 第一次插入到表单中
    }

  });
})