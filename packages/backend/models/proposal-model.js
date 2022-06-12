const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Propsal = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    contentRaw: { type: String, required: true },
    latestActivity: { type: Array, required: true },
    score: { type: Number, required: true },
    staked: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proposals", Propsal);
