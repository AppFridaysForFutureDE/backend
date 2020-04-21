import { Strike } from "../models/strikes";
import { OG } from "../models/ogs";
import * as util from "../utility";
import { GoogleSpreadsheet } from "google-spreadsheet";
import nodeFetch from "node-fetch";

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

  var regex = /[0-9]{2}/g;
  const matches = time.match(regex);
  var hour = 0, minutes = 0;
  if (matches != null) {
    hour = parseInt(matches[0] || "0");
    minutes = parseInt(matches[1] || "0");
  }


  const jsDate = new Date(year, month - 1, day, hour, minutes);
  console.log(jsDate);
  const unixDate = util.toUnixTimestamp(jsDate);
  console.log(unixDate);

  // TODO
  const now = Date.now();

  const strikeId = "meeting_" + util.hash(createdAt + ogName);

  await Strike.findOneAndUpdate(
    { strikeId: strikeId },
    {
      strikeId: strikeId,
      ogId: og["ogId"],
      name: "",
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

// TODO: we need an API Key for this
export const getRows = async (): Promise<string[]> => {
  console.log(process.env.PLENUM_SPREADSHEET_ID);
  const doc = new GoogleSpreadsheet(process.env.PLENUM_SPREADSHEET_ID || "");
  console.log(process.env.GOOGLE_API_KEY);
  doc.useApiKey(process.env.GOOGLE_API_KEY);
  console.log("start loading doc");
  await doc.loadInfo(); // loads document properties and worksheets
  console.log("finished loading doc");
  //console.log(doc.title);
  const sheet = doc.sheetsByIndex[0];
  console.log(sheet.title);
  const rows = await sheet.getRows(); // can pass in { limit, offset }
  console.log(sheet.rowCount);
  return rows;
};

export async function retrieveMeetings(): Promise<void> {
  const rows = await getRows();
  // const rows = await getRowsAlt();
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
