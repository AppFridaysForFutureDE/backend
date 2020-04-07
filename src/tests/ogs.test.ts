import * as dbHandler from "../test-db-handler";
import { OG } from "../models/ogs";
import { app } from "../app";
import request from "supertest";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

// Prevent open handles when executing tests
jest.mock("ddos");

describe("get og route", () => {
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
