const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const postRoute = require("./route/posts/postRoute");
const commentRouter = require("./route/comments/commentRoute");
const categoryRoute  = require("./route/category/categoryRoute");


const app = express();
//DB
dbConnect();

//Middleware
app.use(express.json());

//Users route
app.use("/api/users", userRoutes);
//Post route
app.use("/api/posts", postRoute);
//comment route
app.use("/api/comments", commentRouter);
//category route
app.use("/api/category", categoryRoute);

//err handler
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running ${PORT}`));
