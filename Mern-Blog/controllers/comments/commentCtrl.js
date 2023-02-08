const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/comment");
const validateMongodbId = require("../../utils/validateMongodbID");

//Create
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);

  //1.Get the user
  const user = req.user;
  //2.Get the post Id
  const { postId, description } = req.body;

  try {

    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });

    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//Fetch all comments
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//Comment details
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//Update
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const update = await Comment.findByIdAndUpdate(id, {
      post: req.body?.postId,
      user: req?.user,
      description: req?.body?.description,
    }, { new: true, runValidators: true});
    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

//Delete
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl
}