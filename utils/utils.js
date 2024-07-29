const { GoogleAuthorityCode } = require("./google");
const { saveDNToDB, getUploadedDN } = require("../model");
const { getAllFilesInGD } = require("../controller");

function compare(filesNDb, filesNGd) {
  const missingRecs = [];

  if (filesNDb.length > filesNGd.length) {
    console.log("There is more files in database than in google drive");
    // call a function to equilibrate records accordingly
  } else {
    console.log("There is more files in google drive than in database");
    // call a function to equilibrate records accordingly
    for (let i = 0; i < filesNGd.length; i++) {
      const missing = filesNDb.some((element) => element === filesNGd[i].id);

      if (!missing) {
        missingRecs.push(filesNGd[i]);
      }
    }
  }
  return missingRecs;
}

async function reconciliation(filesNDb, filesNGd) {
  const listToAdd = compare(filesNDb, filesNGd);
  const g = new GoogleAuthorityCode();
  const resultArr = [];

  for (let i = 0; i < listToAdd.length; i++) {
    const gdDetails = await g.getResultDataObjectWitCustomDetails(
      listToAdd[i].id,
      listToAdd[i].name
    );
    resultArr.push(gdDetails);

    // Add to to DB right away
    // await saveDNToDB(gdDetails);

    try {
      await saveDNToDB(gdDetails);
    } catch (error) {
      console.log(error.message);
      console.log(gdDetails);
    } finally {
      continue;
    }
  }
}

async function performReconciliation() {
  const filesInGD = await getAllFilesInGD();
  const filesInDB = await getUploadedDN();

  await reconciliation(filesInDB, filesInGD);
}

module.exports = {
  reconciliation,
  performReconciliation,
};
