import { Strike } from "../models/strikes";
import { OG } from "../models/ogs";
import * as util from "../utility";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { resolve } from "dns";

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

  const regex = /[0-9]{2}/g;
  const matches = time.match(regex);
  let hour = 0,
    minutes = 0;
  if (matches != null) {
    hour = parseInt(matches[0] || "0");
    minutes = parseInt(matches[1] || "0");
  }

  // TODO: Fix time zone
  const jsDate = new Date(year, month - 1, day, hour - 2, minutes);
  const unixDate = util.toUnixTimestamp(jsDate);

  // TODO
  const now = Date.now();

  const strikeId = "meeting_" + util.hash(createdAt + ogName);

  await Strike.findOneAndUpdate(
    { strikeId: strikeId },
    {
      strikeId: strikeId,
      ogId: og["ogId"],
      name: "Nächstes Plenum:",
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

export const getRows = async (): Promise<string[]> => {
  const doc = new GoogleSpreadsheet(process.env.PLENUM_SPREADSHEET_ID || "");
  doc.useApiKey(process.env.GOOGLE_API_KEY);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows;
};

export async function retrieveMeetings(): Promise<void> {
  let rows: string[];
  try {
    rows = await getRows();
  } catch (e) {
    console.log("Error while retrieving plenum doc");
    console.log(e);
    return;
  } 
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
        console.log(`error while importing row ${row["Zeitstempel"]} ${error}`);
      }
    );
  });
}
