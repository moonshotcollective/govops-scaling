const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Option = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    amountRequested: { type: Number, required: true },
  }
)

const Propsal = new Schema(
  {
    id: { type: Number, required: true },
    title: { type: String, required: true },
    contentRaw: { type: String, required: true },
    latestActivity: { type: Array, required: false },
    score: { type: Number, required: true },
    staked: { type: Number, required: true },
    options: { type: [Option], required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("proposals", Propsal);
