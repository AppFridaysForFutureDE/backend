import { OG } from "../models/ogsModel";
import { DriveAdmin } from "../services/DriveAdmin";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getOGContent(): Promise<void> {
    let ogContentAdmin = new SpreadsheetAdmin(process.env.OGCONTENT_SPREADSHEET_ID || "")
    await ogContentAdmin.loadDocumentInfo();
    let rows = await ogContentAdmin.getRows();
    let driveAdmin = new DriveAdmin();
    rows.forEach(async row => {
        // TODO: split 1 ??
        let id = row["Lade dein Bild ein. Bitte als Quadrat!"].split("=")[0];
        console.log(id)
        await driveAdmin.loadFileById(id);
        console.log("finished loading?")
        // TODO
        let filename = id;
        // TODO: error handeling?
        await OG.findOneAndUpdate({ name: row["Deine OG"]}, {
            imageID: id, // TODO remove
            imageLink: `${process.env.WEBSITE_URL}/img/${filename}`
            infoTitle: row["Überschrift"],
            infoText: row["Text"],
            ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        })
    });
}
