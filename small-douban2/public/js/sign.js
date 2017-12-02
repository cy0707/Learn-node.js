// 利用ajax进行登陆注册判断
$(function(){

  // 提示框
  function alertMsg(selector, msg) {
    $(selector).html(msg).show().delay(2000).fadeOut();
  }

  // 注册
  function signup(signupName, signupPassword, dangerSelector, successSelector) {
    $.ajax({
      url: '/user/signup',
      type: 'POST',
      data: {
        user: {
          username: signupName,
          password: signupPassword
        }
      }
    })
    .done(function(data) {
      if (data.result === -1) {
        alertMsg(dangerSelector, '用户名重复了');
        return;
      }else if(data.result === 1) {
        alertMsg(successSelector, '恭喜注册成功');
        setTimeout(function(){
          window.location = '/';
        }, 2000);
        return;
      }
    })
    .fail(function() {
      console.log("error");
    });
  }

  // 登陆
  function signin(signinName, signinPassword, dangerSelector) {
    $.ajax({
      url: '/user/signin',
      type: 'POST',
      data: {
        user: {
          username: signinName,
          password: signinPassword
        }
      }
    })
    .done(function(data) {
      if (data.result === -1) {
        alertMsg(dangerSelector, '用户不存在');
        return;
      }else if(data.result === 0) {
         alertMsg(dangerSelector, '密码错误');
        return;
      }else if(data.result === 1) {
        // 登陆成功跳转到首页
        window.location = '/';
      }
    })
    .fail(function() {
      console.log("error");
    });
  }

  // 弹窗注册
  $('#signup').on('click', function(event) {
    // 获取用户填的用户名与密码
    const signupName = $.trim($('#signupName').val());
    const signupPassword = $.trim($('#signupPassword').val());

    // 这里可以对用户的用户名与密码
    // 进行校验----你们网站自己定的规则
    // 在这个我们仅仅不为空的校验
    if (!signupName) {
      alertMsg('.pop-danger', '用户名不能为空');
      return;
    }

    if (!signupPassword) {
      alertMsg('.pop-danger', '密码不能为空');
      return;
    }

    signup(signupName, signupPassword, '.pop-danger', '.pop-success');

  });



  // 弹窗登陆
  $('#signin').on('click', function(event) {
    // 获取用户填的用户名与密码
    const signinName = $.trim($('#signinName').val());
    const signinPassword = $.trim($('#signinPassword').val());

    // 这里可以对用户的用户名与密码
    // 进行校验----你们网站自己定的规则
    // 在这个我们仅仅不为空的校验
    if (!signinName) {
      alertMsg('.pop-danger', '用户名不能为空');
      return;
    }

    if (!signinPassword) {
      alertMsg('.pop-danger', '密码不能为空');
      return;
    }
    signin(signinName, signinPassword, '.pop-danger');
  });

  // 单独页面注册
  $('#pageSignup').on('click', function(event) {
    // 获取用户填的用户名与密码
    const pageSignupName = $.trim($('#pageSignupName').val());
    const pageSignupPassword = $.trim($('#pageSignupPassword').val());
    // 这里可以对用户的用户名与密码
    // 进行校验----你们网站自己定的规则
    // 在这个我们仅仅不为空的校验
    if (!pageSignupName) {
      alertMsg('.page-danger', '用户名不能为空');
      return;
    }

    if (!pageSignupPassword) {
      alertMsg('.page-danger', '密码不能为空');
      return;
    }

    signup(pageSignupName, pageSignupPassword, '.page-danger', '.page-success');

  });

  // 单独页面登陆
  $('#pageSignin').on('click', function(event) {
    // 获取用户填的用户名与密码
    const pageSigninName = $.trim($('#pageSigninName').val());
    const pageSigninPassword = $.trim($('#pageSigninPassword').val());

    // 这里可以对用户的用户名与密码
    // 进行校验----你们网站自己定的规则
    // 在这个我们仅仅不为空的校验
    if (!pageSigninName) {
      alertMsg('.page-danger', '用户名不能为空');
      return;
    }

    if (!pageSigninPassword) {
      alertMsg('.page-danger', '密码不能为空');
      return;
    }

    signin(pageSigninName, pageSigninPassword, '.page-success');
  });



})