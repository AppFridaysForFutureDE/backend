const fs = require("fs");
const readline = require("readline");
const { google, drive } = require("googleapis");

export class DriveAdmin {
  public async loadFileById(id: string): Promise<void> {
    // TODO: move auth code to initializer
    const scopes = ["https://www.googleapis.com/auth/drive"];

    const credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      "");

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      scopes
    );

    const drive = google.drive({ version: "v3", auth });

    // TODO: return early if file already present
    const dest = fs.createWriteStream(`/var/image-data/${id}`);
    drive.files
      .get({
        fileId: id,
        alt: "media"
      })
      .on("end", function() {
        // TODO: Return promise success ?
        console.log("Done");
      })
      .on("error", function(err) {
        // TODO: Throw error?
        console.log("Error during download", err);
      })
      .pipe(dest);
  }
}
