import * as dbHandler from "./test-db-handler";
import { Strike } from "../models/Strikes";
import { app } from "../app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("get strike route", () => {
  it("returns the saved strike only when showPastStrikes is true", async () => {
    const newOg = new Strike({
      ogId: "test",
      name: "MeinOgName",
      date: 567
    });
    await newOg.save();

    const responsePast = await request(app).get("/api/v1/strikes?ogId=test&showPastStrikes=true");
    expect(responsePast.statusCode).toBe(200);
    expect(responsePast.body.ogId).toBe("test");
    expect(responsePast.body.strikes.length).toBe(1);
    expect(responsePast.body.strikes[0]["name"]).toBe("MeinOgName");

    const responseNoPast = await request(app).get("/api/v1/strikes?ogId=test");
    expect(responseNoPast.statusCode).toBe(200);
    expect(responseNoPast.body.ogId).toBe("test");
    expect(responseNoPast.body.strikes.length).toBe(0);
  });
});
