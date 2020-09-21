const fs = require("fs");
const readline = require("readline");
const { google, drive } = require("googleapis");

export class DriveAdmin {
  private drive;

  public async initConnection() {
    try {
      const scopes = ["https://www.googleapis.com/auth/drive"];

      const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        "");

      const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        scopes
      );

      this.drive = await google.drive({ version: "v3", auth });
    } catch (e) {
      console.log("Could not access google drive api");
      console.log(e);
    }
  }

  public async loadFileById(fileId: string): Promise<void> {
    // TODO: add image type to filename?

    const filePath = `/var/image-data/${fileId}`;

    if (fs.existsSync(filePath)) {
      console.log(`image already downloaded ${fileId}`);
      return Promise.resolve();
    }

    console.log(`downloading image ${fileId}`);
    const dest = fs.createWriteStream(filePath);
    const res = await this.drive.files.get(
      { fileId, alt: "media" }, //mimeType: 'image/jpg'},
      { responseType: "stream" }
    );
    await new Promise((resolve, reject) => {
      res.data
        .on("error", reject)
        .pipe(dest)
        .on("error", reject)
        .on("finish", resolve);
    });
  }
}
