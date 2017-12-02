// 加载数据模型
const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/comment');
const Category = require('../app/controllers/category');

// 导出这个路由配置模块
module.exports = function(app) {
  // 提前判断user的登陆情况
  app.use(function(req, res, next){

    // 判断session是否存在
    const _user = req.session.user;
    // 如果session中存在user，那么就赋值给本地变量user
    // 如果session中的user不存在的话,本地变量为空
    app.locals.user = _user;
    next();
  });

  // index
  app.get('/', Index.showIndex);

  // user
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/signup', User.showSignup);
  app.get('/signin', User.showSignin);
  app.get('/logout', User.logout);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

  // movie---我们的后台页面，我们不需要普通用户
  // 能访问到---此时需要增加中间件,对每一个需要
  // 权限判断的地址。
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);
  
  // comment
  app.post('/user/comment', User.signinRequired, Comment.save);

  // category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

  // result
  app.get('/results', Index.search);

};
