import * as dbHandler from "./test-db-handler";
import { Strike } from "../models/strikes";
import { OG } from "../models/ogs";
import { saveAsStrike } from "../api/meetings";
// const { GoogleSpreadsheet } = require("google-spreadsheet");

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("saveAsStrike", () => {
  it("should save the record", async () => {
    await new OG({
      ogId: "0812f239a",
      name: "München"
    }).save();

    await saveAsStrike(
      "21.04.2020 16:36:38",
      "27.04.2020",
      "17:00",
      "München",
      "Discord",
      "",
      "Telko Link auf Anfrage"
    );

    const strikes = await Strike.find({});
    expect(strikes).toHaveLength(1);
    const strike = strikes[0];
    expect(strike["additionalInfo"]).toBe("Telko Link auf Anfrage");
    expect(strike["date"]).toBe(1587999600);
    expect(strike["eventLink"]).toBe("");
    expect(strike["location"]).toBe("Discord");
    expect(strike["notificationSent"]).toBe(true);
    expect(strike["ogId"]).toBe("0812f239a");
    expect(strike["strikeId"]).toBe("meeting_b1676449a53e2");
    // retrievedAt: "2020-04-21T17:33:51.127Z"
    // _id: "5e9f2ec1e1d90f00a32f07fe"
  });

  // TODO: Test without OG
});
