const express = require("express");
const router = express.Router();
const multer = require("multer");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const imageController = require("../controllers/imageController");
const userController = require("../controllers/userController");
const filterController = require("../controllers/filterController");
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
  "/user/:id/delete",
  authMiddleware.authenticateToken,
  adminController.deleteUser,
);
router.delete(
  "/cats/:id/delete",
  authMiddleware.authenticateToken,
  adminController.deleteCat,
);
router.patch(
  "/user/:id/block",
  authMiddleware.authenticateToken,
  adminController.blockUser,
);

// Auth routes
router.post("/register", authController.register);
router.get("/activate/:id", authController.activate);
router.post("/reactivate", authController.reactivate);
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
  upload.array("files", 10),
  imageController.uploadImages,
);

// Profile routes
router.get("/user-profile/:id", userController.getOneUser);
router.get("/user", authMiddleware.authenticateToken, userController.getUser);
router.get(
  "/user/matches-archive",
  authMiddleware.authenticateToken,
  userController.getOwnedCats,
);
router.get(
  "/user/felines-records",
  authMiddleware.authenticateToken,
  userController.getSentToAdoptionCats,
);
router.patch(
  "/user/edit",
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
  "/user/delete",
  authMiddleware.authenticateToken,
  userController.deleteUser,
);

// Filter routes
router.get("/breeds", filterController.getAllBreeds);
router.get("/age-types", filterController.getAgeType);
router.get("/recent-cats", filterController.getRecentCats);
router.get("/health-problems", filterController.getHealthProblems);
router.get("/cats-by-breed/:catId", filterController.getCatsByBreed);
router.get("/cats-by-user/:catId", filterController.getCatsOfUser);
router.get("/colors", filterController.getColors);

// Cat routes
router.get("/cats", catController.getAllCats);
router.get("/cats/cat/:id", catController.getOneCat);
router.post(
  "/cats/add",
  authMiddleware.authenticateToken,
  catController.addCat,
);
router.patch(
  "/cats/edit/:id",
  authMiddleware.authenticateToken,
  catController.editCat,
);
router.delete(
  "/cats/delete/:id",
  authMiddleware.authenticateToken,
  catController.deleteCat,
);

// Adoption request routes
router.post(
  "/adopt/:id/request",
  authMiddleware.authenticateToken,
  adoptionRequestController.adoptCat,
);
router.get(
  "/adopt/:catId/validate",
  authMiddleware.authenticateToken,
  adoptionRequestController.validateAdoptionRequest,
);
router.patch(
  "/adopt/:id/response",
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
  "/adopt/:id/delete",
  authMiddleware.authenticateToken,
  adoptionRequestController.deleteAdoptionRequest,
);

// Favorite routes
router.get(
  "/favorites",
  authMiddleware.authenticateToken,
  favoriteController.getFavorites,
);
router.get(
  "/favorite/:id",
  authMiddleware.authenticateToken,
  favoriteController.getOneFavorite,
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
  "/favorite/:id/delete",
  authMiddleware.authenticateToken,
  favoriteController.deleteFavorite,
);

module.exports = router;
