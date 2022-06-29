const mongoose = require("mongoose");

const { Schema } = mongoose;

const Post = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("posts", Post);
