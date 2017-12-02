const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义schema
const studentSchema = new Schema({
  sid: Number,
  name: String,
  age: Number,
  sex: String
});

// 添加索引(在mongdb中索引是可以重复的，但是不建议重复)
studentSchema.index({sid: 1});

// 定义模型
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;