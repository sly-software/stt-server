const fs = require("fs");
const { google } = require("googleapis");

class GoogleAuthorityCode {
  constructor() {
    this.fileData = {};

    this.auth = new google.auth.GoogleAuth({
      keyFile: `${__dirname}/sensitiveinformation.json`,
      scopes: "https://www.googleapis.com/auth/drive",
    });

    this.driveServices = google.drive({ version: "v3", auth: this.auth });
  }

  fileMetadata(file) {
    return {
      name: file.originalname,
      parents: [process.env.DN_FOLDER_IN_GDRV],
    };
  }

  media(file) {
    return {
      mimeType: file.mimeType,
      body: fs.createReadStream(file.path),
    };
  }

  /**
   * Generate GD link based on the supplied ID
   * @param {string} id
   * @returns String
   */
  async getVnDLinks(id) {
    const links = await this.driveServices.files.get({
      fileId: id,
      fields: "webViewLink, webContentLink",
    });

    return links;
  }

  /**
   * To be used when uploading new files
   * @returns Object this.fileData
   */
  async getResultDataObject(file) {
    const gdId = await this.driveServices.files.create({
      requestBody: this.fileMetadata(file),
      media: this.media(file),
      fields: "id",
    });

    this.fileData.fileId = gdId.data.id;

    const links = await this.getVnDLinks(this.fileData.fileId);

    // We will use later for saving files during reconciliations
    // console.log(links.headers.date)

    this.fileData.filename = file.originalname;
    this.fileData.uploaddate = new Date();
    this.fileData.downloadLink = links.data.webContentLink;
    this.fileData.viewLink = links.data.webViewLink;

    // Delete this file in server
    this.cleanServer(file);

    return this.fileData;
  }

  /**
   * To be used during reconciliation
   * @param {string} id
   * @param {string} fileName
   * @returns Object this.fileData
   */
  async getResultDataObjectWitCustomDetails(id, fileName) {
    const links = await this.getVnDLinks(id);

    this.fileData.fileId = id;
    this.fileData.filename = fileName;
    this.fileData.uploaddate = new Date();
    this.fileData.downloadLink = links.data.webContentLink;
    this.fileData.viewLink = links.data.webViewLink;

    return this.fileData;
  }

  /**
   * Delete a file with a given ID
   * @param {String} id
   */
  async deleteFileInGDrive(id) {
    try {
      const response = await this.driveServices.files.delete({
        fileId: id,
      });

      console.log(response.data, response.status);
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
   * Return an array of all files in google drive currently
   * @returns Array
   */
  async getAllFilesInGD() {
    try {
      const response = await this.driveServices.files.list({
        fields: "files(name, id)",
      });

      const files = response.data.files;
      return files;
    } catch (error) {
      console.error("Error listing files: ", error.message);
    }
  }

  cleanServer(file) {
    setTimeout(() => {
      const filename = file.originalname;
      fs.unlink(file.path, (err) => {
        if (err) console.log(err);
        console.log(`File with name ${filename} deleted.`);
      });
    }, 1000 * 60 * 0.5);
  }
}

module.exports = {
  GoogleAuthorityCode,
};
