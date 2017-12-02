const crypto = require('crypto');

// md5加密
module.exports = function (string) {
  const md5mm = crypto.createHash('md5');
  const md5String = md5mm.update(string).digest('base64');
  return md5String;
}
