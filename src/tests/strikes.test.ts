import * as dbHandler from "./test-db-handler";
import { Strike } from "../models/strikesModel";
import { app } from "../express/app";
import request from "supertest";
import Utility from "../utility";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("GET /api/v1/strikes", () => {
  beforeEach(async () => {
    const newStrike = new Strike({
      ogId: "test",
      name: "MeinOgName",
      date: 567
    });
    await newStrike.save();
  });
  it("should return the example object because showPastStrikes is true", async () => {
    const responsePast = await request(app).get(
      "/api/v1/strikes?ogId=test&showPastStrikes=true"
    );
    expect(responsePast.body.ogId).toBe("test");
    expect(responsePast.body.strikes).toHaveLength(1);
    expect(responsePast.body.strikes[0]["name"]).toBe("MeinOgName");
  });
  it("should not return the example object because showPastStrikes isnt given", async () => {
    const responseNoPast = await request(app).get("/api/v1/strikes?ogId=test");
    expect(responseNoPast.body.ogId).toBe("test");
    expect(responseNoPast.body.strikes).toHaveLength(0);
  });
  it("should not return the example object because showPastStrikes isnt set to true", async () => {
    const responseNoPast = await request(app).get(
      "/api/v1/strikes?ogId=test&showPastStrikes=false"
    );
    expect(responseNoPast.body.strikes).toHaveLength(0);
  });
  it("should not return the example object because showPastStrikes is given, but without any value", async () => {
    const responseNoPast = await request(app).get(
      "/api/v1/strikes?ogId=test&showPastStrikes="
    );
    expect(responseNoPast.body.strikes).toHaveLength(0);
  });
  it("edge case, should not return the example object because date is a minute too old", async () => {
    const newStrike = new Strike({
      ogId: "testEdge",
      name: "MeinOgName",
      date: Utility.toUnixTimestamp(new Date()) - Utility.Day - 60
    });
    await newStrike.save();
    const responsePast = await request(app).get(
      "/api/v1/strikes?ogId=testEdge"
    );
    expect(responsePast.body.strikes).toHaveLength(0);
  });
  it("edge case, should return the example object", async () => {
    const newStrike = new Strike({
      ogId: "testEdge",
      name: "MeinOgName",
      date: Utility.toUnixTimestamp(new Date()) - Utility.Day + 60
    });
    await newStrike.save();
    const responsePast = await request(app).get(
      "/api/v1/strikes?ogId=testEdge"
    );
    expect(responsePast.body.strikes).toHaveLength(1);
  });
});
