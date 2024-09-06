const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authMiddleWare, authUserMiddleware } = require("../middleware/AuthUserMiddleware");

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.signIn);
router.post("/update-user", authUserMiddleware, UserController.updateUser);
router.post("/update-user-admin", UserController.updateUserAdmin);
router.post("/change-password", authUserMiddleware, UserController.changePassword);
router.get("/get-user", authUserMiddleware, UserController.getUserDetail);
router.get("/get-all-user", authMiddleWare, UserController.getAllUser);
router.post("/delete-user", authMiddleWare, UserController.deleteUser);
router.post("/save-history", authUserMiddleware, UserController.saveFilm);
router.post("/toggle-like-film", authUserMiddleware, UserController.toggleLikeFilm);
router.post("/unlike-film", authUserMiddleware, UserController.unLikeFilm);
router.get("/test", UserController.test);
router.post("/refresh-token", authUserMiddleware, UserController.refreshToken);

module.exports = router;
