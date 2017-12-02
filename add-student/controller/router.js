const Student = require('../model/Student.js');

// 显示首页
exports.showIndex = function(req, res, next) {
  Student.find({}, function(err, students){
    res.render('index', {
      students: students
    });
  });
};

// 显示添加学生
exports.showAddStudent = function(req, res, next) {
  res.render('add');
};

// 添加学生的处理
exports.doAddStudent = function(req, res, next) {
  // 存储数据
  Student.create(req.query, function(err, result) {
    if(err) {
      console.log(err);
    }
    res.send('添加成功');
  });
};


// 修改学生
exports.editStudent = function(req, res, next) {
  const sid = parseInt(req.params['sid']);
  // 获取学生的唯一学号-----在数据库中获取数据
  Student.findOne({sid: sid}, function(err, student){
    if(err || !student) {
      res.send('该学生不存在或者修改发生错误');
      return;
    }

    // 把这个学生的信息添加在表单中
    res.render('edit', {
      student: student
    });

  })
}

// 处理修改学生
exports.doEditStudent = function(req, res, next) {
  // update存储在数据库
  const sid = parseInt(req.params['sid']);

  Student.update({sid: sid}, req.query, function(){
    res.send('修改成功');
  });
}

// 删除学生
exports.deleteStudent = function(req, res, next) {
  // update存储在数据库
  const sid = parseInt(req.params['sid']);

  Student.remove({sid: sid}, function(err, result){
    if (err) {
      console.log(err);
    }
    res.send('删除成功');
  });
}

