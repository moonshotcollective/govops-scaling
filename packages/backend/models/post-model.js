const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema(
    {
        
    },
    { timestamps: true }
)

module.exports = mongoose.model("posts", Post);