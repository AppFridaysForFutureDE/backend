import { GoogleSpreadsheet } from "google-spreadsheet";

export class SpreadsheetAdmin {
  private Spreadsheet: GoogleSpreadsheet;

  constructor(SpreadsheetID: string) {
    try {
      this.Spreadsheet = new GoogleSpreadsheet(SpreadsheetID);
      this.Spreadsheet.useApiKey(process.env.GOOGLE_API_KEY);
    } catch (e) {
      console.log("Could not access spreadsheet api");
      console.log(e);
    }
  }

  public async loadDocumentInfo() {
    try {
      await this.Spreadsheet.loadInfo(); // loads document properties and worksheets
    } catch (e) {
      console.log("Error while loading Spreadsheet Info");
      console.log(e);
    }
  }

  public async getRows(): Promise<string[]> {
    try {
      const sheet = this.Spreadsheet.sheetsByIndex[0];
      const rows = await sheet.getRows();
      return rows;
    } catch (e) {
      console.log("Error while reading spreadsheet rows");
      console.log(e);
      return [];
    }
  }
}
