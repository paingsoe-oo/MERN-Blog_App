const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/comment");


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

module.exports = {
  createCommentCtrl,
}