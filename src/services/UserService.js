const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JwtService = require("./JwtService");
// const { favoriteFilm } = require("../controllers/UserController");
const createUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        username: data.username,
      });

      if (checkUser) {
        resolve({
          status: "OK",
          message: "username đã tồn tại",
        });
      } else {
        const hashPass = bcrypt.hashSync(data?.password, 10);

        const createNewUser = await User.create({
          username: data?.username,
          password: hashPass,
          isAdmin: false,
          phoneNumber: data?.phoneNumber,
          address: data?.address,
          displayName: data?.displayName,
        });

        resolve({
          status: "OK",
          message: "Create new user success!!",
          data: createNewUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//login user
const signIn = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        username: data?.username,
      });

      if (!checkUser) {
        resolve({
          status: "ERROR",
          message: "Email chưa được đăng ký",
        });
      }
      const comparePassword = bcrypt.compareSync(data?.password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERROR",
          message: "Tài khoản hoặc mật khẩu không chính xác",
        });
      }
      const access_token = await JwtService.generalAccessToken({
        id: checkUser.id,
        username: checkUser.username,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await JwtService.generalRefreshToken({
        id: checkUser.id,
        username: checkUser.username,
        isAdmin: checkUser.isAdmin,
      });
      resolve({
        status: "OK",
        message: "Đăng nhập thành công",
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: data?.id || data?._id,
      });

      if (!checkUser) {
        resolve({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(data?.id, data, { new: true });

      resolve({
        status: "OK",
        message: "Cập nhật thành công",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getUserDetail = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: data?.id,
      });
      if (!user) {
        resolve({
          status: "ERROR",
          message: "Lấy thông tin người dùng không thành công",
        });
      }
      resolve({
        status: "OK",
        message: "Lấy thông tin người dùng thành công",
        user: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await User.find();
      if (allUsers.length < 1) {
        resolve({
          status: "ERROR",
          message: "Lấy danh sách không thành công",
          data: [],
        });
      }
      resolve({
        status: "OK",
        message: "Lấy danh sách thành công",
        data: allUsers,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });

      if (!checkUser) {
        resolve({
          status: "ERROR",
          message: "Không tìm thấy user",
        });
      } else {
        await User.findByIdAndDelete(id, { new: true });

        resolve({
          status: "OK",
          message: "Xóa user thành công",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const saveFilm = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({
        _id: data?.id,
      });

      if (!user) {
        resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }

      if (!user?.filmHistory || user?.filmHistory < 1) {
        user.filmHistory = [];
      }

      if (user && user?.filmHistory) {
        if (user?.filmHistory?.some((item) => item === null)) {
          user.filmHistory = user.filmHistory.filter((item) => item !== null);
          // Lưu tài liệu sau khi xóa các phần tử null
          await user.save();

          await user.filmHistory.push(data.dataFilm);
          await user.save();
        } else {
          let checkFilm = user?.filmHistory?.some(
            (item) => item.filmEp === data?.dataFilm?.filmEp && item.slug === data?.dataFilm?.slug
          );
          if (checkFilm) {
            resolve({
              status: "OK",
              message: "Đã có trong lịch sử",
            });
          } else {
            await user.filmHistory.push(data.dataFilm);
            await user.save();
          }
        }
        resolve({
          status: "OK",
          message: "Lưu thành công",
          user: user,
          // user: user,
        });
      }
      // if()
    } catch (e) {
      reject(e);
    }
  });
};

// filmsFavorite
const toggleLikeFilm = (id, dataFilm) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({
        _id: id,
      });

      if (!user) {
        resolve({
          status: "ERROR",
          message: "Người dùng không tồn tại",
        });
      }

      if (!user?.filmsFavorite || user?.filmsFavorite < 1) {
        user.filmsFavorite = [];
      }

      if (user && user?.filmsFavorite) {
        if (user?.filmsFavorite?.some((item) => item === null)) {
          user.filmsFavorite = user.filmsFavorite.filter((item) => item !== null);
          // Lưu tài liệu sau khi xóa các phần tử null
          await user.save();

          await user.filmsFavorite.push(dataFilm);
          await user.save();
        } else {
          let checkFilm = user?.filmsFavorite?.some((item) => item.slug === dataFilm?.slug);
          if (checkFilm) {
            let updateFavorite = user.filmsFavorite.filter((item) => item.slug !== dataFilm.slug);
            user.filmsFavorite = updateFavorite;
            await user.save();
            resolve({
              status: "UNLIKE",
              message: "Bỏ thích phim",
            });
          } else {
            user.filmsFavorite.push(dataFilm);
            await user.save();
            resolve({
              status: "LIKE",
              message: "Lưu thành công",
              favorite: user.filmsFavorite,
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

// unLikeFilm
const unLikeFilm = (id, dataFilm) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ _id: id });

      if (!user) {
        resolve({
          status: "ERROR",
          message: "Không tìm thấy người dùng",
        });
      }
      // tìm và xóa film khỏi danh sách thích
      let updateFavorite = user.filmsFavorite.filter((item) => item.slug !== dataFilm.slug);

      //Kiểm tra có tồn tại trong mục yêu thích không
      if (updateFavorite.length === user.filmsFavorite.length) {
        resolve({
          status: "ERROR",
          message: "Film không tồn tại trong danh sách!",
        });
      }

      user.filmsFavorite = updateFavorite;
      await user.save();
      resolve({
        status: "OK",
        message: "Cập nhật thành công!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const changePassword = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.currentPassword || !data.newPassword || !data.confirmNewPassword || !data.username) {
        resolve({
          status: "ERROR",
          message: {
            vi: "Vui lòng điền đủ thông tin...",
            en: "Please fill all parameters...",
          },
        });
      } else {
        let user = await User.findOne({
          username: data.username,
        });
        if (!user) {
          resolve({
            status: "ERROR",
            message: {
              vi: "Không tìm thấy người dùng!",
              en: "User was not found!",
            },
          });
        } else {
          let comparePassword = bcrypt.compareSync(data.currentPassword, user.password);
          if (!comparePassword) {
            resolve({
              status: "ERROR",
              message: {
                vi: "Mật khẩu hiện tại không đúng!",
                en: "Current password not true",
              },
            });
          }
          if (data.newPassword !== data.confirmNewPassword) {
            resolve({
              status: "ERROR",
              message: {
                vi: "Nhập lại mật khẩu không đúng!",
                en: "Confirm password not equal to new password!",
              },
            });
          }

          let hashPass = bcrypt.hashSync(data.newPassword, 10);
          let compareNewPassword = bcrypt.compareSync(data.newPassword, user.password);
          if (compareNewPassword) {
            resolve({
              status: "ERROR",
              message: {
                vi: "Mật khẩu mới không được trùng với mật khẩu cũ!",
                en: "The new password must not be same as the old password!",
              },
            });
          } else {
            await User.findOneAndUpdate({ username: data.username }, { password: hashPass });
            resolve({
              status: "OK",
              message: {
                vi: "Đổi mật khẩu thành công!",
                en: "Change password is success!",
              },
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserAdmin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data._id) {
        resolve({
          status: "ERROR",
          message: {
            vi: "Thông tin cung cấp còn thiếu...",
            en: "Missing parameters....",
          },
        });
      } else {
        let checkUser = await User.findOne({ _id: data._id });

        if (!checkUser) {
          resolve({
            status: "ERROR",
            message: {
              vi: "Không tìm thấy người dùng",
              en: "USer is not defined!",
            },
          });
        }
        if (checkUser.isAdmin === true) {
          resolve({
            status: "ERROR",
            message: {
              vi: "Bạn không thể thay đổi thông tin của quản trị khác",
              en: "You can't update information of other Admin",
            },
          });
        } else {
          checkUser.displayName = data.displayName;
          checkUser.address = data.address;
          checkUser.phoneNumber = data.phoneNumber;
          checkUser.isAdmin = data.isAdmin;
          await checkUser.save();
          resolve({
            status: "OK",
            user: checkUser,
            message: {
              vi: "Cập nhật thông tin thành công",
              en: "Update User is success!!",
            },
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  signIn,
  updateUser,
  getUserDetail,
  getAllUser,
  deleteUser,
  saveFilm,
  toggleLikeFilm,
  changePassword,
  unLikeFilm,
  updateUserAdmin,
};
