const express = require("express");
const { uploadFiles, fetchData, upload } = require("../controller");
const router = express.Router();

router.post("/uploads", upload.any(), uploadFiles);
router.get("/products", fetchData);

module.exports = router;
