const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 获取ObjectId
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: 'Movie'
  }, 
  //当前要评论的电影----不可能把全部电影信息都保存起来
  // 可以采用引用的方式 ref--代表数据模型
  from: {
    type: ObjectId,
    ref: 'User'
  },  
  // 评论来自与谁
  reply:[{
    from: {type: ObjectId, ref:'User'},
    to: {type: ObjectId, ref: 'User'},
    content: String
  }],
  // 评论的盖楼----n个小评论
  content: String,
  // 具体评论的内容 
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
commentSchema.pre('save', function(next){
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
commentSchema.statics.fetch = function(callback) {
  return this.find({}).sort('meta.uodateAt').exec(callback);
}

// 添加静态方法----通过Id获取电影
commentSchema.statics.findById = function(commentid, callback) {
  return this.findOne({_id: commentid}).exec(callback);
}

// 导成这个schema
module.exports = commentSchema;