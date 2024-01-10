const express = require("express");
const { uploadFiles, fetchData, upload, getCurrentStockLogs } = require("../controller");
const router = express.Router();

router.post("/uploads", upload.any(), uploadFiles);
router.get("/products", fetchData);
router.get("/logs", getCurrentStockLogs);
router.get("/healthCheck", (req, res) => {
    res.json({ message: "Healthy" })
  })

module.exports = router;
