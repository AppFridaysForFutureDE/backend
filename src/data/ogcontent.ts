import { OG } from "../models/ogsModel";
import { DriveAdmin } from "../services/DriveAdmin";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getOGContent(): Promise<void> {
  const ogContentAdmin = new SpreadsheetAdmin(
    process.env.OGCONTENT_SPREADSHEET_ID || ""
  );
  await ogContentAdmin.loadDocumentInfo();
  const rows = await ogContentAdmin.getRows();
  const driveAdmin = new DriveAdmin();
  rows.forEach(async row => {
    const id = row["Lade dein Bild ein. Bitte als Quadrat!"].split("=")[1];
    console.log(id);
    // TODO: add image type to filename?
    const filename = await driveAdmin.loadFileById(id);
    console.log(filename);
    // TODO: error handeling?
    await OG.findOneAndUpdate(
      { name: row["Deine OG"] },
      {
        // TODO: make address env dependent
        imageLink: `https://app.fffutu.re/api/v1/img/${id}`,
        infoTitle: row["Überschrift"],
        infoText: row["Text"],
        ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
      }
    );
  });
}
