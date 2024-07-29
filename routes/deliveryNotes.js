const express = require("express");
const router = express.Router();
const {
  uploadDNmetada,
  upload,
  getAllFilesInGD,
  deleteFileInServer,
} = require("../controller");
const { getUploadedDN } = require("../model");
const { reconciliation } = require("../utils/utils");

router.post("/notes", upload.any("files"), async (req, res) => {
  try {
    const DNsFromDB = await getUploadedDN();

    const recordExist = DNsFromDB.some(
      (file) => file.filename === req.files[0].filename
    );

    // console.log(recordExist);

    if (!recordExist) {
      const response = await uploadDNmetada(req);
      res.json(response);
    } else {
      res.json({ message: "Record Exists!!" });
      deleteFileInServer(req.files[0]);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
});

router.get("/dns", async (req, res) => {
  try {
    let response = await getUploadedDN();
    console.log(req.user.name);
    // response = [ ...response, { name: req.user.name } ]
    // console.log(response)
    res.json(response);
  } catch (error) {
    res.json({ message: "error" });
    console.error(error.message);
  }
});

router.get("/reconciliation", async (req, res) => {
  try {
    const filesInGD = await getAllFilesInGD();
    const filesInDB = await getUploadedDN();

    await reconciliation(filesInDB, filesInGD);

    res.json({ message: "Reconciliation completed successfully"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send();
  }
});

// router.delete("/deleteFileInDrive", async (req, res) => {
//   const id = "1-7h9KcDMMQlca8AM0CPFJdm8Z0fAP0u3";
//   await deleteFileInDrive(id);
// });

module.exports = router;
