const Category = require('../models/category');

// 分类录入分类
exports.new = function(req, res) {
  res.render('category_admin', {
    title: '后台分类录入页'
  });
};

// 分类存储
exports.save = function(req, res) {
  const _category = req.body.category;
  const category = new Category(_category);

  category.save(function(err, category){
    if (err) {
      console.log(err);
    }
    res.redirect('/admin/category/list');
  });

};

// 分类的列表展示
exports.list = function(req, res) {
  Category.fetch(function(err, categories){
    if (err) {
      console.log(err);
    }
    res.render('category_list', {
      title: '分类列表页',
      categories: categories
    });
  });
};
