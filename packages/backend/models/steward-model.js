const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Steward = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    stewardSince: { type: String, required: true },
    votingPower: { type: Number, required: true },
    latestActivity: { type: Array, required: true },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("stewards", Steward);
