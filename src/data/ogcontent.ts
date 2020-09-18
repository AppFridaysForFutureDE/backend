import { OG } from "../models/ogsModel";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getOGContent(): Promise<void> {

    console.log("get og content");
    console.log("creating spreadsheetadmin");
    let ogContentAdmin = new SpreadsheetAdmin(process.env.OGCONTENT_SPREADSHEET_ID || "")
    console.log("loading doc info");
    await ogContentAdmin.loadDocumentInfo();
    console.log("getting rows");
    let rows = await ogContentAdmin.getRows();
    console.log("starting to save rows");
    rows.forEach(row => {
        console.log("saving row:");
        console.log(row);
        OG.findOneAndUpdate({ name: row["Deine OG"]}, {
            imageLink: row["Lade dein Bild ein. Bitte als Quadrat!"],
            infoTitle: row["Überschrift"],
            infoText: row["Text"],
            ogContentEndDate: row["Bis wann soll dein Artikel in der App bleiben"]
        })
    });
}