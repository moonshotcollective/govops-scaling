const express = require("express");

const ProposalController = require("../controllers/proposal-controller");

const router = express.Router();

router.post("/proposal", ProposalController.createProposal);
router.get("/proposal", ProposalController.getProposal);
router.get("/proposals", ProposalController.getProposals);

module.exports = router;
