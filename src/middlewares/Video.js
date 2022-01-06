const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

uuidv4();

const videoStorage = multer.diskStorage({
  destination: "videos",
  filename: (req, file, cb) => {
    const id = uuidv4();
    const token = req.token;
    const filename = `${token._id.toString()}-${id}`;
    req.filename = filename;
    cb(null, filename);
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp4|avi|flv)$/)) {
      return cb(new Error("Video format not supported"));
    }
    cb(undefined, true);
  },
});

module.exports = { videoStorage, videoUpload };
