const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// category的schema
// 一个分类下面有很多部电影----存储这个电影的
// id---指向movie
const categorySchema = new Schema({
  name: String,
  movies:[{type: ObjectId, ref: 'Movie'}],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});


// 添加方法---在每次存储数据之前
// 都要执行这个方法
categorySchema.pre('save', function(next){
  // 如果是新添加的数据
  if (this.isNew) {
    // 那么当前时间就是当前创建与更新时间
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    // 如果不是新添加的话，那么更新时间为当前时间
    this.meta.updateAt = Date.now();
  }

  // 上面执行成功后，执行save方法
  next();
});


// 添加静态方法---获取全部电影
// exec代表执行完前面的查询后，执行回调函数
categorySchema.statics.fetch = function(callback) {
  return this.find({}).sort('meta.uodateAt').exec(callback);
}

// 添加静态方法----通过Id获取电影
categorySchema.statics.findById = function(movieid, callback) {
  return this.findOne({_id: movieid}).exec(callback);
}

// 导成这个schema
module.exports = categorySchema;