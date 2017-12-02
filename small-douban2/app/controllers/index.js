const Movie = require('../models/movie');
const Category = require('../models/category');

// 前台首页
exports.showIndex = function(req, res) {
  // 从数据库中取出全部电影-----第一次，没有分类的情况
  // 第二次----改为先取出全部的分类---再取出该分类的全部电影
  Category
    .find({})
    .populate({
      path: 'movies', 
      select: 'title poster',
      options: {limit: 5}
    }).exec(function(err, categories){
      if (err) {
        console.log(err);
      }
      res.render('index', {
        title: '小豆瓣首页',
        categories: categories
      });
    });
};

// 搜索页
exports.search = function(req, res) {
  const catId = req.query.cat; // 分类的id
  const q = req.query.q; //搜索的关键字
  const page = parseInt(req.query.page, 10) || 1; // 分页
  const limitCount = 2; // 显示的数据个数
  const pageCount = (page-1) * 2;  // 跳过的数目个数
  let totalPage = 0;

  // 查看是否是分类页面
  // 还是搜索页面
  if (catId) {
    // 获取该分类下的总数
    Category.find({_id: catId}, function(err, categories){
      totalPage = Math.ceil(categories[0].movies.length / limitCount );
    });

    Category
      .find({_id: catId})
      .populate({
        path: 'movies', 
        select: 'title poster',
        options: {limit: limitCount, skip: pageCount}
      }).exec(function(err, categories){
        // categories-----只有一个那就是当前
        // 的那个catId对应的那个分类
        if (err) {
          console.log(err);
        }
        const category = categories[0] || {};
        res.render('results', {
          title: '结果列表页',
          keyword: category.name,
          movies: category.movies,
          totalPage: totalPage,
          currentPage: page,
          category: category
        });
      });
    } else {
      // 来自与搜索页面
      // 获取该分类下的总数
      Movie.find({title: new RegExp(q + '.*', 'i')}).count(function(err, count){
        totalPage = Math.ceil(count / limitCount);
      }) 

      Movie
        .find({title: new RegExp(q + '.*', 'i')})
        .limit(limitCount)
        .skip(pageCount)
        .exec(function(err, movies){
          if (err) {
            console.log(err);
          }
          res.render('results', {
            title: '搜索结果页',
            keyword: q,
            movies: movies,
            totalPage: totalPage,
            currentPage: page,
            category: null
          });

        })
    }
};