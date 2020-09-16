import { GoogleSpreadsheet } from "google-spreadsheet";

export const getRows = async (SpreadsheetID: string): Promise<string[]> => {
    const doc = new GoogleSpreadsheet(SpreadsheetID || "");
    doc.useApiKey(process.env.GOOGLE_API_KEY);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows;
  };