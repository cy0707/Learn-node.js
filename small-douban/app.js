const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const port = process.env.PORT || 9080;
// 加载数据模型
const Movie = require('./models/movies.js');
// 可以在node中直接设置 PORT=3000;
const app = express();

// 连接数据库
mongoose.connect('mongodb://localhost/test');

// 连接判断-----mongoose是为每一个用户与数据库建立
// 一次持久的连接
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we\'re connected');
});


// 设置模板引擎
app.set('view engine', 'ejs');

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// post提交的处理
// for parsing application/json
// app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing application/x-www-form-urlencoded

// 本地变量
app.locals.moment = require('moment');

// 前台首页
app.get('/', (req, res) => {

  // 从数据库中取出全部电影
  Movie.fetch(function(err, movies){
    // movies是一个数组，从数据库取出全部电影
    // 的数据组成的数组
    if (err) {
      console.log(err);
    }

    res.render('index', {
      title: '小豆瓣首页',
      movies: movies
    });
  });
});

// 前台电影详情
app.get('/movie/:id', (req, res) => {
  // 从get方式从地址栏获取电影的id值
  const movieId = req.params['id'];

  // 通过id获取电影的详细信息
  Movie.findById(movieId, function(err, movie){
    if(err) {
      console.log(err);
    }

    res.render('detail', {
      title: movie.title + '详情页',
      movie: movie
    });

  });
});

// 后台电影录入页面
app.get('/admin/movie', (req, res) => {
  res.render('admin', {
    title: '后台首页',
    movie: {
       title: '',
       doctor: '',
       country: '',
       year: '',
       poster: '',
       flash: '',
       summary: '',
       language: ''
     }
  });
});

// 点击更新进入后台录入页
app.get('/admin/update/:id', function(req, res){
  // 获取电影的id
  const movieId = req.params.id;
  // 如果该电影是存在的
  if (movieId) {
    // 从数据库中取出数据，
    // 再利用admin的模板渲染数据
    Movie.findById(movieId, function(err, movie){
      res.render('admin',{
        title: '后台更新页',
        movie: movie
      })
    });
  }
});




// 后台录入也的post请求的处理
app.post('/admin/movie/new', function(req, res){
  if (!req.body) {
    return res.sendStatus(400);
  } 
  const movieId = req.body.movie._id;
  const movieObj = req.body.movie;
  let _movie = null;
  if (movieId !== '') {
    // 如果movieI没有未定义的话，那么就代表
    // 这个电影是修改状态，先从数据库中找到这个电影
    // 然后再执行修改
    Movie.findById(movieId, function(err, movie){
      if (err) {
        console.log(err);
      }

      // 修改数据库中的数据，不使用underscore这个库
      movie.update(movieObj, function(err, callback){
        if (err) {
          console.log(err);
        }

        // 更新成功之后，跳转到详情页面
        res.redirect('/movie/' + movie._id);
      });
    });
  }else {
    // 如果是新添加的,新建一个实例,存储到数据库中
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    });
    
    // 存储到数据库中
    _movie.save(function(err, movie){
      if (err) {
        console.log(err);
      }

      // 更新成功之后，跳转到详情页面
      res.redirect('/movie/' + movie._id);
    });
  }
});




// 后台电影列表--增删改
app.get('/admin/list', (req, res) => {
  // 从数据库中取出全部电影
  Movie.fetch(function(err, movies){
    // movies是一个数组，从数据库取出全部电影
    // 的数据组成的数组
    if (err) {
      console.log(err);
    }

    res.render('list', {
      title: '后台列表页',
      movies: movies
    });
  });
});



// 删除电影
app.delete('/admin/list', function(req, res){
  const movieId = req.query.id;
  
  // 如果movieId
  if (movieId) {
    Movie.remove({_id: movieId}, function(err, movie){
      if (err) {
        console.log(err);
        return;
      }
      // 删除成功
      res.json({success: 1});
    });
  }
});



app.listen(port);
console.log('small-douban started on port ' + port);