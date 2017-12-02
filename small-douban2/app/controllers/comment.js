const Comment = require('../models/comment');

// 评论的存储
exports.save = function(req, res) {
  // post提交的评论内容
  const _comment = req.body.comment;
  const movieId = _comment.movie;

  // 如果有cid的话，那么用户就是要对某个人评论
  if (_comment.cid) {
    Comment.findById(_comment.cid, function(err, comment){
      const reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      };
      // 评论盖楼
      comment.reply.push(reply);

      comment.save(function(err, comment){
        if (err) {
          console.log(err);
        }
        // 存储成功后，重新刷新回到电影的详情页
        res.redirect('/movie/' + movieId);
      });
    });
  } else {
    const comment = new Comment(_comment);

    comment.save(function(err, comment){
      console.log()
      if (err) {
        console.log(err);
      }
      // 存储成功后，重新刷新回到电影的详情页
      res.redirect('/movie/' + movieId);
    });
  }
};
