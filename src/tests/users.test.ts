import * as dbHandler from "./test-db-handler";
import { User } from "../models/userModel";
import UserManager from "../UserManager";

beforeAll(async () => {
  await dbHandler.establishConnection();
});
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("user management tests", () => {
  beforeEach(async () => {
    await User.create({ name: "name", admin: false });
  });
  it("created a new user", async () => {
    const res = await User.countDocuments({});
    expect(res).toBe(1);
  });
  it("make admin", async () => {
    UserManager.makeAdmin("name");
    const res = await User.find({});
    expect(res[0]["admin"]).toBe(true);
  });
  it("remove user", async () => {
    UserManager.removeUser("name");
    const res = await User.countDocuments({});
    expect(res).toBe(0);
  });
});
