import { Strike } from "../models/strikesModel";
import { OG } from "../models/ogsModel";
import Utility from "../Utility";
import { SpreadsheetAdmin } from "../services/SpreadsheetAdmin";
import moment from "moment-timezone";

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

  const newDate = moment.tz(
    `${date} ${time}`,
    "DD.MM.YYYY HH:mm",
    "Europe/Berlin"
  );
  const unixDate = newDate.unix();

  const now = Date.now();

  const strikeId = "meeting_" + Utility.hash(createdAt + ogName);

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
      notificationSent: true,
      retrievedAt: now,
    },
    { upsert: true }
  );
}

export async function retrieveMeetings(): Promise<void> {
  const meetingAdmin = new SpreadsheetAdmin(
    process.env.PLENUM_SPREADSHEET_ID || ""
  );
  await meetingAdmin.loadDocumentInfo();
  const rows = await meetingAdmin.getRows();
  rows.forEach((row) => {
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
      (error) => {
        console.log(`error while importing row ${row["Zeitstempel"]} ${error}`);
      }
    );
  });
}
