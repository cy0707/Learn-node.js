const mongoose = require('mongoose');
const commentSchema = require('../schemas/comment');
// 定义模型
const Comment = mongoose.model('Comment', commentSchema);

// 导成这个模型
module.exports = Comment;