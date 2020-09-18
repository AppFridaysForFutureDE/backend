import { OG } from "../models/ogsModel";
import { DriveAdmin } from "../services/DriveAdmin";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getOGContent(): Promise<void> {
    let ogContentAdmin = new SpreadsheetAdmin(process.env.OGCONTENT_SPREADSHEET_ID || "")
    let driveAdmin = new DriveAdmin();
    await ogContentAdmin.loadDocumentInfo();
    let rows = await ogContentAdmin.getRows();
    rows.forEach(async row => {
        let id = row["Lade dein Bild ein. Bitte als Quadrat!"].split("=")[0];
        await driveAdmin.loadImageById(id);
        await OG.findOneAndUpdate({ name: row["Deine OG"]}, {
            imageID: id,
            infoTitle: row["Überschrift"],
            infoText: row["Text"],
            ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        })
    });
}