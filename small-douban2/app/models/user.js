const mongoose = require('mongoose');
const userSchema = require('../schemas/user.js');
// 定义模型
const User = mongoose.model('User', userSchema);

// 导成这个模型
module.exports = User;