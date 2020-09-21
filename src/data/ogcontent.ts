import { OG } from "../models/ogsModel";
import { DriveAdmin } from "../services/DriveAdmin";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getOGContent(): Promise<void> {
  try {
    const ogContentAdmin = new SpreadsheetAdmin(
      process.env.OGCONTENT_SPREADSHEET_ID || ""
    );
    await ogContentAdmin.loadDocumentInfo();
    const rows = await ogContentAdmin.getRows();
    const driveAdmin = new DriveAdmin();
    await driveAdmin.initConnection();

    rows.forEach(async row => {
      const id = row["Lade dein Bild ein. Bitte als Quadrat!"].split("=")[1];
      const fileType = await driveAdmin.getFileType(id);
      const fileName = `${id}.${fileType}`;

      await driveAdmin.loadFile(id, fileName);

      await OG.findOneAndUpdate(
        { name: row["Deine OG"] },
        {
          // TODO: make address env dependent
          imageLink: `https://app.fffutu.re/api/v1/img/${fileName}`,
          infoTitle: row["Überschrift"],
          infoText: row["Text"],
          ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        }
      );
    });
  } catch (e) {
    console.log("Could not load og content");
    console.log(e);
  }
}
