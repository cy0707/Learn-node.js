const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const port = process.env.PORT || 9080;
const dbUrl = 'mongodb://localhost/test';

// 可以在node中直接设置 PORT=3000;
const app = express();

// 连接数据库
mongoose.connect(dbUrl);

// 连接判断-----mongoose是为每一个用户与数据库建立
// 一次持久的连接
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we\'re connected');
});


// 设置模板引擎
app.set('views', './app/views');
app.set('view engine', 'ejs');

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// post提交的处理
// for parsing application/json
// app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing application/x-www-form-urlencoded

// 设置session-----connect-mongo mongodb 来存储的话，存储 session 的数据
// 不会因为服务器重启，session里面的数据丢失
app.use(session({
  secret: 'douban',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    url: dbUrl,
    collection: 'sessions' 
  })
}));

// 本地变量
app.locals.moment = require('moment');

// 开发环境下的一些配置
// if ('development' === app.get('env')) {
//   app.set('showStackError', true);
//   // 源码不是压缩后
//   app.locals.pretty = true;
//   mongoose.set('debug', true);
// }

// 路由配置---传入app这个参数
require('./config/routes')(app);

app.listen(port);
console.log('small-douban started on port ' + port);