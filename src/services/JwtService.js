const jwt = require("jsonwebtoken");
require("dotenv").config();

// general access token payload => data truyền vào
const generalAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN, //secret key
    { expiresIn: "1d" } //thời gian tồn tại
  );
  return access_token;
};

const generalRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1d" }
  );
  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "ERROR",
            message: "The authentication is fail!",
            error: err,
          });
        }
        let access_token = "";
        if (user && user.email && user.role) {
          access_token = await generalAccessToken({
            email: user.email,
            role: user.role,
          });
        }
        resolve({
          status: "OK",
          message: "Authentication is success!",
          access_token: access_token,
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService,
};
