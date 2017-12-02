const fs = require('fs');
const path = require('path');

// 删除文件夹 fs.rmdir
// 删除文件 fs.rmdir

// 显示所有文件夹
exports.getAllAlbums = (callback) =>{
  fs.readdir(path.join(__dirname, '..', 'uploads'), (err, files) => {
    // 读取错误
    if(err) {
      callback('没有找到该文件', null);
      return;
    }

    // 存储文件夹
    let allAlbums = [];

    (function iterator(i){
      // 遍历完成
      if (i == files.length) {
        callback(null, allAlbums);
        return;
      }

      // 检测是否为文件夹
      fs.stat(path.join(__dirname, '..', 'uploads', files[i]), (err, stats) => {
        if (err) {
           callback('没有找到该文件', null);
           return;
        }
        // 判断为文件夹的话, push到文件夹的数组中
        if (stats.isDirectory()) {
          allAlbums.push(files[i]);
        }

        // 注意这里是i+1=====不是i++,不然就是无限循环
        // 当然还可以使用++i;
        iterator(i+1);
        // iterator(++i);
      });

    })(0);

  });

};


// 显示文件夹中的所有图片
exports.getAllImagesByAlbumName = (albumName, callback) => {
  fs.readdir(path.join(__dirname, '..', 'uploads', albumName), (err, files) => {
    // 读取错误
    if(err) {
      callback('没有找到该文件', null);
      return;
    }

    // 存储文件夹
    let imagesArray = [];

    (function iterator(i){
      // 遍历完成
      if (i == files.length) {
        callback(null, imagesArray);
        return;
      }

      // 检测是否为文件夹
      fs.stat(path.join(__dirname, '..', 'uploads', albumName, files[i]), (err, stats) => {
        if (err) {
           callback('没有找到该文件', null);
           return;
        }
        // 判断为文件夹的话, push到文件夹的数组中
        if (stats.isFile()) {
          imagesArray.push(files[i]);
        }
        iterator(i+1);
      });

    })(0);

  });
};

