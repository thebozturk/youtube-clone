const Video = require("../models/Video");
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
}

module.exports = VideoController;
