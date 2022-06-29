const express = require("express");

const ProposalController = require("../controllers/proposal-controller");

const router = express.Router();

router.post("/proposal", ProposalController.createProposal);
router.put("/proposal", ProposalController.updateProposal);
router.put("/proposal_options", ProposalController.updateProposalOptions);
router.delete("/proposal/id", ProposalController.deleteProposal);
router.get("/proposal/id", ProposalController.getProposal);
router.get("/proposals", ProposalController.getProposals);

module.exports = router;
