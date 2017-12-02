const express = require('express');
const router = require('./controller/router.js');
// 打开数据库
const mdb = require('./model/mdb.js');
const app = express();

app.set('view engine', 'ejs');

// 显示学生
app.get('/', router.showIndex);

// 添加学生
app.get('/add', router.showAddStudent);
app.get('/doAddStudent', router.doAddStudent);

// 修改 
app.get('/edit/:sid', router.editStudent);
app.get('/doEditStudent/:sid', router.doEditStudent);

// 删除学生
app.get('/delete/:sid', router.deleteStudent);


app.listen(8090);