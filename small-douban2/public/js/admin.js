$(function(){
 // 利用ajax对后台电影进行删除
  $('.del').on('click', function(event) {
    // 获取目标元素的id
    const target = $(event.target);
    // 自定义的id属性
    const targetId = target.data('id');
    // 获取tr元素
    const tr = $('.item-id-' + targetId);

    $.ajax({
      url: '/admin/movie/list?id=' + targetId,
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

  // 利用豆瓣的接口----进行数据的录入
  // 减少手动填写数据
  
  $('#douban').blur(function(){
    // 手动输入豆瓣的电影的id-----获取豆瓣的存的相关数据
    const douban = $(this);
    const doubanId = douban.val();

    // 对电影的id进行简单的判断
    // 如果id存在的话,那么就发出请求
    if (doubanId) {
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + doubanId,
        dataType: 'jsonp',
        cache: true,
        crossDomain: true,
        jsonp: 'callback'
      })
      .done(function(data) {
        // 与豆瓣的api返回的值，填入的表单中
        $('#inputtitle').val(data.title);
        $('#inputdoctor').val(data.directors[0].name);
        $('#inputcountry').val(data.countries[0]);
        $('#inputposter').val(data.images.large);
        $('#inputyear').val(data.year);
        $('#inputsummary').val(data.summary);
      })
      .fail(function() {
        console.log("error");
      })
    }
  });
  
})