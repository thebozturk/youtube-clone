const Video = require("../models/Video");
const Comment = require("../models/Comment");
const PlayList = require("../models/Playlist");
const fs = require("fs");
const { IncomingForm } = require("formidable");

class VideoController {
  async upload(req, res) {
    const newVideo = new Video({
      owner: req.token._id,
      name: req.body.name,
      videopath: req.filename,
    });
    try {
      const savedVideo = await newVideo.save();
      return res.status(201).json({
        msg: "Video uploaded successfully",
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Error uploading video",
        error,
      });
    }
  }

  stream(req, res) {
    const range = req.headers.range;
    if (!range) {
      return res.status(416).send("Range header is required");
    }

    const videopath = `videos/${req.params.filename}`;
    const videosize = fs.statSync(videopath).size;

    const start = Number(range.replace(/\D/g, ""));
    const chunksize = 10 ** 6;
    const end = Math.min(start + chunksize, videosize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Length": contentLength,
      "Accept-Ranges": "bytes",
      "Content-Type": "video/mp4",
      "Content-Range": `bytes ${start}-${end}/${videosize}`,
    };
    res.writeHead(206, headers);
    const videostream = fs.createReadStream(videopath, { start, end });
    videostream.pipe(res);
  }

  update(req, res) {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          msg: "Error updating video",
          error: err,
        });
      }
      const name = fields;
      const _id = req.params?.id;

      if (!name) {
        return res.status(400).json({
          msg: "Name is required",
        });
      }

      Video.findOneAndUpdate({ _id }, name, { new: true }, (err, video) => {
        if (err) {
          return res.status(500).json({
            msg: "Error updating video",
            error: err,
          });
        }
        if (!video) {
          return res.status(404).json({
            msg: "Video not found",
          });
        }
        return res.status(200).json({
          msg: "Video updated successfully",
          video,
        });
      });
    });
  }

  delete(req, res) {
    const _id = req.params?.id;
    const videoPath = req.params?.video_path;

    if (!_id) {
      return res.status(400).json({
        msg: "Id is required",
      });
    }

    Video.findOneAndDelete({ _id }, (err, video) => {
      if (err) {
        return res.status(500).json({
          msg: "Error deleting video",
          error: err,
        });
      }
      if (!video) {
        return res.status(404).json({
          msg: "Video not found",
        });
      }
      fs.unlinkSync(`videos/${videoPath}`);
      return res.status(200).json({
        msg: "Video deleted successfully",
      });
    });
  }

  like(req, res) {
    const video_id = req.params?.id;
    Video.findOneAndUpdate(
      { _id: video_id },
      { $inc: { likes: 1 } },
      (err, video) => {
        if (err) {
          return res.status(500).json({
            msg: "Error liking video",
            error: err,
          });
        }
        if (!video) {
          return res.status(404).json({
            msg: "Video not found",
          });
        }
        return res.status(200).json({
          msg: "Video liked successfully",
          video,
        });
      }
    );
  }
  dislike(req, res) {
    const video_id = req.params?.id;
    Video.findOneAndUpdate(
      { _id: video_id },
      { $inc: { dislikes: 1 } },
      (err, video) => {
        if (err) {
          return res.status(500).json({
            msg: "Error disliking video",
            error: err,
          });
        }
        if (!video) {
          return res.status(404).json({
            msg: "Video not found",
          });
        }
        return res.status(200).json({
          msg: "Video disliked successfully",
          video,
        });
      }
    );
  }

  async comment(req, res) {
    const token = req.token;
    const video_id = req.params?.id;

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          msg: "Error commenting video",
          error: err,
        });
      }
      const comment = fields;
      if (!comment) {
        return res.status(400).json({
          msg: "Comment is required",
        });
      }

      const newComment = new Comment({
        owner: token._id,
        comment: fields.comment,
      });
      const savedComment = await newComment.save();
      Video.findOneAndUpdate(
        { _id: video_id },
        { $push: { comments: savedComment } },
        { new: true },
        (err, video) => {
          if (err) {
            return res.status(500).json({
              msg: "Error commenting video",
              error: err,
            });
          }
          if (!video) {
            return res.status(404).json({
              msg: "Video not found",
            });
          }
          return res.status(200).json({
            msg: "Comment added successfully",
            video,
          });
        }
      );
    });
  }

  replyComment(req, res) {
    const token = req.token;

    const form = new IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          msg: "Error replying comment",
          error: err,
        });
      }
      const comment_id = req.params?.id;

      if (!comment_id) {
        return res.status(400).json({
          msg: "Comment id is required",
        });
      }

      const newComment = new Comment({
        owner: token._id,
        comment: fields.comment,
      });

      const savedComment = await newComment.save();

      Comment.findOneAndUpdate(
        { _id: comment_id },
        { $push: { replies: savedComment } },
        { new: true },
        (err, comment) => {
          if (err) {
            return res.status(500).json({
              msg: "Error replying comment",
              error: err,
            });
          }
          if (!comment) {
            return res.status(404).json({
              msg: "Comment not found",
            });
          }
          return res.status(200).json({
            msg: "Comment replied successfully",
            comment,
          });
        }
      );
    });
  }

  async GetVideo(req, res) {
    const video_id = req.params?.id;

    const data = await Video.findOne({ _id: video_id });

    if (!data) {
      return res.status(404).json({
        msg: "Video not found",
      });
    }
    return res.status(200).json({
      msg: "Video found",
      data,
    });
  }

  async createPlayList(req, res) {
    const token = req.token;
    const name = req.params?.name;
    const newPlayList = new PlayList({
      owner: token._id,
      playlistname: name,
    });

    const savedPlayList = await newPlayList.save();
    return res.status(200).json({
      msg: "Playlist created successfully",
    });
  }
}

module.exports = VideoController;
