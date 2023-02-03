const express = require('express');


const { 
  createPostCtrl, 
  fetchPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
  toggleAddLikeToPostCtrl
} = require('../../controllers/posts/postCtrl');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { 
  photoUpload,
  postImgResize
 } = require('../../middlewares/uploads/photoUpload');

const postRoute = express.Router();

postRoute.post(
  '/', 
  authMiddleware,  
  photoUpload.single('image'), 
  postImgResize,
  createPostCtrl
);
postRoute.put("/likes", authMiddleware, toggleAddLikeToPostCtrl);
postRoute.get("/", fetchPostsCtrl);
postRoute.get("/:id", fetchPostCtrl);
postRoute.put("/:id", authMiddleware, updatePostCtrl);
postRoute.delete("/:id", authMiddleware, deletePostCtrl);

module.exports = postRoute;