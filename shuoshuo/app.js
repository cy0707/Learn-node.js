const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./controller/router.js');
// create application/json parser 
const jsonParser = bodyParser.json();
 
// create application/x-www-form-urlencoded parser 
const urlencodedParser = bodyParser.urlencoded({ extended: false });


// 设置模板引擎
app.set('view engine', 'ejs');

// 路由中间件
app.use(express.static('./public'));
app.use(express.static('./avaters'));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 9000000
  }
}));

// 显示首页
app.get('/', router.showIndex); 

// 显示注册
app.get('/register', router.showRegister); 
app.post('/checkRegister', urlencodedParser, router.checkRegister);


// 显示登陆
app.get('/login', router.showLogin); 
app.post('/checkLogin', urlencodedParser, router.checkLogin);
// 退出登陆
app.get('/logout', router.logout)

// 上传头像页面
app.get('/uploadAvater', router.uploadAvater);
// 上传头像post到后台
app.post('/douploadAvater', router.douploadAvater);
// 剪切头像的页面
app.get('/cutAvater', router.cutAvater);
// 剪切头像的处理
app.get('/doCutAvater', router.doCutAvater);

// 发表说说
app.post('/public', urlencodedParser, router.public);

// 得到所有说说-----这个是后台的服务，给前台提供接口
// 不在后台进行模板渲染，只提供数据，让前台进行拼接
app.get('/getAllPublic', router.getAllPublic);
app.get('/getUserinfo', router.getUserinfo);

// 分页
app.get('/getPublicAmount', router.getPublicAmount);

// 获取某个用户的全部说说
app.get('/user/public', router.showUserPublic)
// 获取某个用户是从存在
app.get('/user/:username', router.showUser);


// 404页面
app.use((req, res) => {
  res.render('404');
});


app.listen(8090);