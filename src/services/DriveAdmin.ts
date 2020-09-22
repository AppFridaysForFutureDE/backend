import * as fs from "fs";
import { google } from "googleapis";

export class DriveAdmin {
  private drive;

  public async initConnection(): Promise<void> {
    try {
      const scopes = ["https://www.googleapis.com/auth/drive"];

      const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        "");

      const auth = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        scopes
      );

      this.drive = await google.drive({ version: "v3", auth });
    } catch (e) {
      console.log("Could not access google drive api");
      console.log(e);
    }
  }

  public async getFileType(fileId: string): Promise<string> {
    const res = await this.drive.files.get({ fileId });
    return res.data.mimeType.split("/")[1];
  }

  public async loadFile(fileId: string, fileName: string): Promise<void> {
    const filePath = `/var/image-data/${fileName}`;

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
