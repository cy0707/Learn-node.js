const express = require('express');
const app = express();
const router = require('./controller/router.js');


// 设置模板引擎
app.set('view engine', 'ejs');

// 路由中间件
app.use(express.static('./public'));
app.use(express.static('./uploads'));

// 显示首页中的所有相册
app.get('/', router.showIndex); 
// 显示相册中的所有图片
app.get('/:albumName', router.showAlbum);
// 显示上传
app.get('/upload', router.showUpload);


// post上传
app.post('/upload', router.upload);


// 404页面
app.use((req, res) => {
  res.render('404');
});


app.listen(8090);