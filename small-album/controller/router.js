const file = require('../models/file.js');
const multer  = require('multer');
const path = require('path');

// 显示首页
// exports.showIndex = function(req, res) {
// 错误方式-----
//   res.render('index',{
//     albums: file.getAllAlbums()
//   });
// }
// file.getAllAlbums()这个函数是异步的，所以在
// 这个函数中如果返回return的话，可能这个异步函数
// 还没执行完后，就return了一个空数组



// 我们的思想是先把具体的完成之后的结果
// 返回给上一个需要我们的函数----在node
// 都是异步的---即内层函数不是return返回给
// 外层函数，而是外层函数调用内层函数的回调函数
// 把数据当做回调函数的参数来使用。



// 正确方式----显示所有相册
exports.showIndex = function(req, res, next) {
  // 外层回调函数----调用内层的回调函数
  // 内层函数的数据以参数的形式传递给外层函数
  file.getAllAlbums((err, allAlbums) => {
    if (err) {
      next();
      return;
    }
    res.render('index', {
      'albums': allAlbums
    });
  });
};


// 显示一个相册里面的所有图片
exports.showAlbum = function(req, res, next) {
  // 遍历相册中的所有图片---即该目录下
  // 从地址栏中获取相册的名字
  const albumName = req.params.albumName;
  
  // 具体的查询数据交给model层
  file.getAllImagesByAlbumName(albumName, (err, imagesArray) => {
    if (err) {
      next();
      return;
    }
    res.render('pic_list', {
      'albumname': albumName,
      'images': imagesArray
    });
  });
};

// 显示上传
exports.showUpload = (req, res) => {
  file.getAllAlbums((err, allAlbums) => {
    if (err) {
      next();
      return;
    }

    res.render('upload', {
      albums: allAlbums
    });
  });
};


// 上传表单
// 文件先上传到临时文件夹中----如果上传错误的话
// 那么就删除掉这个图片，如果上传正确，先改名
// 然后把文件存放在文件存在的目录下。


// 创建临时文件夹与改名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads', req.body.folder))
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({ storage: storage }).single('pic');

exports.upload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.send('文件上传失败');
    } else {
      if (req.file.size > 1024*1024) {
        res.send('文件上传的大小太大，请选择小于1M的图片');
      }else {
         res.send('文件上传成功');
      }
    }
  });

};