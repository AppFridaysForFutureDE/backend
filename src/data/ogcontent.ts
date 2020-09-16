import { OG } from "../models/ogsModel";
import { getRows } from "../services/GoogleSpreadsheets";

export async function getOGContent(): Promise<void> {
    let rows: string[];
    try {
        rows = await getRows(process.env.OGCONTENT_SPREADSHEET_ID || "");
    } catch (e) {
        console.log("Error while retrieving ogcontent doc");
        console.log(e);
        return;
    }
    rows.forEach(row => {
        OG.findOneAndUpdate({ name: row["Deine OG"]}, {
            imageLink: row["Lade dein Bild ein. Bitte als Quadrat!"],
            infoTitle: row["Überschrift"],
            infoText: row["Text"],
            ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        })
    });
}