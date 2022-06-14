const Proposal = require("../models/proposal-model");

createProposal = (req, res) => {
  Proposal.create(
    {
      id: req.query.id,
      title: req.query.title,
      contentRaw: req.query.contentRaw,
      latestActivity: req.query.latestActivity,
      score: req.query.score,
      staked: req.query.staked,
    },
    (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res
        .status(200)
        .json({ success: true, data: "Proposal was created successfully." });
    }
  );
};

getProposal = async (req, res) => {
    await Proposal.find({ id: req.query.id }, (err, proposal) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
          }
          if (!steward.length) {
            return res
              .status(200)
              .json({ success: false, error: "Proposal not found" });
          }
          return res.status(200).json({ success: true, data: proposal });
    })
};

getProposals = async (req, res) => {
    await Steward.find(req.query, (err, proposals) => {
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        if (!proposals.length) {
          return res
            .status(200)
            .json({ success: false, error: "Proposals not found" });
        }
        return res.status(200).json({ success: true, data: proposals });
      })
        .clone()
        .catch((err) => console.error(err));
};

module.exports = {
  createProposal,
  getProposal,
  getProposals,
};
