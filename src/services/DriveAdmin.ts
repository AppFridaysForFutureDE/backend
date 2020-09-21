const fs = require("fs");
const readline = require("readline");
const { google, drive } = require("googleapis");

export class DriveAdmin {
  public async loadFileById(fileId: string): Promise<void> {
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

    const drive = await google.drive({ version: "v3", auth });


    /* const fileId = '1EkgdLY3T-_9hWml0VssdDWQZLEc8qqpMB77Nvsx6khA'; */
    /* const destPath = path.join(os.tmpdir(), 'important.pdf'); */
    const filePath = `/var/image-data/${fileId}`

    if (fs.existsSync(filePath)) {
      console.log(`image already downloaded ${fileId}`);
      return Promise.resolve();
    }

    const dest = fs.createWriteStream(filePath);
    console.log('dest')
    console.log(dest)
    const res = await drive.files.get(
      {fileId, alt: 'media'}, //mimeType: 'image/jpg'},
      {responseType: 'stream'}
    );
    await new Promise((resolve, reject) => {
      res.data
      .on('error', reject)
      .pipe(dest)
      .on('error', reject)
      .on('finish', resolve);
    });
  }
}
