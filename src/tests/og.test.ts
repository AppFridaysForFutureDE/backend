import {
  establishConnection,
  closeDatabase,
  clearDatabase
} from "./db-handler";
import { Og } from "../models/ogs";

beforeAll(async () => await establishConnection());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("product ", () => {
  it("can be created correctly", async () => {
    const newOg = new Og({
      ogId: "test",
      name: "MeinOgName"
    });

    await newOg.save();
    const insertedUser = await Og.find({});
    expect(insertedUser[0]["name"]).toEqual("MeinOgName");
  });
});
