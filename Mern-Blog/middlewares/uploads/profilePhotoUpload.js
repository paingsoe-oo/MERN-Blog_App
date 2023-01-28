const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const profilePhotoUpload = multer({
  storage: multerStorage, 
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

const profilePhotoResize = async (req, res, next) => {
  if(!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  console.log('Resizing', req.file);

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({qualit: 90})
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

    next();
}

module.exports = { 
  profilePhotoUpload,
  profilePhotoResize
};
