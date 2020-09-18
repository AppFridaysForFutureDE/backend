import { OG } from "../models/ogsModel";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getOGContent(): Promise<void> {
    let ogContentAdmin = new SpreadsheetAdmin(process.env.OGCONTENT_SPREADSHEET_ID || "")
    await ogContentAdmin.loadDocumentInfo();
    let rows = await ogContentAdmin.getRows();
    rows.forEach(async row => {
        console.log("saving row:");
        console.log(row["Deine OG"]);
        console.log(await OG.findOne({name: row["Deine OG"]}))
        OG.findOneAndUpdate({ name: row["Deine OG"]}, {
            imageLink: row["Lade dein Bild ein. Bitte als Quadrat!"],
            infoTitle: row["Überschrift"],
            infoText: row["Text"],
            ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        })
    });
}