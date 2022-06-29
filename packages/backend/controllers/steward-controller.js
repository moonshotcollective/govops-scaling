const Steward = require("../models/steward-model");

createSteward = async (req, res) => {
  await Steward.create(
    {
      id: req.query.address,
      name: req.query.name,
      username: req.query.username,
      stewardSince: req.query.stewardSince,
      votingPower: req.query.votingPower,
      latestActivity: [],
      score: req.query.score,
    },
    (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res
        .status(200)
        .json({ success: true, data: "Steward was created successfully." });
    }
  );
};

getStewards = async (req, res) => {
  await Steward.find(req.query, (err, stewards) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!stewards.length) {
      return res
        .status(200)
        .json({ success: false, error: "Stewards not found" });
    }
    return res.status(200).json({ success: true, data: stewards });
  })
    .clone()
    .catch((err) => console.error(err));
};

getSteward = async (req, res) => {
  await Steward.find({ id: req.query.address }, (err, steward) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!steward.length) {
      return res
        .status(200)
        .json({ success: false, error: "Steward not found" });
    }
    return res.status(200).json({ success: true, data: steward });
  })
    .clone()
    .catch((err) => console.error(err));
};

module.exports = {
  createSteward,
  getSteward,
  getStewards,
};
