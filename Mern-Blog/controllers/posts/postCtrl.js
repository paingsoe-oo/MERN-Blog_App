const expressAsyncHandler = require("express-async-handler");
const Post = require("../../model/post/post");
const validateMongodbId = require("../../utils/validateMongodbID");
const Filter = require("bad-words");
const fs = require("fs");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");



const createPostCtrl = expressAsyncHandler(async (req, res) => {
  
  const { _id } = req.user;

  //validateMongodbId(req.body.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //console.log(isProfane);


  if(isProfane) {
    const user = await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error("Creating Failed because it contains profane words and you have been blocked");
  }

  //1.Get the path to img
  const localPath =  `public/images/posts/${req.file.filename}`;
  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body, 
      image: imgUploaded?.url,
      user: _id,
    });
    res.json(post);
    //Remove uploaded img
    fs.unlinkSync(localPath);
  } catch (error) { 
    res.json(error);
  }
});

module.exports = {
  createPostCtrl
};