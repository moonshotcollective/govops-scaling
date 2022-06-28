const express = require("express");

const StewardController = require("../controllers/steward-controller");

const router = express.Router();

router.get("/stewards", StewardController.createSteward);
router.get("/steward", StewardController.getSteward);
router.get("/stewards", StewardController.getStewards);

module.exports = router;
