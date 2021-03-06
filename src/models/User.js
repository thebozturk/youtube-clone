const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema(
  {
    username: String,
    password: String,
    email: {
      type: String,
      unique: true,
    },
    videos: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "videos",
      },
    ],
    subscribers: {
      type: Array,
      default: [],
    },
    userScribedChannels: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const User = Mongoose.model("users", UserSchema);
module.exports = { User };
