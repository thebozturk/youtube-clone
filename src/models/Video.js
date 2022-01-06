const Mongoose = require("mongoose");

const VideoSchema = new Mongoose.Schema({
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    required: true,
  },
  videopath: {
    type: String,
    required: true,
    unique: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Array,
    default: [],
  },
  comments: [
    {
      type: Array,
      default: [],
    },
  ],
});

module.exports = Mongoose.model("Videos", VideoSchema);
