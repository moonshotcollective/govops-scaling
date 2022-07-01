const Proposal = require("../models/proposal-model");

createProposal = async (req, res) => {
  await Proposal.create(
    {
      id: req.body.id,
      title: req.body.topic_slug,
      contentRaw: req.body.raw,
      latestActivity: req.body.latestActivity,
      // score: req.body.score,
      // staked: req.body.staked,
      options: req.body.options,
    },
    (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res
        .status(200)
        .json({ success: true, data: "Proposal was created successfully" });
    }
  );
};

updateProposal = async (req, res) => {
  await Proposal.updateOne(
    { _id: req.body.id },
    {
      id: req.body.id,
      title: req.body.topic_slug,
      contentRaw: req.body.raw,
      latestActivity: req.body.latestActivity,
      // score: req.body.score,
      // staked: req.body.staked,
      options: req.body.options,
    },
    (err, proposal) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res.status(200).json({ success: true, data: proposal });
    }
  )
    .clone()
    .catch((err) => console.error(err));
};

updateProposalOptions = async (req, res) => {
  await Proposal.updateOne(
    { _id: req.body.id },
    {
      options: req.body.options,
    },
    (err, proposal) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      return res.status(200).json({ success: true, data: proposal });
    }
  )
    .clone()
    .catch((err) => console.error(err));
};

deleteProposal = async (req, res) => {
  await Proposal.deleteOne({ id: req.params.id }, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    return res.status(200).json({ success: true, data: "Proposal deleted" });
  })
    .clone()
    .catch((err) => console.log(err));
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
  });
};

getProposals = async (req, res) => {
  await Proposal.find(req.query, (err, proposals) => {
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
  updateProposal,
  updateProposalOptions,
  deleteProposal,
  getProposal,
  getProposals,
};
