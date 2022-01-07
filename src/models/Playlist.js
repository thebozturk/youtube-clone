const Mongoose = require("mongoose");

const PlayList = new Mongoose.Schema({
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  videos: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  playlistname: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("PlayList", PlayList);
