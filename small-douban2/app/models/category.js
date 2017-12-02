const mongoose = require('mongoose');
const categorySchema = require('../schemas/category');
// 定义模型
const Category = mongoose.model('Category', categorySchema);

// 导成这个模型
module.exports = Category;