const express = require("express");
const Authenticate = require("../middlewares/Authenticate");
const { videoUpload, videoStorage } = require("../middlewares/Video");
const Video = require("../controllers/Video");

const router = express.Router();

const Controller = new Video();

router.post("/", Authenticate, videoUpload.single("video"), (req, res) => {
  Controller.upload(req, res);
});

router.get("/:filename/:ip", (req, res) => {
  Controller.stream(req, res);
});

router.patch("/:id", Authenticate, (req, res) => {
  Controller.update(req, res);
});
router.delete("/:id/:video_path", Authenticate, (req, res) => {
  Controller.delete(req, res);
});

router.get("/video-like/:id", (req, res) => {
  Controller.like(req, res);
});

router.get("/video-dislike/:id", (req, res) => {
  Controller.dislike(req, res);
});

router.post("/video-comment/:id", Authenticate, (req, res) => {
  Controller.comment(req, res);
});

router.post("/reply-comment/:id", Authenticate, (req, res) => {
  Controller.replyComment(req, res);
});

router.get("/video-details/:id", (req, res) => {
  Controller.GetVideo(req, res);
});

router.get("/create-playlist/:name", (req, res) => {
  Controller.createPlayList(req, res);
});

module.exports = router;
