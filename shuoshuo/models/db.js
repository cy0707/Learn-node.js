// 这个模块里面封装了所有对数据库的常用操作

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

function _connectDB(callback) {
   const url = 'mongodb://localhost:27017/test';
   MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      callback(db);
   });
}


// 连接成功的回调函数
// _connectDB(function(db) {

// });
// 

// 插入数据
exports.insertOne = function(collectionName, json, callback) {
  _connectDB(function(db){
    db.collection(collectionName).insertOne(json,function(err, result){
      assert.equal(null, err);
      callback(result);
      db.close(); //关闭数据库
    });
  });
};

// 查找数据库
exports.find = function(collectionName, json, paging, callback) {
  const jsonCondition = json || {};
  const pagingCondition = paging || {
    pageCount: 0, //每一页的个数
    pageIndex: 0, //从那一页开始
    sort: {}
  };

  // limit--取得数目
  // skip---跳过的数量
  
  const limitCount = pagingCondition.pageCount;
  const skipCount = (pagingCondition.pageIndex - 1) * pagingCondition.pageCount;
  const sortCod = pagingCondition.sort;

  _connectDB((db) => {
    // 取出分页的数据
    const cursor = db.collection(collectionName).find(jsonCondition).limit(limitCount).skip(skipCount).sort(sortCod);
    cursor.each((err, item) => {
      // 全部检测完成后
      if (item == null) {
        // 把查找后的数据专为数组
        cursor.toArray((err, items) =>{
          assert.equal(null, err);
          // 把这个数组进行返回
          callback(items);
          db.close();
        });
      }
    });
  });
};


// 删除数据
exports.deleteMany = function(collectionName, json, callback) {
  _connectDB(function(db){
    db.collection(collectionName).deleteMany(json, (err, result) => {
      assert.equal(null, err);
      callback(result);
      db.close();
    });
  });
};

// 修改数据
exports.updateMany = function(collectionName, filter, update, callback) {
  _connectDB(function(db){
    db.collection(collectionName).updateMany(filter, update, (err, result) => {
      assert.equal(null, err);
      callback(result);
      db.close();
    });
  });
};

// 总的个数
exports.getAllCount = function(collectionName, query, callback) {
  _connectDB(function(db){
    db.collection(collectionName).count(query, function(err, count){
      assert.equal(null, err);
      callback(count);
      db.close();
    });
  });
};


// 文件一引入的话，就会执行里面的代码。
// 创建数据库索引

function init() {
  _connectDB(function(db){
    db.collection('users').createIndex({
      username: 1 //递增的索引
    }, {unique: true}, function(err, indexName){
    });
  });
}

init();