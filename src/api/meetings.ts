import { Strike } from "../models/strikes";
import { OG } from "../models/ogs";
import * as util from "../utility";
import { GoogleSpreadsheet } from "google-spreadsheet";
// import nodeFetch from "node-fetch";

// TODO: Doppelte Einträge ignorieren
export async function saveAsStrike(
  createdAt: string,
  date: string,
  time: string,
  ogName: string,
  place: string,
  link: string,
  additionalInfo: string
): Promise<void> {
  const og = await OG.findOne({ name: ogName }, "ogId");
  if (og == null) {
    throw "OG nicht in Datenbank gefunden: " + ogName;
  }

  const [day, month, year] = date.split(".").map(string => parseInt(string));
  // TODO: format could be wrong! parse dd.dd ignore rest
  const [hour, minutes] = time.split(":").map(string => parseInt(string));

  const jsDate = new Date(year, month - 1, day, hour, minutes);
  const unixDate = util.toUnixTimestamp(jsDate);

  // TODO
  const now = Date.now();

  const strikeId = "meeting_" + util.hash(createdAt + ogName);

  await Strike.findOneAndUpdate(
    { strikeId: strikeId },
    {
      strikeId: strikeId,
      ogId: og["ogId"],
      // name: strike["localGroupName"] || "",
      location: place,
      date: unixDate,
      eventLink: link || "",
      additionalInfo: additionalInfo || "",
      notificationSent: true, // TODO
      retrievedAt: now
    },
    { upsert: true }
  );
}

export async function retrieveMeetings(): Promise<void> {
  const doc = new GoogleSpreadsheet(process.env.PLENUM_SPREADSHEET_ID);
  doc.useApiKey(process.env.GOOGLE_API_KEY);
  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows(); // can pass in { limit, offset }
  console.log(sheet.title);
  console.log(sheet.rowCount);

  // const response = await nodeFetch(process.env.PLENUM_SPREADSHEET_TSV_URL || '');
  // let rows = [];
  // try {
  //   console.log(response);
  //   const buffer = await response.buffer();
  //   console.log(buffer);
  // } catch (error) {
  //   console.log(error);
  //   return;
  // }

  rows.forEach(row => {
    saveAsStrike(
      row["Zeitstempel"],
      row["Datum des Plenums"],
      row["Uhrzeit des Plenums"],
      row["Stadt/Ort/Region"],
      row["Adresse des PlenumsOrtes"],
      row["Telefonkonferenz Link"],
      row["Zusätzliche Informationen"]
    ).then(
      () => {
        console.log("successfully imported row " + row["Zeitstempel"]);
      },
      error => {
        console.log("error while importing row " + row["Zeitstempel"] + error);
      }
    );
  });
}
