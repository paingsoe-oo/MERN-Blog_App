const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/post");
const validateMongodbId = require("../../utils/validateMongodbID");
const Filter = require("bad-words");
const fs = require("fs");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");


//Create Post 
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  
  const { _id } = req.user;

  //validateMongodbId(req.body.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);


  if(isProfane) {
    const user = await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error("Creating Failed because it contains profane words and you have been blocked");
  }

  //1.Get the path to img
  //const localPath =  `public/images/posts/${req.file.filename}`; //temp
  //2.Upload to cloudinary
  //const imgUploaded = await cloudinaryUploadImg(localPath); // temp

  try {
    const post = await Post.create({
      ...req.body, 
      //image: imgUploaded?.url, //temp
      user: _id,
    });
    res.json(post);
    //Remove uploaded img
    //fs.unlinkSync(localPath); //temp
  } catch (error) { 
    res.json(error);
  }
});

//Fetch all posts
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user");
    res.json(posts);
  } catch (error) {
    
  }
});

//Fetch single posts
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {

  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findById(id).populate("user");
    //Update number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1},
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//Update post
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findByIdAndUpdate(id, {
      ...req.body,
      user: req.user?._id,
    }, {new: true, });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//Delete post
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findOneAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  deletePostCtrl,
  updatePostCtrl,
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl
};