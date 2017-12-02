const User = require('../models/user');

// 显示单独的注册
exports.showSignup = function(req, res) {
  res.render('signup', {
    title: '注册'
  });
}

// 显示单独的登陆
exports.showSignin = function(req, res) {
  res.render('signin', {
    title: '登陆'
  });
}

// signup---注册
exports.signup = function(req, res){
  // 获取传递过来的数据
  const _user = req.body.user;
  // 用户名是唯一的，不能重复，在这里进行判断
  User.findOne({username: _user.username}, function(err, user){
    if (err) {
      console.log(err);
    }
    // 如果用户名存在
    if (user) {
      // 返回错误提示
      // -1代表用户名重复了
      res.json({"result": -1});
      return;
    }else {
      // 如果用户名没有重名的话
      const newUser = new User(_user);
      newUser.save(function(err, user){
        if (err) {
          console.log(err);
        }
        // 1代表注册成功
        res.json({"result": 1});
      });
    }
  });
}

// signin---登陆
exports.signin = function(req, res){
  // 获取传递过来的数据
  const _user = req.body.user;

  // 用户名是唯一的，不能重复，在这里进行判断
  User.findOne({username: _user.username}, function(err, user){
    if (err) {
      console.log(err);
    }
    // 如果用户名不存在
    if (!user) {
      // 返回错误提示
      // -1代表的是---用户名不存在
      res.json({"result": -1});
      return;
    }else {
      // 如果用户名存在----则检测密码是否正确
      // 给user添加实例方法
      if(user.comparePassword(_user.password)) {
        // 密码正确存储到session中
        req.session.user = user;
        // 1代表用户登陆成功
        res.json({"result": 1});
        return;
      }else {
        // 密码不正确的
        // 0代表的是----用户的密码错误
        res.json({"result": 0});
      }
    }
  });

};


// logout---登出
exports.logout = function(req, res){
 // 删除session中的user
 delete req.session.user;
 // 删除本地变量----每个模板都能访问到的那个变量
 // delete app.locals.user;
 // 重定向到首页
 res.redirect('/');
};


// 用户列表页
exports.list = function(req, res){
  // 从数据库中取出全部电影
  User.fetch(function(err, users){
    // users是一个数组，从数据库取出全部电影
    // 的数据组成的数组
    if (err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '用户列表页',
      users: users
    });
  });
};

// 判断用户是否登陆----midware for user
exports.signinRequired = function(req, res, next) {
  const user = req.session.user;
  // 如果用户不存在
  if (!user) {
    // 跳转到登陆页面---让用户登陆
    return res.redirect('/signin');
  }
  next();
}

// 判断用户是否具有权限----midware for user
exports.adminRequired = function(req, res, next) {
  const user = req.session.user;
  // 走到了这一步,则可以判断
  // 用户是处于登陆状态---这个就需要判断用户的权限
  if (user.role <= 10) {
    // 当其权限小于10，则不能看下面的内容
    return res.redirect('/signin');
  }
  // 如果权限够的话，执行下面的操作
  next();
}
