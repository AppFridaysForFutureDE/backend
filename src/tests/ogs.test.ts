import {
  establishConnection,
  closeDatabase,
  clearDatabase
} from "./db-handler";
import { OG } from "../models/ogs";

beforeAll(async () => await establishConnection());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("og ", () => {
  it("can be created correctly", async () => {
    const newOg = new OG({
      ogId: "test",
      name: "MeinOgName"
    });
    await newOg.save();

    const insertedOg = await OG.find({});
    expect(insertedOg[0]["name"]).toEqual("MeinOgName");
  });
});
