const mongoose = require('mongoose');
const movieSchema = require('../schemas/movies.js');
// 定义模型
const Movie = mongoose.model('Movie', movieSchema);

// 导成这个模型
module.exports = Movie;