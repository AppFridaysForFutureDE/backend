import { Strike } from "../models/strikes";
import { OG } from "../models/ogs";
import * as util from "../utility";

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
