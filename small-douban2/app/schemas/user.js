const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;


// 加密算法
function md5(string) {
  const md5mm = crypto.createHash('md5');
  const password = md5mm.update(string).digest('base64');
  return password;
}


// movie的schema
const userSchema = new Schema({
  username: {
    unique: true,
    type: String
  },
  password: String,
  // 0: normal user
  // 1: verified user
  // 2: professional user
  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  },
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
userSchema.pre('save', function(next){
  const user = this;
  // 如果是新添加的数据
  if (this.isNew) {
    // 那么当前时间就是当前创建与更新时间
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    // 如果不是新添加的话，那么更新时间为当前时间
    this.meta.updateAt = Date.now();
  }
  // 对用户进行加密
  user.password = md5(md5(user.password).substr(4, 7) + md5(user.password));
  // 上面执行成功后，执行save方法
  next();
});

// 比较密码是否相同
userSchema.methods.comparePassword = function(_password){
  // 用户提交的密码加密后与数据库中进行对比
  _password = md5(md5(_password).substr(4, 7) + md5(_password));
  if (_password === this.password) {
    return true;
  }else {
    return false;
  }
}


// 添加静态方法---获取全部电影
// exec代表执行完前面的查询后，执行回调函数
userSchema.statics.fetch = function(callback) {
  return this.find({}).sort('meta.uodateAt').exec(callback);
}

// 添加静态方法----通过Id获取电影
userSchema.statics.findById = function(userid, callback) {
  return this.findOne({_id: userid}).exec(callback);
}

// 导成这个schema
module.exports = userSchema;