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

// Admin routes
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

// Auth routes
router.post("/register", authController.register);
router.get("/activate/:id", authController.activate);
router.post("/login", authMiddleware.authenticateLogin, authController.login);
router.post("/reset", authController.resetPasswordRequest);
router.post("/reset/:id", authController.resetPassword);
router.post("/logout", authMiddleware.authenticateToken, authController.logout);
router.post(
  "/refresh/token",
  authMiddleware.validateRefreshToken,
  authController.refresh,
);

// Image routes
router.post(
  "/upload",
  authMiddleware.authenticateToken,
  upload.single("file"),
  imageController.uploadImage,
);

// User routes
router.get(
  "/user",
  authMiddleware.authenticateToken,
  userController.getOneUser,
);
router.patch(
  "/user",
  authMiddleware.authenticateToken,
  userController.editUser,
);
router.patch(
  "/user/address",
  authMiddleware.authenticateToken,
  userController.editAddressUser,
);
router.patch(
  "/user/username",
  authMiddleware.authenticateToken,
  userController.editUsername,
);
router.patch(
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

// Cat routes
router.get("/cats", catController.getAllCats);
router.get("/cat/:id", catController.getOneCat);
router.post("/cat", authMiddleware.authenticateToken, catController.addCat);
router.patch(
  "/cat/:id",
  authMiddleware.authenticateToken,
  catController.editCat,
);
router.delete(
  "/cat/:id",
  authMiddleware.authenticateToken,
  catController.deleteCat,
);

// Adoption request routes
router.post(
  "/adopt/:id",
  authMiddleware.authenticateToken,
  adoptionRequestController.adoptCat,
);
router.patch(
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

// Favorite routes
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
