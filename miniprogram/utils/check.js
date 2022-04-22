function isValidPhone(str) {
  var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

function isValidId(str) {
  var idreg= /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!idreg.test(str)) {
    return false;
  } else {
    return true;
  }
}
module.exports = {
  isValidPhone,
  isValidId
}