const JwtService = require("../services/JwtService");
const UserService = require("../services/UserService");

const createUser = async (req, res) => {
  try {
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);

    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const signIn = async (req, res) => {
  try {
    const response = await UserService.signIn(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      e: e.toString(),
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const response = await UserService.updateUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const response = await UserService.getUserDetail(req.headers);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const response = await UserService.deleteUser(req.body.id);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const saveFilm = async (req, res) => {
  try {
    const response = await UserService.saveFilm({ id: req.headers.id, dataFilm: req.body });
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

// favoriteFilm
const toggleLikeFilm = async (req, res) => {
  try {
    let id = req.headers.id;
    let dataFilm = req.body;
    const response = await UserService.toggleLikeFilm(id, dataFilm);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const unLikeFilm = async (req, res) => {
  try {
    let id = req.headers.id;
    let dataFilm = req.body;
    const response = await UserService.unLikeFilm(id, dataFilm);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const response = await UserService.changePassword(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const updateUserAdmin = async (req, res) => {
  try {
    const response = await UserService.updateUserAdmin(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const test = async (req, res) => {
  try {
    return res.status(200).json({
      status: "OK",
      message: "Hello World!",
    });
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    let token = req.headers.token.split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "ERROR",
        message: "Missing parameters...",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: "ERROR",
      message: "Error from server...",
    });
  }
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
  unLikeFilm,
  test,
  changePassword,
  refreshToken,
  updateUserAdmin,
};
