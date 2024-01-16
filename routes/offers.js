const express = require("express");
const { getOffers, addNewOfferToDB } = require("../controller");
const router = express.Router();

router.get("/offers", getOffers);
router.post("/addOffer", addNewOfferToDB)

module.exports = router;