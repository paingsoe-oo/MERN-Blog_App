const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  generateVerificationTokenCtrl,
  forgetPasswordToken,
  accountVerfiicationCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,

} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const { 
  photoUpload,
  profilePhotoResize
} = require("../../middlewares/uploads/photoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.post("/send-mail", generateVerificationTokenCtrl); //Have sendgrid error
userRoutes.post("/generate-verify-email-token", authMiddleware, generateVerificationTokenCtrl); //Error: send grid error
userRoutes.put("/verify-account", authMiddleware, accountVerfiicationCtrl);
userRoutes.put(
  "/profilephoto-upload", 
  authMiddleware, 
  photoUpload.single('image'), 
  profilePhotoResize,
  profilePhotoUploadCtrl
);
userRoutes.post("/forget-password-token", authMiddleware, forgetPasswordToken);
userRoutes.put("/reset-password", authMiddleware, passwordResetCtrl);
userRoutes.get("/", authMiddleware, fetchUsersCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.put("/follow", authMiddleware, followingUserCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unblockUserCtrl);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/:id", authMiddleware, updateUserCtrl);
userRoutes.delete("/:id", deleteUsersCtrl);
userRoutes.get("/:id", fetchUserDetailsCtrl);

module.exports = userRoutes;
