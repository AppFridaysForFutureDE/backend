import * as dbHandler from "./test-db-handler";
import { OG } from "../models/ogsModel";
import { app } from "../express/app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("GET /api/v1/ogs", () => {
  it("returns the saved og", async () => {
    const newOg = new OG({
      ogId: "test",
      name: "MeinOgName"
    });
    await newOg.save();

    const response = await request(app).get("/api/v1/ogs");
    expect(response.statusCode).toBe(200);
    expect(response.body.ogs[0]["name"]).toBe("MeinOgName");
  });
});
