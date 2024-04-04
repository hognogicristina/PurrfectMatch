const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const imageController = require("../controllers/imageController");
const userController = require("../controllers/userController");
const catController = require("../controllers/catController");
const adoptionRequestController = require("../controllers/adoptionRequestController");
const favoriteController = require("../controllers/favoriteController");
const authMiddleware = require("../middlewares/authMiddleware");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/users",
  authMiddleware.authenticateToken,
  adminController.getAllUsers,
);
router.delete(
  "/user/:id",
  authMiddleware.authenticateToken,
  adminController.deleteUser,
);
router.delete(
  "/cats/:id",
  authMiddleware.authenticateToken,
  adminController.deleteCat,
);

router.post("/register", authController.register);
router.get("/activate/:id", authController.activate);
router.post("/login", authMiddleware.authenticateLogin, authController.login);
router.post("/reset", authController.resetPasswordRequest);
router.post("/reset/:id", authController.resetPassword);
router.post("/logout", authController.logout);
router.post(
  "/refresh/token",
  authMiddleware.validateRefreshToken,
  authController.refresh,
);

router.post("/upload", upload.single("file"), imageController.uploadImage);

router.get(
  "/user",
  authMiddleware.authenticateToken,
  userController.getOneUser,
);
router.put("/user", authMiddleware.authenticateToken, userController.editUser);
router.put(
  "/user/address",
  authMiddleware.authenticateToken,
  userController.editAddressUser,
);
router.put(
  "/user/username",
  authMiddleware.authenticateToken,
  userController.editUsername,
);
router.put(
  "/user/password",
  authMiddleware.authenticateToken,
  userController.editPassword,
);
router.delete(
  "/user",
  authMiddleware.authenticateToken,
  userController.deleteUser,
);
router.get(
  "/user/cats",
  authMiddleware.authenticateToken,
  userController.getMyCats,
);

router.get("/cats", catController.getAllCats);
router.get("/cat/:id", catController.getOneCat);
router.post(
  "/cat",
  authMiddleware.authenticateToken,
  upload.single("file"),
  catController.addCat,
);
router.put(
  "/cat/:id",
  authMiddleware.authenticateToken,
  upload.single("file"),
  catController.editCat,
);
router.delete(
  "/cat/:id",
  authMiddleware.authenticateToken,
  catController.deleteCat,
);

router.post(
  "/adopt/:id",
  authMiddleware.authenticateToken,
  adoptionRequestController.adoptCat,
);
router.put(
  "/adopt/:id",
  authMiddleware.authenticateToken,
  adoptionRequestController.handleAdoptionRequest,
);
router.get(
  "/adopts",
  authMiddleware.authenticateToken,
  adoptionRequestController.getAdoptionRequests,
);
router.get(
  "/adopt/:id",
  authMiddleware.authenticateToken,
  adoptionRequestController.getAdoptionRequest,
);
router.delete(
  "/adopt/:id",
  authMiddleware.authenticateToken,
  adoptionRequestController.deleteAdoptionRequest,
);

router.get(
  "/favorites",
  authMiddleware.authenticateToken,
  favoriteController.getFavorites,
);
router.post(
  "/cat/:id/favorite",
  authMiddleware.authenticateToken,
  favoriteController.addCatToFavorites,
);
router.post(
  "/favorites/:id",
  authMiddleware.authenticateToken,
  favoriteController.adoptFavorite,
);
router.delete(
  "/favorite/:id",
  authMiddleware.authenticateToken,
  favoriteController.deleteFavorite,
);

module.exports = router;
