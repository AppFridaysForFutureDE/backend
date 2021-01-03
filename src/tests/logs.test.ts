import * as dbHandler from "./test-db-handler";
import { Log } from "../models/logModel";
import LogManager from "../LogManager";

beforeAll(async () => await dbHandler.establishConnection());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe("read logs", () => {
  it("Should read the log correctly", async () => {
    await Log.create({
      username: "name",
      time: 1595603717,
      method: "GET",
      endpoint: "/test/path?param=value",
      ip: "192.168.0.1",
    });
    const result = await LogManager.readLogs();
    expect(result[0].action).toBe("GET /test/path?param=value");
    expect(result[0].user).toBe("name");
    expect(result[0].time).toBe("2020-07-24 15:15:17"); //GMT is used
  });
});

describe("clear logs", () => {
  it("Should delete old log", async () => {
    await Log.create({
      username: "name",
      time: 6789,
      method: "GET",
      endpoint: "/test/path?param=value",
      ip: "192.168.0.1",
    });
    await LogManager.cleanLogs();
    const result = await LogManager.readLogs();
    expect(result).toHaveLength(0);
  });

  it("Should not delete recent log", async () => {
    await Log.create({
      username: "name",
      time: 1595603717,
      method: "GET",
      endpoint: "/test/path?param=value",
      ip: "192.168.0.1",
    });
    const result = await LogManager.readLogs();
    expect(result).toHaveLength(1);
  });
});
