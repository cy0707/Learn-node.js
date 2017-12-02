const dbfunc = require('../models/db.js');
const md5 = require('../models/md5.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const gm = require('gm').subClass({imageMagick: true});

// 显示首页
exports.showIndex = function(req, res, next) {

  const username = req.session.username || '';
  // 读取头像
  let dbAvater = '';

  dbfunc.find('users', {username: username}, null, function(result) {
    // 如果没有找到这个用户名(没登陆，没注册)
    if (result.length) {
      // 则从数据库中寻找头像
      if (!result[0].avater) {
        // 如果用户没有上传图片----默认图片
        dbAvater = 'default.jpg';
      }else {
        // 数据库的图片
        dbAvater = result[0].avater;
      }
    }else {
      dbAvater = 'default.jpg';
    }

    // 上面可以简化为
    // dbAvater = result[0].avater || default.jpg
      res.render('index', {
        login: req.session.login || false,
        username: username,
        avater: dbAvater,
        active: 'index',
      });
  });
};



// 显示注册页
exports.showRegister = function(req, res, next) {
  res.render('register',{
    login: req.session.login || false,
    username: req.session.username || '',
    active: 'register'
  });
};

// 注册数据的提交
exports.checkRegister = function(req, res, next) {
  if (!req.body) return res.sendStatus(400);
  const username = req.body.username;
  let password = req.body.password;

  password = md5(md5(password).substr(4, 7) + md5(password));

  // 判断注册是否重名----用户名是唯一的
  dbfunc.find('users', {username: username}, null,  function(result){
    if (result.length != 0) {
      // 用户名重名
      res.send('-1'); //返回-1，表示用户名重名了
      return;
    }

    // 用户名可以注册了
    dbfunc.insertOne('users', {
      username: username,
      password: password,
      avater: 'default.jpg'
    }, function(result) {
      // 注册成功之后，把这个写入session中，做到自动登陆
      req.session.login = true;
      req.session.username = username;
      res.send("1"); //返回1, 表示用户成功
    });

  });  
};


// 显示登陆页
exports.showLogin = function(req, res, next) {
  res.render('login', {
    login: req.session.login || false,
    username: req.session.username || '',
    active: 'login'
  });
};

// 登陆数据的提交
exports.checkLogin = function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const username = req.body.username;
    let password = req.body.password;

    password = md5(md5(password).substr(4, 7) + md5(password));

    dbfunc.find('users', {username: username}, {  pageCount: 0, pageIndex: 0}, function(result) {
      // 如果没有找到这个用户名
      if (!result.length) {
        res.send('noUser');
        return;
      }

      // 密码正确
      if (password == result[0].password) {
        // 注册成功之后，把这个写入session中，做到自动登陆
        req.session.login = true;
        req.session.username = username;
        res.send('ok');
      }else {
        // 密码错误
        res.send('noPsw');
      }
    });
};


// 退出登陆
exports.logout = function(req, res, next) {
  req.session.destroy(function(err) {
    if(err){
          res.json('-1'); //退出登陆失败
          return;
        }
         
      // req.session.loginUser = null;
      // res.clearCookie(identityKey);
      // res.redirect('/');
      res.json('1');
  });
}


// 上传表单
// 文件先上传到临时文件夹中----如果上传错误的话
// 那么就删除掉这个图片，如果上传正确，先改名
// 然后把文件存放在文件存在的目录下。


// 创建临时文件夹与改名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 上传之后的文件夹
      cb(null, path.join(__dirname, '..', 'avaters'));
  },
  filename: function (req, file, cb) {
    // 上传之后的文件名(session中的用户名)
    cb(null, req.session.username + path.extname(file.originalname));
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({ storage: storage }).single('pic');


// 上传头像
exports.uploadAvater = function(req, res, next) {
  // 已经登陆的话，就可以对头像进行剪裁,或者更换
  // 不然，不允许访问这个页面
  if (!req.session.login) {
    res.send('非法闯入,你还没登陆呢。不能进行头像设置');
    return;
  }

  res.render('upload',{
    login: req.session.login || false,
    username: req.session.username || '',
    active: 'index'
  });
}

// post上传的头像处理
exports.douploadAvater = function(req, res, next) {
 upload(req, res, (err) => {
   if (err) {
     res.send('文件上传失败');
     return;
   } else {
     if (req.file.size > 1024*1024) {
       res.send('文件上传的大小太大，请选择小于1M的图片');
       return;
     }else {
       // 上传成功req.file.filename-----上传的session的username的名字
       req.session.avater = req.file.filename;
       // 此时把这个路径存储在session中
       res.redirect('/cutAvater')
     }
   }
 });
}


// 剪裁头像
exports.cutAvater = function(req, res, next) {
  // 已经登陆的话，就可以对头像进行剪裁
  // 不然，不允许访问这个页面
  if (!req.session.login) {
    res.send('非法闯入,你还没登陆呢。不能进行头像设置');
    return;
  }

  res.render('cut', {
    login: req.session.login || false,
    username: req.session.username || '',
    active: 'index',
    avater: req.session.avater
  });
}



// 执行剪切切图
exports.doCutAvater = function(req, res, next) {
  // 获取要剪切图片
  const destAvater = req.session.avater;
  // 获取剪切的参数
  const w = req.query.w;
  const h = req.query.h;
  const x = req.query.x;
  const y = req.query.y;

  // 执行剪切
  gm('./avaters/' + destAvater)
    .crop(w, h, x, y)
    .noProfile() //压缩
    .resize(100, 100, "!")
    .write('./avaters/' + 'small' + destAvater, function(err){
      if (err) {
        res.send("-1"); //剪切图片出现错误
        return;
      }

      // 更改当前数据库的avater
      dbfunc.updateMany('users', {'username': req.session.username}, {
        $set: {'avater': 'small' + req.session.avater}
      }, function(){
        res.send("1"); //剪切成功
      });
    });
};


// 发表说说
exports.public = function(req, res, next){
  if (!req.session.login) {
    res.send('非法闯入,你还没登陆呢。不发表说说');
    return;
  }
  if (!req.body) return res.sendStatus(400);

  const content = req.body.content;

  // 向说说public集合插入数据
  dbfunc.insertOne('public', {
    username: req.session.username,
    content: content,
    pubTime: new Date()
  }, function(result) {
    res.send('1'); //存入成功
  });

};


// 列数所有说说，并且能提供分页
exports.getAllPublic = function(req, res, next) {
  // 所有没有登陆---则看不了说说内容
  const noPublic = [];
  if (!req.session.login) {
    res.json(noPublic);
    return;
  }
  // 前台传过来的分页
  const pageIndex = req.query.page || 0;
  dbfunc.find('public', {}, {pageCount: 9, pageIndex: pageIndex, sort: {pubTime: -1}}, function(result){
    // 第一次没有说说的情况下
    if (!result) {
      res.json(noPublic);
      return;
    }

    // 把所有组装json发送给前台
    res.json(result);
  });
}

// 得到用户信息
exports.getUserinfo = function(req, res, next) {
  // 第一次没有用户发表说说的情况下
  const noUser = [];
  const username = req.query.username || null;
  dbfunc.find('users', {username: username}, {pageCount: 0, pageIndex: 0, sort: {}}, function(result){
    if (!result) {
      // 如果最开始没有用户的情况下,直接返回
      res.json(noUser);
      return;
    }
    const userinfo =  {
      username: result[0].username,
      avater: result[0].avater,
      _id: result[0]._id
    };

    res.json(userinfo);
  });
};

// 得到所说说的总是
exports.getPublicAmount = function(req, res, next) {
  dbfunc.getAllCount('public', {}, function(count){
    // 不能发送数字----要发送字符串
    res.send(count.toString());
  });
};

// 查看某人是否存在
exports.showUser = function(req, res, next) {
  // 获取传入的用户名----即你要查看的某个用户的说说
  // 此时当你要查看说说时，要确保你是处于登陆状态的
  if (!req.session.login) {
    res.send('非法闯入,你还没登陆呢。不查看说说');
    return;
  }

  // 获取你要查看人的说说
  const userPublic = req.params['username'];

  // 查找数据库---是否存在这个人,不存在的话
  // 则退出，存在的话，则列出全部的说说
  dbfunc.find('users', {username: userPublic}, {pageCount: 0, pageIndex: 0, sort: {}}, function(result){
    console.log(result);
    // 根本不存在
    if (result.length == 0) {
      res.render('public', {
        username: false,
        login: req.session.login,
        active: false
      });
      return;
    }

    // 存在的话，那么就把这个人的名字显示给前端
    // 让前端通过ajax获取某人的全部说说
    res.render('public', {
      username: userPublic,
      login: req.session.login,
      active: false,
      avater: result[0].avater
    });
  });
}


// 显示全部说说
exports.showUserPublic = function(req, res, next) {
  // 此时以及确保人以及存在，
  // 在说说的集合中寻找说说
  const username = req.query.username;
  dbfunc.find('public', {username: username}, {pageCount: 0, pageIndex: 0, sort: {pubTime: -1}}, function(result){
    // 根本不存在
    if (!result) {
      res.send('-1'); //该用户没有发表过说说
      return;
    }
   // 把全部说说发送给前端
   res.json(result);
  });
}

