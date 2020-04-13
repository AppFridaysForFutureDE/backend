import * as dbHandler from "./test-db-handler";
import { Strike } from "../models/Strikes";
import { app } from "../app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("get strike route", () => {
  beforeEach(async () => {
    const newStrike = new Strike({
      ogId: "test",
      name: "MeinOgName",
      date: 567
    });
    await newStrike.save();
  });
  it("should return the example object because showPastStrikes is true", async () => {
    const responsePast = await request(app).get("/api/v1/strikes?ogId=test&showPastStrikes=true");
    expect(responsePast.statusCode).toBe(200);
    expect(responsePast.body.ogId).toBe("test");
    expect(responsePast.body.strikes.length).toBe(1);
    expect(responsePast.body.strikes[0]["name"]).toBe("MeinOgName");
  });
  it("should not return the example object because showPastStrikes isnt given", async () => {
    const responseNoPast = await request(app).get("/api/v1/strikes?ogId=test");
    expect(responseNoPast.statusCode).toBe(200);
    expect(responseNoPast.body.ogId).toBe("test");
    expect(responseNoPast.body.strikes.length).toBe(0);
  });
  it("should not return the example object because showPastStrikes isnt set to true", async () => {
    const responseNoPast = await request(app).get("/api/v1/strikes?ogId=test&showPastStrikes=false");
    expect(responseNoPast.statusCode).toBe(200);
    expect(responseNoPast.body.ogId).toBe("test");
    expect(responseNoPast.body.strikes.length).toBe(0);
  });
  it("should not return the example object because showPastStrikes is given, but without any value", async () => {
    const responseNoPast = await request(app).get("/api/v1/strikes?ogId=test&showPastStrikes=");
    expect(responseNoPast.statusCode).toBe(200);
    expect(responseNoPast.body.ogId).toBe("test");
    expect(responseNoPast.body.strikes.length).toBe(0);
  });
});
