import { OG } from "../models/ogsModel";
import { SpreadsheetAdmin } from "../services/GoogleSpreadsheets";

export async function getOGContent(): Promise<void> {
    let ogContentAdmin = new SpreadsheetAdmin(process.env.OGCONTENT_SPREADSHEET_ID || "")
    let rows = await ogContentAdmin.getRows();
    rows.forEach(row => {
        OG.findOneAndUpdate({ name: row["Deine OG"]}, {
            imageLink: row["Lade dein Bild ein. Bitte als Quadrat!"],
            infoTitle: row["Überschrift"],
            infoText: row["Text"],
            ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        })
    });
}