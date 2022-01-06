const express = require("express");
const Authenticate = require("../middlewares/Authenticate");
const { videoUpload, videoStorage } = require("../middlewares/Video");
const Video = require("../controllers/Video");

const router = express.Router();

const Controller = new Video();

router.post("/", Authenticate, videoUpload.single("video"), (req, res) => {
  Controller.upload(req, res);
});

router.get("/:filename", (req, res) => {
  Controller.stream(req, res);
});

router.patch("/:id", Authenticate, (req, res) => {
  Controller.update(req, res);
});
router.delete("/:id/:video_path", Authenticate, (req, res) => {
  Controller.delete(req, res);
});

module.exports = router;
