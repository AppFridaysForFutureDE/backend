import { Strike } from "../models/strikesModel";
import { DriveAdmin } from "../services/DriveAdmin";
import Utility from "../Utility";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";

export async function getStrikeImage(): Promise<void> {
  try {
    const strikeImage = new SpreadsheetAdmin(
      process.env.STRIKE_IMAGE_SPREADSHEET_ID || ""
    );
    await strikeImage.loadDocumentInfo();
    const rows = await strikeImage.getRows();
    const driveAdmin = new DriveAdmin();
    await driveAdmin.initConnection();

    rows.forEach(async row => {
      const id = row["Bild hochladen"].split("=")[1];
      const fileType = await driveAdmin.getFileType(id);
      const fileName = `${id}.${fileType}`;

      await driveAdmin.loadFile(id, fileName);

      const ogName = row["Ortsgruppe"];
      /* const strikeDate: Date = */

      /* console.log('strikeDate'); */
      /* console.log(strikeDate); */

      /* 25.09.2020 */
      /* const startTime = Date.parse(row["Datum des Streiks"]); */
      const date = row["Datum des Streiks"];

      const [day, month, year] = date
        .split(".")
        .map(string => parseInt(string));

      const jsDate = new Date(year, month - 1, day);
      const startTime = Utility.toUnixTimestamp(jsDate);
      console.log(startTime);
      // date + 1.day
      const endTime = startTime + 86400;

      const strike = await Strike.findOne({
        name: ogName,
        date: { $gte: startTime, $lte: endTime }
      });

      if (strike) {
        console.log(
          `updating strike for ${ogName} and date ${startTime} with image ${fileName}`
        );
        strike.update({
          // TODO: make address env dependent
          imageUrl: `https://app.fffutu.re/api/v1/img/${fileName}`
        });
      } else {
        console.log(
          `could not find strike for ${ogName} and date ${startTime}`
        );
      }
    });
  } catch (e) {
    console.log("Could not load og content");
    console.log(e);
  }
}
