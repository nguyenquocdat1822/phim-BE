const jwt = require("jsonwebtoken");
require("dotenv").config();

const authUserMiddleware = (req, res, next) => {
  const token = req?.headers?.token.split(" ")[1]; //cắt và lấy phần thử thứ 2 của mảng
  const id = req.headers.id;
  //  process.env.ACCESS_TOKEN => secret key
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(200).json({
        status: "ERROR",
        message: "Authorized was failed!",
        error: err,
      });
    }

    if (user.id === id || user.isAdmin === true) {
      next();
    } else {
      return res.status(200).json({
        status: "ERROR",
        message: "Authorized was failed!!!",
      });
    }
  });
};

const authMiddleWare = (req, res, next) => {
  const token = req?.headers?.token?.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(200).json({
        status: "ERROR",
        message: "Authorized was failed!",
        error: err,
      });
    }

    if (user?.isAdmin === true) {
      next();
    } else {
      return res.status(200).json({
        status: "ERROR",
        message: "Authorized was failed!",
        error: err,
      });
    }
  });
};

module.exports = {
  authMiddleWare,
  authUserMiddleware,
};
