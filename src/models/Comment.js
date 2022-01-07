const Mongoose = require("mongoose");

const CommentSchema = new Mongoose.Schema({
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
  },
  dislike: {
    type: Number,
    default: 0,
  },
  replies: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
});

module.exports = Mongoose.model("Comment", CommentSchema);
